"use client"

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-600">
                        &copy; 2025 BlogVerse. All rights reserved.
                    </div>
                    <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">
                            Contact Us
                        </Link>
                        <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition">
                            Terms
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

