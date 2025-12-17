"use client"

import React from 'react';
import { CheckCircle, Zap, TrendingUp } from 'lucide-react';

// NOTE: This variable is used for display purposes only, matching your original file structure.
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FooterBranding = () => (
    <footer className="mt-12 w-full max-w-5xl text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
        <p className="font-medium text-gray-500">&copy; 2025 BlogVerse. All rights reserved.</p>
        <p className="mt-1 text-gray-400">The ultimate blog platform.</p>
    </footer>
);

const BrandingLandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 md:p-12">

        {/* Header Section */}
        <header className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                BlogVerse
            </h1>
            <p className="mt-4 text-lg sm:text-xl font-medium text-gray-600 max-w-3xl mx-auto">
                The ultimate blog platform. Transform your content into powerful stories.
            </p>
        </header>

        {/* Feature Grid */}
        <section className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">

            {/* Feature 1: Security */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-100/70 transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-indigo-500">
                <CheckCircle className="w-10 h-10 text-indigo-500 mb-4 stroke-[1.5]" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Seamless & Protected Access</h2>
                <p className="text-gray-500 font-light">
                    Your destination link is protected and delivered safely after a minimal, value-added content sequence. We ensure every step is fast and secure.
                </p>
            </div>

            {/* Feature 2: Monetization */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-cyan-100/70 transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-cyan-500">
                <Zap className="w-10 h-10 text-cyan-500 mb-4 stroke-[1.5]" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Intelligent Monetization</h2>
                <p className="text-gray-500 font-light">
                    We connect users to carefully selected high-value offers (Crypto, Finance, Health) to generate passive income for the link creators.
                </p>
            </div>

            {/* Feature 3: Engagement */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-green-100/70 transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-green-500">
                <TrendingUp className="w-10 h-10 text-green-500 mb-4 stroke-[1.5]" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Maximized Value Exchange</h2>
                <p className="text-gray-500 font-light">
                    Our dynamic, timer-based flow ensures focused attention, providing superior engagement for partners and funding the service you use.
                </p>
            </div>
        </section>

        {/* Action/Info Box */}
        <div className="mt-12 md:mt-20 text-center p-8 bg-indigo-50/70 rounded-3xl shadow-xl max-w-xl w-full border border-indigo-100">
            <p className="text-lg font-semibold text-indigo-800">
                <span className="text-2xl mr-2">🔗</span> Accessing a Shortened Link
            </p>
            <p className="text-sm text-gray-600 mt-2 mb-4">
                To proceed to your shared content, ensure you have the full short URL:
            </p>
            <code className="mt-3 block bg-white text-indigo-700 p-4 rounded-xl font-mono text-base sm:text-lg break-all shadow-md border border-indigo-200">
                <span className="text-gray-400">{NEXT_PUBLIC_BASE_URL}</span>/<span className="font-bold text-indigo-900">[short-code]</span>
            </code>
        </div>

        <FooterBranding />
    </div>
);

export default BrandingLandingPage;
