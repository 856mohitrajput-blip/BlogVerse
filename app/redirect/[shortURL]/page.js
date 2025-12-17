"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



export default function RedirectPage({ params }) {
    const router = useRouter();
    const [shortURL, setShortURL] = useState('');
    const [linkData, setLinkData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setShortURL(resolvedParams.shortURL);

            // Get link data from sessionStorage
            const storedData = sessionStorage.getItem('linkData');
            if (storedData) {
                const data = JSON.parse(storedData);
                setLinkData(data);
                
                // Track final proper view (successful completion)
                await fetch('/api/update-statistics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: data.userEmail,
                        location: 'Rest of World',
                        is_proper_view: true
                    }),
                });
            } else {
                // Redirect back to verify if no data
                router.push(`/verify/${resolvedParams.shortURL}`);
                return;
            }
            setIsLoading(false);
        };
        resolveParams();
    }, [params, router]);

    useEffect(() => {
        if (!isLoading && linkData) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    const newCount = prev - 1;
                    return newCount;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isLoading, linkData]);

    // Separate effect to handle redirect when countdown reaches 0
    useEffect(() => {
        if (countdown === 0 && linkData) {
            // Clear session storage
            sessionStorage.removeItem('linkData');

            // Redirect to the actual URL
            window.location.href = linkData.originalUrl;
        }
    }, [countdown, linkData, shortURL]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="max-w-4xl w-full p-12 bg-white rounded-3xl shadow-2xl text-center border border-gray-100">
                <div className="mb-6">
                    <div className="text-4xl text-green-500">🚀</div>
                </div>

                <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Ready for Takeoff!
                </h2>

                <p className="text-2xl text-gray-600 mb-10 font-light">
                    Thank you for using BlogVerse! You&apos;ll be redirected to your destination in just a moment.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl mb-10 border border-green-200">
                    <p className="text-lg font-medium text-gray-700 mb-4">🎯 Your Destination:</p>
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <code className="block text-green-700 overflow-x-auto text-base sm:text-lg font-medium break-all">
                            {linkData?.originalUrl || 'URL Not Available'}
                        </code>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-6 mb-8">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                className="text-gray-200"
                                strokeWidth="6"
                                stroke="currentColor"
                                fill="transparent"
                                r="42"
                                cx="48"
                                cy="48"
                            />
                            <circle
                                className="text-green-500 transition-all duration-1000 ease-linear"
                                strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 42}
                                strokeDashoffset={((5 - countdown) / 5) * (2 * Math.PI * 42)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="42"
                                cx="48"
                                cy="48"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800">
                            {countdown}
                        </span>
                    </div>

                    <div className="text-left">
                        <p className="text-2xl font-semibold text-gray-800">Redirecting in {countdown} seconds</p>
                        <p className="text-lg text-gray-500">Please wait while we prepare your destination</p>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <p className="text-lg text-gray-500 mb-6">
                        If the redirect doesn&apos;t happen automatically:
                    </p>
                    <a
                        href={linkData?.originalUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-emerald-700 transition duration-300 transform hover:scale-105 shadow-lg text-lg"
                    >
                        Click here to continue →
                    </a>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                        <span>✅ Security verified</span>
                        <span>•</span>
                        <span>📊 Analytics recorded</span>
                        <span>•</span>
                        <span>🔒 Safe redirect</span>
                    </div>
                </div>
            </div>
        </div>
    );
}