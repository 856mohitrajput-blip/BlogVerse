"use client"

import React, { use, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const BrandingLandingPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch blogs from API
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/get-blogs');
                const data = await response.json();
                if (data.success) {
                    setBlogs(data.blogs);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Image 
                                src="/logo.jpg" 
                                alt="LinkShorti Logo" 
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg shadow object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                                    LinkShorti
                                </h1>
                                <p className="text-xs text-gray-500">URL Shortener & Link Management</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-6">
                            <Link href="/admin/add-blog" className="text-gray-600 hover:text-indigo-600 transition">Add Blog</Link>
                            <a href="#blogs" className="text-gray-600 hover:text-indigo-600 transition">Blog</a>
                            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">About</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Shorten Your Links &
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 pb-2">
                            Start Earning Money Today
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Transform every link you share into a revenue opportunity. LinkShorti helps you create short, trackable URLs and earn money from every click. Whether you&apos;re a content creator, marketer, or social media influencer, monetize your audience effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            Start Earning Now - It&apos;s Free
                        </button>
                        <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-all duration-300">
                            See How It Works
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                        Why Choose LinkShorti?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h4>
                            <p className="text-gray-600">
                                Create shortened links instantly with our optimized infrastructure and global CDN.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h4>
                            <p className="text-gray-600">
                                Track clicks, locations, devices, and more with detailed real-time analytics.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💰</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Monetization</h4>
                            <p className="text-gray-600">
                                Earn revenue from your links with our integrated advertising platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blogs" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                        Latest from Our Blog
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading articles...</p>
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogs.map((blog, index) => (
                                <a 
                                    key={index} 
                                    href={`/blog-post/${blog._id}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block"
                                >
                                    <Image
                                        src={blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop'}
                                        alt={blog.title}
                                        width={400}
                                        height={250}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <span className="text-xs font-semibold text-indigo-600 uppercase">{blog.category}</span>
                                        <h4 className="text-lg font-bold text-gray-900 mt-2 mb-3">
                                            {blog.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{blog.readTime || '5 min read'}</span>
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No blogs available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
                        Trusted by Thousands
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-2">50M+</div>
                            <p className="text-gray-600">Links Shortened</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">99.9%</div>
                            <p className="text-gray-600">Uptime Guarantee</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl sm:text-5xl font-bold text-cyan-600 mb-2">10M+</div>
                            <p className="text-gray-600">Monthly Clicks</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
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
};

const InvalidURLPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6">
        <div className="max-w-xl w-full p-10 bg-white rounded-3xl shadow-2xl text-center border-t-4 border-yellow-500">
            <div className="text-6xl mb-4 text-yellow-500">🚫</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Invalid URL Format
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                The link structure provided does not match our expected format. Please ensure you are using a single path segment.
            </p>
            <p className="mt-6 text-sm text-gray-500">
                Example: linkshort.com/<span className="font-bold">mylinkid</span>
            </p>
        </div>
    </div>
);

const getPathDetails = (params) => {
    const shortURL = params.shortURL;
    const isRoot = !shortURL || shortURL.length === 0;
    const pathSegment = isRoot ? null : shortURL[0];
    const isInvalidMultiSegment = !isRoot && shortURL.length > 1;

    return { pathSegment, isRoot, isInvalidMultiSegment };
}

export default function App({ params }) {
    const resolvedParams = use(params);
    const { pathSegment, isRoot, isInvalidMultiSegment } = getPathDetails(resolvedParams);

    if (isInvalidMultiSegment) {
        return <InvalidURLPage />;
    }

    if (isRoot) {
        return <BrandingLandingPage />;
    }

    if (pathSegment) {
        redirect(`/verify/${pathSegment}`);
    }

    return <BrandingLandingPage />;
}
