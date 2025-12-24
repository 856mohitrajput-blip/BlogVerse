"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function DynamicBlogPage({ params }) {
    const router = useRouter();
    const [shortURL, setShortURL] = useState('');
    const [timer, setTimer] = useState(15);
    const [linkData, setLinkData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingNextBlog, setIsLoadingNextBlog] = useState(false);
    const [blog, setBlog] = useState(null);
    const [blogIndex, setBlogIndex] = useState(0);
    const [isLastBlog, setIsLastBlog] = useState(false);
    const [showRobotButton, setShowRobotButton] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const [showGoLinkButton, setShowGoLinkButton] = useState(false);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [continueTimer, setContinueTimer] = useState(5);
    const [continueTimerStarted, setContinueTimerStarted] = useState(false);
    const [showGetLinkButton, setShowGetLinkButton] = useState(false);
    const [autoRedirectTimer, setAutoRedirectTimer] = useState(5);
    const [currentStep, setCurrentStep] = useState(1);
    const TOTAL_BLOGS = 3; // 3 blogs total (step 1, 2, 3)
    
    // Use refs to track state without causing re-renders
    const viewedBlogIdsRef = useRef([]);
    const isInitializedRef = useRef(false);
    const continueButtonRef = useRef(null);
    const hasAutoStartedTimer = useRef(false);

    // Function to load random blog - doesn't depend on state that changes frequently
    const loadRandomBlog = async (excludeIds = [], forceStep = null) => {
        try {
            // Fetch random blog without category filter
            const blogResponse = await fetch('/api/get-random-blog');
            const blogData = await blogResponse.json();
            
            if (blogData.success && blogData.blog) {
                let finalBlog = blogData.blog;
                const blogId = blogData.blog._id.toString();
                
                // If we've already seen this blog, try again (max 5 attempts)
                if (excludeIds.includes(blogId)) {
                    let attempts = 0;
                    while (excludeIds.includes(finalBlog._id.toString()) && attempts < 5) {
                        const retryResponse = await fetch('/api/get-random-blog');
                        const retryData = await retryResponse.json();
                        if (retryData.success && retryData.blog) {
                            finalBlog = retryData.blog;
                        }
                        attempts++;
                    }
                }
                
                // Update viewed blog IDs ref
                const newViewedIds = [...excludeIds, finalBlog._id.toString()];
                viewedBlogIdsRef.current = newViewedIds;
                
                // Check if this is the last blog
                const totalViewed = newViewedIds.length;
                setIsLastBlog(totalViewed >= TOTAL_BLOGS || forceStep === 3);
                
                // Reset button states for new blog
                setShowRobotButton(false);
                // Step calculation: newViewedIds.length is the count after adding current blog
                // blogIndex 0 = step 1, blogIndex 1 = step 2, blogIndex 2 = step 3
                // Use forceStep if provided, otherwise calculate from viewed count
                const step = forceStep !== null ? forceStep : newViewedIds.length; // step 1, 2, or 3
                setCurrentStep(step); // Update step state
                hasAutoStartedTimer.current = false; // Reset auto-start flag for new blog
                
                if (step === 1) {
                    // Step 1: Show continue button at bottom
                    setTimerStarted(false);
                    setShowGoLinkButton(false);
                    setShowContinueButton(true);
                } else if (step === 2) {
                    // Step 2: Show continue button at bottom (will auto-start timer when scrolled into view)
                    setTimerStarted(false);
                    setShowGoLinkButton(false);
                    setShowContinueButton(true);
                } else if (step === 3) {
                    // Step 3: Start timer, show "your link will be ready soon"
                    setTimerStarted(true);
                    setShowGoLinkButton(false);
                    setShowContinueButton(false);
                    setShowGetLinkButton(false);
                    setTimer(15); // Reset timer for step 3
                    setAutoRedirectTimer(45); // Reset auto-redirect timer
                }
                setContinueTimer(5);
                setContinueTimerStarted(false);
                
                setBlog(finalBlog);
                
                return finalBlog;
            }
        } catch (error) {
            console.error('Error loading blog:', error);
        }
        return null;
    };

    // Initialize on mount - only runs once
    useEffect(() => {
        if (isInitializedRef.current) return;
        
        const initializePage = async () => {
            const resolvedParams = await params;
            setShortURL(resolvedParams.shortURL);

            const storedData = sessionStorage.getItem('linkData');
            if (storedData) {
                const data = JSON.parse(storedData);
                setLinkData(data);

                // Update statistics
                await fetch('/api/update-statistics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: data.userEmail,
                        location: 'Rest of World'
                    }),
                });

                // Load first random blog (step 2 of overall flow - step 1 was verify page)
                const firstBlog = await loadRandomBlog([]);
                if (firstBlog) {
                    // This is step 2 of overall flow (step 1 was verify page)
                    // loadRandomBlog will set currentStep to 1 (first blog in blog page)
                    // But we need to show step 2/3 in the counter
                    // So we'll adjust: when blog page loads, it's step 2 of overall flow
                    setShowContinueButton(true);
                }
                isInitializedRef.current = true;
            } else {
                router.push(`/verify/${resolvedParams.shortURL}`);
                return;
            }
            setIsLoading(false);
        };
        
        initializePage();
    }, [params, router]);

    // Calculate step flags
    const isStep1 = currentStep === 1;
    const isStep2 = currentStep === 2;
    const isStep3 = currentStep === 3;
    
    // Intersection Observer for step 2 - auto-start timer when continue button area comes into view
    useEffect(() => {
        if (!isStep2 || !continueButtonRef.current || hasAutoStartedTimer.current) {
            return;
        }
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAutoStartedTimer.current) {
                        // Auto-start timer when scrolled into view
                        hasAutoStartedTimer.current = true;
                        setContinueTimerStarted(true);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible
            }
        );
        
        observer.observe(continueButtonRef.current);
        
        return () => {
            if (continueButtonRef.current) {
                observer.unobserve(continueButtonRef.current);
            }
        };
    }, [isStep2, blog]);

    // Auto-scroll to top when step 3 starts
    useEffect(() => {
        if (isStep3 && blog && !isLoadingNextBlog) {
            // Scroll to top when step 3 blog loads
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [isStep3, blog, isLoadingNextBlog]);

    // Timer countdown (for step 3 only - shows "your link will be ready soon")
    useEffect(() => {
        if (timerStarted && timer > 0 && !isLoading && blog && !isLoadingNextBlog && isStep3) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    const newValue = prev - 1;
                    if (newValue === 0) {
                        // Step 3 timer finished, show "Get Link" button
                        setShowGetLinkButton(true);
                        // Start auto-redirect timer (45 seconds)
                        setAutoRedirectTimer(45);
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timerStarted, timer, isLoading, blog, isLoadingNextBlog, isStep3]);

    // Auto-redirect timer for step 3 (if "Get Link" button not clicked)
    useEffect(() => {
        if (showGetLinkButton && autoRedirectTimer > 0 && isStep3 && linkData) {
            const timer = setInterval(() => {
                setAutoRedirectTimer(prev => {
                    const newValue = prev - 1;
                    if (newValue === 0) {
                        // Auto-redirect after 45 seconds - redirect in same tab
                        window.location.href = linkData.originalUrl;
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showGetLinkButton, autoRedirectTimer, isStep3, linkData]);

    // Handle "Get Link" button click
    const handleGetLinkClick = () => {
        if (linkData && linkData.originalUrl) {
            // Open in new tab
            window.open(linkData.originalUrl, '_blank');
        } else {
            console.error('Link data not available for redirect');
            alert('Link not available. Please try again.');
        }
    };

    // Handle "Dual tap Go link" button - scroll down
    const handleGoLinkClick = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
        setShowContinueButton(true);
    };


    // Handle "Dual tap Continue" button click
    const handleContinueButtonClick = () => {
        setContinueTimerStarted(true);
    };

    const handleContinue = useCallback(async () => {
        if (isLastBlog && linkData) {
            // Last blog - redirect to final destination (open in new tab)
            window.open(linkData.originalUrl, '_blank');
        } else {
            // Show loading state while fetching next blog
            setIsLoadingNextBlog(true);
            
            // If on step 1, skip to step 3 directly (final step)
            if (currentStep === 1) {
                // Load one blog and force it to be step 3 (last step)
                const newBlog = await loadRandomBlog(viewedBlogIdsRef.current, 3);
                
                if (newBlog) {
                    setBlogIndex(2); // Set to last index
                }
            } else {
                // Normal flow for step 2
                const newBlog = await loadRandomBlog(viewedBlogIdsRef.current);
                
                if (newBlog) {
                    setBlogIndex(prev => prev + 1);
                    setTimer(15);
                }
            }
            
            setIsLoadingNextBlog(false);
        }
    }, [isLastBlog, linkData, currentStep]);

    // Continue timer after "Dual tap Continue" is clicked
    useEffect(() => {
        if (continueTimerStarted && continueTimer > 0) {
            const timer = setInterval(() => {
                setContinueTimer(prev => {
                    const newValue = prev - 1;
                    if (newValue === 0) {
                        // Timer finished, proceed to next blog or final destination
                        handleContinue();
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [continueTimerStarted, continueTimer, handleContinue]);

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


    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Fixed Step Counter - Always visible at top */}
            {!isLoading && (
                <div className="sticky top-16 z-40 py-2 px-4 text-center border-b border-gray-200 bg-white">
                    <p className="text-sm sm:text-base font-semibold text-gray-700">
                        You are on step <span className="font-bold text-lg text-blue-600">{Math.min(currentStep + 1, 3)}</span>/3
                    </p>
                </div>
            )}

            {/* Loading overlay for next blog */}
            {isLoadingNextBlog && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading next article...</p>
                    </div>
                </div>
            )}

            {/* Main Blog Content */}
            <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                    {blog ? (
                        <>
                            {/* Step 2: Show "Scroll Down to get the link" at top */}
                            {(isStep2 || isStep1) && (
                                <div className="mb-8 text-center">
                                    <button
                                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg text-base sm:text-lg cursor-default"
                                        disabled
                                    >
                                        👇 Scroll Down to get the link 👇
                                    </button>
                                </div>
                            )}

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                {blog.title}
                            </h1>
                            
                            <div className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                                {blog.category} • {new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime || '5 min read'}
                            </div>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                                {blog.excerpt}
                            </p>

                            {/* Step 3: Timer or "Get Link" button at top - BEFORE content */}
                            {isStep3 && (
                                <div className="my-8 text-center">
                                    {timerStarted && timer > 0 ? (
                                        // Show timer while counting down
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                            <p className="text-base sm:text-lg font-semibold text-gray-700">
                                                Your link will be ready soon, please wait...
                                            </p>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Please wait for <span className="font-semibold text-blue-600">{timer}</span> seconds...
                                            </p>
                                        </div>
                                    ) : showGetLinkButton ? (
                                        // Show "Get Link" button when timer finishes (replaces timer)
                                        <div className="flex flex-col items-center space-y-4">
                                            {linkData && linkData.originalUrl ? (
                                                <>
                                                    <button
                                                        onClick={handleGetLinkClick}
                                                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg text-base sm:text-lg"
                                                    >
                                                        Click here
                                                    </button>
                                                    {autoRedirectTimer > 0 && (
                                                        <p className="text-sm text-gray-600">
                                                            Auto-redirecting in <span className="font-semibold text-blue-600">{autoRedirectTimer}</span> seconds...
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-red-600 font-semibold">Error: Link data not available. Please refresh the page.</p>
                                            )}
                                        </div>
                                    ) : (
                                        // Show message if timer finished but button not shown yet
                                        <p className="text-base sm:text-lg font-semibold text-gray-700">
                                            Preparing your link...
                                        </p>
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
                        
                        {/* Step 1 & 2: Continue Button at Bottom of Page */}
                        {(isStep1 || isStep2) && showContinueButton && (
                            <div ref={continueButtonRef} className="mt-12 mb-8 text-center">
                                {continueTimerStarted && continueTimer > 0 ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            Please wait for <span className="font-semibold text-blue-600">{continueTimer}</span> seconds...
                                        </p>
                                    </div>
                                ) : isStep1 ? (
                                    // Step 1: Show button (manual click)
                                    <button
                                        onClick={handleContinueButtonClick}
                                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-lg text-base sm:text-lg"
                                    >
                                        Dual tap "Next"
                                    </button>
                                ) : (
                                    // Step 2: Show message that timer will start when scrolled into view
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-sm sm:text-base text-gray-600">
                                            Scroll to see timer...
                                        </p>
                                    </div>
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

