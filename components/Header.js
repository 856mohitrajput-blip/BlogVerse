"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">
                            BlogVerse
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/about" className="text-gray-700 hover:text-gray-900 transition">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition">
                            Contact Us
                        </Link>
                        <Link href="/privacy" className="text-gray-700 hover:text-gray-900 transition">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-700 hover:text-gray-900 transition">
                            Terms
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-gray-900 px-2 py-1 transition"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-gray-900 px-2 py-1 transition"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/privacy"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-gray-900 px-2 py-1 transition"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-gray-900 px-2 py-1 transition"
                            >
                                Terms
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

