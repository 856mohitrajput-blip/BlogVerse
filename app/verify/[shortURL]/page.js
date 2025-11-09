"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';

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

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setShortURL(resolvedParams.shortURL);
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

            router.push(`/blog/crypto/${shortURL}`);
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
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
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                            <Image 
                                src="/logo.jpg" 
                                alt="LinkShorti" 
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-lg font-semibold text-gray-900">LinkShorti</span>
                        </div>
                    </div>
                </header>

                {/* Main Blog Content */}
                <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            The Ultimate Guide to URL Shortening and Link Management in 2024
                        </h1>
                        
                        <div className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                            Published on November 9, 2024 • 8 min read
                        </div>

                        {/* Captcha Section - Plain */}
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
                                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-indigo-600"></div>
                                            <span className="text-base sm:text-lg font-semibold text-gray-700">
                                                Please wait for <span className="text-indigo-600">{loadTimer}</span> seconds...
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

                        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                            In today&apos;s digital landscape, URL shortening has become an essential tool for marketers, businesses, and content creators. Whether you&apos;re sharing links on social media, tracking campaign performance, or simply making long URLs more manageable, understanding how to effectively use URL shorteners can significantly impact your online presence.
                        </p>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-8 sm:mt-10 lg:mt-12 mb-3 sm:mb-4">
                            Why URL Shortening Matters
                        </h2>

                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                            URL shortening services have evolved far beyond their original purpose of making links more compact. Modern URL shorteners offer comprehensive analytics, custom branding, link management, and security features that make them indispensable for digital marketing strategies. According to recent studies, shortened URLs can increase click-through rates by up to 39% compared to long, unwieldy links.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            The psychology behind this is simple: shorter, cleaner links appear more trustworthy and professional. They&apos;re easier to remember, share verbally, and fit better in character-limited platforms like Twitter. Additionally, custom-branded short links can reinforce your brand identity with every share, turning each link into a mini-advertisement for your business.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            Key Features of Modern URL Shorteners
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Today&apos;s URL shortening platforms offer a wide array of features designed to maximize the value of every link you share. Advanced analytics provide detailed insights into who&apos;s clicking your links, where they&apos;re located, what devices they&apos;re using, and when they&apos;re most active. This data is invaluable for optimizing your marketing campaigns and understanding your audience better.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Custom domains allow you to create branded short links that reinforce your company identity. Instead of using a generic shortener domain, you can use your own domain to build trust and recognition. Link retargeting capabilities enable you to add retargeting pixels to your shortened URLs, allowing you to build custom audiences for advertising campaigns based on link clicks.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            Security and Trust in URL Shortening
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Security is a critical consideration when using URL shorteners. Malicious actors have historically exploited shortened URLs to disguise phishing links and malware. Reputable URL shortening services implement multiple layers of security, including link scanning, spam detection, and verification systems to protect both link creators and end users.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Modern platforms use advanced technologies like machine learning to identify and block suspicious links before they can cause harm. Many services also implement CAPTCHA verification systems to prevent automated bot traffic and ensure that real humans are accessing the links. This not only protects users but also ensures that your analytics data reflects genuine engagement rather than bot activity.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            Best Practices for Link Management
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Effective link management requires a strategic approach. Start by organizing your links into campaigns or categories, making it easier to track performance across different initiatives. Use descriptive custom aliases when possible, as they&apos;re more memorable and can provide context about the destination. For example, &quot;yoursite.com/summer-sale&quot; is more informative than &quot;yoursite.com/x7k2p&quot;.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Regularly audit your shortened links to ensure they&apos;re still active and pointing to the correct destinations. Broken links can damage your credibility and frustrate users. Many URL shortening platforms offer link expiration features, which can be useful for time-sensitive campaigns or temporary promotions. Set up alerts to notify you when links are approaching their expiration dates.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            Maximizing ROI with Link Analytics
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            The true power of modern URL shorteners lies in their analytics capabilities. By tracking click-through rates, geographic distribution, device types, and referral sources, you can gain deep insights into your audience&apos;s behavior. This data allows you to optimize your content strategy, adjust your targeting, and allocate resources more effectively.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Compare performance across different channels to identify which platforms drive the most engagement for your content. A/B test different link placements, call-to-action phrases, and posting times to continuously improve your results. Use the data to inform broader marketing decisions, such as which products to promote, which content formats resonate best, and which audience segments are most valuable.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            The Future of URL Shortening
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            As technology continues to evolve, URL shortening services are incorporating more sophisticated features. Artificial intelligence and machine learning are being used to predict optimal posting times, suggest content improvements, and automatically categorize links. Integration with other marketing tools is becoming seamless, allowing for more comprehensive campaign management from a single platform.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Privacy-focused features are also gaining prominence, with services offering options to anonymize user data while still providing valuable aggregate insights. Blockchain technology is being explored for creating immutable link records and preventing link manipulation. The future of URL shortening is not just about making links shorter, but about making them smarter, safer, and more valuable for businesses and users alike.
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            Conclusion
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            URL shortening has evolved from a simple convenience into a powerful marketing tool that provides valuable insights, enhances brand recognition, and improves user experience. By choosing the right platform and implementing best practices, you can transform every link you share into an opportunity for engagement, learning, and growth. Whether you&apos;re a small business owner, a social media manager, or a digital marketing professional, mastering URL shortening and link management is essential for success in today&apos;s digital world.
                        </p>

                        <div className="border-t border-gray-200 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Related Articles</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                <li>
                                    <a href="#" className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700">
                                        10 Ways to Boost Your Link Click-Through Rate
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700">
                                        Understanding Link Analytics: A Complete Guide
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700">
                                        How to Create Effective Marketing Campaigns with Short Links
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </article>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                                    <Image 
                                        src="/logo.jpg" 
                                        alt="LinkShorti Logo" 
                                        width={32}
                                        height={32}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover"
                                    />
                                    <span className="text-lg sm:text-xl font-bold text-white">LinkShorti</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    The ultimate URL shortening and link management platform.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <li><a href="#" className="hover:text-white transition">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition">Analytics</a></li>
                                    <li><a href="#" className="hover:text-white transition">API</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
                                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                                    <li><a href="#" className="hover:text-white transition">Support</a></li>
                                    <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
                                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                    <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
                            <p>&copy; 2024 LinkShorti. All rights reserved.</p>
                            <p className="mt-1 sm:mt-2 text-gray-500">Secure, reliable, and fast URL shortening service.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
