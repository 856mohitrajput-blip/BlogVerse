"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function BlogPostPage({ params }) {
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blogId, setBlogId] = useState('');
    const [comments, setComments] = useState([]);
    const [commentForm, setCommentForm] = useState({
        name: '',
        email: '',
        website: '',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

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

    useEffect(() => {
        if (!blogId) return;

        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments?blogId=${blogId}`);
                const data = await response.json();
                if (data.success) {
                    setComments(data.comments);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [blogId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blogId: blogId,
                    ...commentForm
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitMessage('Your comment has been submitted and is awaiting approval.');
                setCommentForm({
                    name: '',
                    email: '',
                    website: '',
                    comment: ''
                });
                // Optionally refresh comments after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setSubmitMessage(data.error || 'Failed to submit comment. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            setSubmitMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCommentForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                        className="text-blue-600 hover:text-blue-700 underline"
                    >
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Blog Content */}
            <main className="py-8 sm:py-12">
                <article className="w-full max-w-4xl mx-auto">
                    <div className="px-4">
                        {/* Previous button */}
                        <button
                            onClick={() => router.push('/')}
                            className="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>PREVIOUS</span>
                        </button>

                        {/* Category badge */}
                        <span className="inline-block text-xs font-semibold text-blue-600 uppercase mb-4">
                            {blog.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center space-x-4 text-sm text-blue-600 mb-8">
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                    </div>

                    <div className="px-4">
                        {/* Excerpt */}
                        <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                            {blog.excerpt}
                        </p>

                        {/* Content */}
                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                        {blog.content ? (
                            <div 
                                className="text-gray-700 leading-relaxed blog-content"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed">
                                This is a sample blog post. The full content will be displayed here once added to the database.
                            </p>
                        )}
                    </div>
                    
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

                        {/* Share section */}
                        <div className="border-t border-gray-200 mt-12 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
                            <div className="flex space-x-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                                    Share on Twitter
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                                    Share on Facebook
                                </button>
                                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition cursor-pointer">
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* Previous button */}
                        <div className="mt-12 mb-8">
                            <button
                                onClick={() => router.push('/')}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                            >
                                <span>←</span>
                                <span>PREVIOUS</span>
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="px-3 sm:px-4 mt-8 sm:mt-12">
                        {/* Display Comments First */}
                        {comments.length > 0 && (
                            <div className="mb-8 sm:mb-12">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        💬 Comments
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {comments.length}
                                    </span>
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    {comments.map((comment) => (
                                        <div 
                                            key={comment._id} 
                                            className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition"
                                        >
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                                                    {comment.name.charAt(0).toUpperCase()}
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                                            {comment.name}
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    {comment.website && (
                                                        <a 
                                                            href={comment.website} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-xs sm:text-sm text-blue-600 hover:underline mb-2 block truncate"
                                                        >
                                                            🌐 {comment.website}
                                                        </a>
                                                    )}
                                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words mt-2">
                                                        {comment.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comment Form */}
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                ✍️ Leave a Comment
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                                Your email address will not be published. Required fields are marked *
                            </p>

                            <form onSubmit={handleCommentSubmit} className="space-y-3 sm:space-y-4">
                                {/* Comment Text */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                        Your Comment *
                                    </label>
                                    <textarea
                                        name="comment"
                                        value={commentForm.comment}
                                        onChange={handleInputChange}
                                        placeholder="Share your thoughts..."
                                        required
                                        rows={5}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition bg-white"
                                    />
                                </div>

                                {/* Name, Email, Website Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={commentForm.name}
                                            onChange={handleInputChange}
                                            placeholder="Your name"
                                            required
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={commentForm.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            required
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                        Website (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={commentForm.website}
                                        onChange={handleInputChange}
                                        placeholder="https://yourwebsite.com"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                    />
                                </div>

                                {/* Submit Message */}
                                {submitMessage && (
                                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                                        submitMessage.includes('submitted') 
                                            ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                                            : 'bg-red-50 text-red-700 border-2 border-red-200'
                                    }`}>
                                        {submitMessage.includes('submitted') ? '✅ ' : '❌ '}
                                        {submitMessage}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>📤</span>
                                            <span>Post Comment</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </article>
            </main>

            <ScrollToTop />
            <Footer />
        </div>
    );
}
