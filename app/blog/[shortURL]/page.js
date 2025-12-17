"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// All available timer positions (never at top - always after title, category, and excerpt)
const ALL_POSITIONS = [
    'middle',   // After excerpt, before content
    'bottom'    // Full timer at bottom
];

export default function DynamicBlogPage({ params }) {
    const router = useRouter();
    const [shortURL, setShortURL] = useState('');
    const [timer, setTimer] = useState(15);
    const [linkData, setLinkData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [blog, setBlog] = useState(null);
    const [blogIndex, setBlogIndex] = useState(0);
    const [viewedBlogIds, setViewedBlogIds] = useState([]);
    const [isLastBlog, setIsLastBlog] = useState(false);
    const [timerPosition, setTimerPosition] = useState('middle'); // Multiple position options
    const [usedPositions, setUsedPositions] = useState([]); // Track used positions to avoid repeats
    const TOTAL_BLOGS = 4; // Show 4 random blogs before redirecting

    const loadRandomBlog = useCallback(async (excludeIds = []) => {
        try {
            // Fetch random blog without category filter
            const blogResponse = await fetch('/api/get-random-blog');
            const blogData = await blogResponse.json();
            
            if (blogData.success && blogData.blog) {
                const blogId = blogData.blog._id.toString();
                
                // If we've already seen this blog, try again (max 5 attempts)
                if (excludeIds.includes(blogId)) {
                    let attempts = 0;
                    let newBlog = blogData.blog;
                    while (excludeIds.includes(newBlog._id.toString()) && attempts < 5) {
                        const retryResponse = await fetch('/api/get-random-blog');
                        const retryData = await retryResponse.json();
                        if (retryData.success && retryData.blog) {
                            newBlog = retryData.blog;
                        }
                        attempts++;
                    }
                    setBlog(newBlog);
                    setViewedBlogIds([...excludeIds, newBlog._id.toString()]);
                } else {
                    setBlog(blogData.blog);
                    setViewedBlogIds([...excludeIds, blogId]);
                }
                
                // Check if this is the last blog (after adding this one, we'll have shown TOTAL_BLOGS)
                const totalViewed = excludeIds.length + 1;
                setIsLastBlog(totalViewed >= TOTAL_BLOGS);
                
                // Randomize timer position - NEVER consecutive same position
                // Get the last used position (the immediately previous blog's position)
                const lastPosition = usedPositions.length > 0 ? usedPositions[usedPositions.length - 1] : null;
                
                // Filter out the last position to ensure no consecutive repeats
                const availablePositions = lastPosition 
                    ? ALL_POSITIONS.filter(pos => pos !== lastPosition)
                    : ALL_POSITIONS;
                
                // Ensure we have at least one available position
                if (availablePositions.length === 0) {
                    // Fallback: use all positions if somehow all are filtered out
                    availablePositions.push(...ALL_POSITIONS);
                }
                
                // Randomly select from available positions (excluding last position)
                const randomIndex = Math.floor(Math.random() * availablePositions.length);
                const randomPosition = availablePositions[randomIndex];
                
                // Set position immediately
                setTimerPosition(randomPosition);
                
                // Add to used positions (keep only last position to track consecutive)
                setUsedPositions(prev => {
                    const updated = [...prev, randomPosition];
                    // Keep only last position to check consecutive repeats
                    return [randomPosition];
                });
            }
        } catch (error) {
            console.error('Error loading blog:', error);
        }
    }, [usedPositions]);

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setShortURL(resolvedParams.shortURL);

            const storedData = sessionStorage.getItem('linkData');
            if (storedData) {
                const data = JSON.parse(storedData);
                setLinkData(data);

                await fetch('/api/update-statistics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: data.userEmail,
                        location: 'Rest of World'
                    }),
                });

                // Randomize timer position for first blog
                const randomIndex = Math.floor(Math.random() * ALL_POSITIONS.length);
                const randomPosition = ALL_POSITIONS[randomIndex];
                setTimerPosition(randomPosition);
                setUsedPositions([randomPosition]); // Track first position

                // Fetch first random blog (no category filter - any blog from DB)
                await loadRandomBlog([]);
            } else {
                router.push(`/verify/${resolvedParams.shortURL}`);
                return;
            }
            setIsLoading(false);
        };
        resolveParams();
    }, [params, router, loadRandomBlog]);

    useEffect(() => {
        if (timer > 0 && !isLoading && blog) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isLoading, blog]);

    const handleContinue = () => {
        if (timer === 0) {
            if (isLastBlog && linkData) {
                // Last blog - redirect to final destination
                window.location.href = linkData.originalUrl;
            } else {
                // Load next random blog
                setBlogIndex(prev => {
                    const newIndex = prev + 1;
                    setTimer(15);
                    // Reset blog to null to show loading state
                    setBlog(null);
                    // Load next blog - position will be randomized in loadRandomBlog
                    // and will exclude the last position to avoid consecutive repeats
                    loadRandomBlog(viewedBlogIds);
                    return newIndex;
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const isReady = timer === 0;

    // Step calculation: Verify page is step 1, so blogs start from step 2
    const currentStep = blogIndex + 2; // +2 because verify is step 1, first blog is step 2

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Fixed Step Counter - Always visible at top */}
            <div className="sticky top-16 z-40 py-2 px-4 text-center border-b border-gray-200">
                <p className="text-sm sm:text-base font-semibold text-gray-700">
                    You are on step <span className="font-bold text-lg text-blue-600">{currentStep}</span>/5
                </p>
            </div>

            {/* Main Blog Content */}
            <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                    {blog ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                {blog.title}
                            </h1>
                            
                            <div className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                                {blog.category} • {new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime || '5 min read'}
                            </div>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                                {blog.excerpt}
                            </p>

                            {/* Timer in Middle (after excerpt, before content) */}
                            {timerPosition === 'middle' && (
                                <div className="my-8 text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        {!isReady && (
                                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                        )}
                                        <p className="text-sm sm:text-base text-gray-600">
                                            Please wait for <span className="font-semibold text-blue-600">{timer}</span> seconds to continue...
                                        </p>
                                    </div>
                                    
                                    {isReady && (
                                        <button
                                            onClick={handleContinue}
                                            className="mt-4 text-base sm:text-lg font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer transition"
                                        >
                                            Continue →
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                            {blog.content ? (
                                <div 
                                    className="text-gray-700 leading-relaxed blog-content"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    Content loading...
                                </p>
                            )}
                        </div>

                        {/* Timer at Bottom (full at bottom) */}
                        {timerPosition === 'bottom' && (
                            <div className="mt-8 sm:mt-10 text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    {!isReady && (
                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                    )}
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Please wait for <span className="font-semibold text-blue-600">{timer}</span> seconds to continue...
                                    </p>
                                </div>
                                
                                {isReady && (
                                    <button
                                        onClick={handleContinue}
                                        className="mt-4 text-base sm:text-lg font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer transition"
                                    >
                                        Continue →
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <style jsx global>{`
                            .blog-content h1 {
                                font-size: 2.25rem;
                                font-weight: 700;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                line-height: 1.2;
                                color: #111827;
                            }
                            .blog-content h2 {
                                font-size: 1.875rem;
                                font-weight: 700;
                                margin-top: 1.5rem;
                                margin-bottom: 0.75rem;
                                line-height: 1.3;
                                color: #111827;
                            }
                            .blog-content h3 {
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin-top: 1.25rem;
                                margin-bottom: 0.5rem;
                                line-height: 1.4;
                                color: #111827;
                            }
                            .blog-content h4 {
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin-top: 1rem;
                                margin-bottom: 0.5rem;
                                line-height: 1.4;
                                color: #111827;
                            }
                            .blog-content p {
                                margin-bottom: 1rem;
                                line-height: 1.75;
                            }
                            .blog-content ul, .blog-content ol {
                                margin: 1rem 0;
                                padding-left: 2rem;
                            }
                            .blog-content ul {
                                list-style-type: disc;
                            }
                            .blog-content ol {
                                list-style-type: decimal;
                            }
                            .blog-content li {
                                margin-bottom: 0.5rem;
                                line-height: 1.75;
                            }
                            .blog-content hr {
                                border: none;
                                border-top: 2px solid #e5e7eb;
                                margin: 2rem 0;
                            }
                            .blog-content strong {
                                font-weight: 700;
                            }
                            .blog-content em {
                                font-style: italic;
                            }
                            .blog-content u {
                                text-decoration: underline;
                            }
                        `}</style>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Loading Article...
                            </h1>
                            <p className="text-base sm:text-lg text-gray-700">Please wait while we load the content.</p>
                        </> 
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
}

