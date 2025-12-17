"use client"

import React, { use, useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const BrandingLandingPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Blog Listings */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-10">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No blogs available yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-gray-200"
                                onClick={() => router.push(`/blog-post/${blog._id}`)}
                            >
                                {/* Category Badge */}
                                <div className="px-4 pt-4 pb-2">
                                    <span className="inline-block text-xs font-semibold text-blue-600 uppercase">
                                        {blog.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="px-4 pb-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    
                                    <div className="text-sm text-blue-600 mb-3">
                                        {formatDate(blog.createdAt)}
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <ScrollToTop />
            <Footer />
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
                Example: blogverse.com/<span className="font-bold">blogid</span>
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
