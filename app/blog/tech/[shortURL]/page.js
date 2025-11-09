"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TechBlogPage({ params }) {
    const router = useRouter();
    const [shortURL, setShortURL] = useState('');
    const [timer, setTimer] = useState(15);
    const [linkData, setLinkData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [blog, setBlog] = useState(null);

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

                // Fetch random tech blog
                const blogResponse = await fetch('/api/get-random-blog?category=Technology');
                const blogData = await blogResponse.json();
                if (blogData.success) {
                    setBlog(blogData.blog);
                }
            } else {
                router.push(`/verify/${resolvedParams.shortURL}`);
                return;
            }
            setIsLoading(false);
        };
        resolveParams();
    }, [params, router]);

    useEffect(() => {
        if (timer > 0 && !isLoading) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isLoading]);

    const handleContinue = () => {
        if (timer === 0 && linkData) {
            window.location.href = linkData.originalUrl;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const isReady = timer === 0;

    return (
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
                    {blog ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                {blog.title}
                            </h1>
                            
                            <div className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                                {blog.category} • {new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime}
                            </div>

                            {blog.image && (
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    width={800}
                                    height={400}
                                    className="w-full h-48 sm:h-56 object-cover rounded-lg mb-4 sm:mb-6"
                                />
                            )}

                            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                                {blog.excerpt}
                            </p>

                            <div className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed whitespace-pre-line mb-4 sm:mb-6">
                                {blog.content}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Loading Article...
                            </h1>
                            <p className="text-base sm:text-lg text-gray-700">Please wait while we load the content.</p>
                        </>
                    )}

                    {/* Timer and Continue Button - Center of page */}
                    <div className="my-8 sm:my-10 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            {!isReady && (
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-indigo-600"></div>
                            )}
                            <p className="text-sm sm:text-base text-gray-600">
                                Please wait for <span className="font-semibold text-indigo-600">{timer}</span> seconds to continue...
                            </p>
                        </div>
                        
                        {isReady && (
                            <button
                                onClick={handleContinue}
                                className="mt-4 text-base sm:text-lg font-medium text-indigo-600 hover:text-indigo-700 underline cursor-pointer transition"
                            >
                                Continue to Your Destination →
                            </button>
                        )}
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
    );
}
