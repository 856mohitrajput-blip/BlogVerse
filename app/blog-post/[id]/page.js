"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BlogPostPage({ params }) {
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blogId, setBlogId] = useState('');

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setBlogId(resolvedParams.id);
        };
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!blogId) return;

        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/get-blog/${blogId}`);
                const data = await response.json();
                
                if (data.success) {
                    setBlog(data.blog);
                } else {
                    console.error('Blog not found');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => router.push('/')} className="flex items-center space-x-3">
                            <Image 
                                src="/logo.jpg" 
                                alt="LinkShorti" 
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-lg font-semibold text-gray-900">LinkShorti</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Blog Content */}
            <main className="py-8 sm:py-12">
                <article className="w-full">
                    <div className="px-4">
                        {/* Back button */}
                        <button
                            onClick={() => router.push('/')}
                            className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Home</span>
                        </button>

                        {/* Category badge */}
                        <span className="inline-block text-xs font-semibold text-indigo-600 uppercase mb-4">
                            {blog.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
                            <span>{blog.readTime}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                    </div>

                    {/* Featured image */}
                    {blog.image && (
                        <div className="px-4">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                width={1200}
                                height={400}
                                className="w-full h-48 sm:h-64 object-cover rounded-lg mb-8"
                            />
                        </div>
                    )}

                    <div className="px-4">
                        {/* Excerpt */}
                        <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                            {blog.excerpt}
                        </p>

                        {/* Content */}
                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                        {blog.content ? (
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {blog.content}
                            </div>
                        ) : (
                            <p className="text-gray-700 leading-relaxed">
                                This is a sample blog post. The full content will be displayed here once added to the database.
                            </p>
                        )}
                    </div>

                        {/* Share section */}
                        <div className="border-t border-gray-200 mt-12 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
                            <div className="flex space-x-4">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                    Share on Twitter
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Share on Facebook
                                </button>
                                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* Back to home */}
                        <div className="mt-12 text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                ← Back to all articles
                            </button>
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto">
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
