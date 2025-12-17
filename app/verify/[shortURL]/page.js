"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Real API calls
const verifyRecaptcha = async (token) => {
    const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    return response.json();
};

const getLinkDetails = async (shortUrl) => {
    const response = await fetch('/api/get-link-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortUrl }),
    });
    return response.json();
};

export default function VerifyPage({ params }) {
    const router = useRouter();
    const [shortURL, setShortURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [loadTimer, setLoadTimer] = useState(10);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [blog, setBlog] = useState(null);
    const [timerPosition, setTimerPosition] = useState('top'); // 'top', 'middle', 'bottom'

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setShortURL(resolvedParams.shortURL);
            
            // Fetch random blog from database
            try {
                const blogResponse = await fetch('/api/get-random-blog');
                const blogData = await blogResponse.json();
                if (blogData.success && blogData.blog) {
                    setBlog(blogData.blog);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
            
            // Randomize timer position
            const positions = ['top', 'middle', 'bottom'];
            const randomPosition = positions[Math.floor(Math.random() * positions.length)];
            setTimerPosition(randomPosition);
            
            setIsLoading(false);
        };
        resolveParams();
    }, [params]);

    // Countdown timer before showing captcha
    useEffect(() => {
        if (!isLoading && loadTimer > 0) {
            const timer = setInterval(() => {
                setLoadTimer(prev => {
                    const newValue = prev - 1;
                    if (newValue === 0) {
                        setShowCaptcha(true);
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLoading, loadTimer]);

    const handleRecaptchaSuccess = useCallback(async (token) => {
        setIsVerifying(true);
        setError(null);
        
        try {
            const recaptchaResult = await verifyRecaptcha(token);
            
            if (!recaptchaResult.success) {
                setError(recaptchaResult.error || 'reCAPTCHA verification failed');
                return;
            }

            const linkData = await getLinkDetails(shortURL);
            
            if (linkData.error) {
                setError(linkData.error);
                return;
            }

            sessionStorage.setItem('linkData', JSON.stringify({
                originalUrl: linkData.originalUrl,
                userEmail: linkData.userEmail,
                shortURL: shortURL,
                recaptchaToken: token,
                verifiedAt: new Date().toISOString()
            }));

            router.push(`/blog/${shortURL}`);
        } catch (error) {
            console.error('Error during verification:', error);
            setError('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    }, [shortURL, router]);

    // Set up global callbacks for reCAPTCHA
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.onRecaptchaSuccess = (token) => {
                handleRecaptchaSuccess(token);
            };
            window.onRecaptchaError = () => {
                setError('reCAPTCHA verification failed. Please try again.');
            };
        }
    }, [handleRecaptchaSuccess]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {showCaptcha && (
                <Script
                    src="https://www.google.com/recaptcha/api.js"
                    strategy="lazyOnload"
                />
            )}

            <div className="min-h-screen bg-white">
                <Header />

                {/* Fixed Step Counter - Always visible at top */}
                <div className="sticky top-16 z-40 py-2 px-4 text-center border-b border-gray-200">
                    <p className="text-sm sm:text-base font-semibold text-gray-700">
                        You are on step <span className="font-bold text-lg text-blue-600">1</span>/5
                    </p>
                </div>

                {/* Main Blog Content */}
                <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                        {blog ? (
                            <>
                                {/* Timer at Top */}
                                {timerPosition === 'top' && (
                                    <div className="mb-8">
                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                                                <p className="text-red-700 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-center mb-4 sm:mb-6">
                                            {!showCaptcha ? (
                                                <div className="text-center px-4">
                                                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                                        <span className="text-base sm:text-lg font-semibold text-gray-700">
                                                            Please wait for <span className="text-blue-600">{loadTimer}</span> seconds...
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="scale-90 sm:scale-100 origin-center">
                                                    <div
                                                        className="g-recaptcha"
                                                        data-sitekey="6LfcuvcrAAAAAG6BSOLy_gQps5JMWqpcs5Wiegqi"
                                                        data-callback="onRecaptchaSuccess"
                                                        data-error-callback="onRecaptchaError"
                                                    ></div>
                                                </div>
                                            )}
                                        </div>

                                        {isVerifying && (
                                            <div className="flex justify-center items-center space-x-2 text-gray-600 text-xs sm:text-sm mb-4">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                <span>Verifying...</span>
                                            </div>
                                        )}
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

                                {/* Timer in Middle - Split content */}
                                {timerPosition === 'middle' && (
                                    <div className="my-8">
                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                                                <p className="text-red-700 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-center mb-4 sm:mb-6">
                                            {!showCaptcha ? (
                                                <div className="text-center px-4">
                                                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                                        <span className="text-base sm:text-lg font-semibold text-gray-700">
                                                            Please wait for <span className="text-blue-600">{loadTimer}</span> seconds...
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="scale-90 sm:scale-100 origin-center">
                                                    <div
                                                        className="g-recaptcha"
                                                        data-sitekey="6LfcuvcrAAAAAG6BSOLy_gQps5JMWqpcs5Wiegqi"
                                                        data-callback="onRecaptchaSuccess"
                                                        data-error-callback="onRecaptchaError"
                                                    ></div>
                                                </div>
                                            )}
                                        </div>

                                        {isVerifying && (
                                            <div className="flex justify-center items-center space-x-2 text-gray-600 text-xs sm:text-sm mb-4">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                <span>Verifying...</span>
                                            </div>
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
                                
                                {/* Timer at Bottom */}
                                {timerPosition === 'bottom' && (
                                    <div className="mt-8">
                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                                                <p className="text-red-700 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-center mb-4 sm:mb-6">
                                            {!showCaptcha ? (
                                                <div className="text-center px-4">
                                                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-blue-600"></div>
                                                        <span className="text-base sm:text-lg font-semibold text-gray-700">
                                                            Please wait for <span className="text-blue-600">{loadTimer}</span> seconds...
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="scale-90 sm:scale-100 origin-center">
                                                    <div
                                                        className="g-recaptcha"
                                                        data-sitekey="6LfcuvcrAAAAAG6BSOLy_gQps5JMWqpcs5Wiegqi"
                                                        data-callback="onRecaptchaSuccess"
                                                        data-error-callback="onRecaptchaError"
                                                    ></div>
                                                </div>
                                            )}
                                        </div>

                                        {isVerifying && (
                                            <div className="flex justify-center items-center space-x-2 text-gray-600 text-xs sm:text-sm mb-4">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                <span>Verifying...</span>
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
        </>
    );
}
