"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function HandleCommentsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [comments, setComments] = useState([]);
    const [groupedComments, setGroupedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBlog, setSelectedBlog] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved
    const [actionLoading, setActionLoading] = useState(null);

    // Password authentication
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');
        
        if (password === 'Mohit@Rajput') {
            setIsAuthenticated(true);
            setPassword('');
        } else {
            setPasswordError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchComments();
        }
    }, [isAuthenticated]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/comments/all');
            const data = await response.json();
            
            if (data.success) {
                setComments(data.comments);
                setGroupedComments(data.groupedComments);
            } else {
                setError(data.error || 'Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (commentId) => {
        setActionLoading(commentId);
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'approve' })
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh comments
                await fetchComments();
            } else {
                alert(data.error || 'Failed to approve comment');
            }
        } catch (error) {
            console.error('Error approving comment:', error);
            alert('Failed to approve comment');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        setActionLoading(commentId);
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh comments
                await fetchComments();
            } else {
                alert(data.error || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter comments based on selected blog and status
    const getFilteredComments = () => {
        let filtered = comments;

        // Filter by blog
        if (selectedBlog !== 'all') {
            filtered = filtered.filter(comment => comment.blogId === selectedBlog);
        }

        // Filter by status
        if (filterStatus === 'pending') {
            filtered = filtered.filter(comment => !comment.approved);
        } else if (filterStatus === 'approved') {
            filtered = filtered.filter(comment => comment.approved);
        }

        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const filteredComments = getFilteredComments();

    // Show password form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white">
                <Header />

                <main className="max-w-md mx-auto px-4 py-8 sm:py-12">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Access Required
                        </h1>
                        <p className="text-gray-600">Please enter the password to continue</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError('');
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter password..."
                                required
                                autoFocus
                            />
                            {passwordError && (
                                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Access Comments Management
                        </button>
                    </form>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Header />
            
            <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        💬 Comment Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Approve or delete comments for your blog posts</p>
                </div>

                {/* Stats Cards - Mobile First */}
                {!loading && comments.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-lg">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{comments.length}</p>
                            <p className="text-xs sm:text-sm mt-1 opacity-90">Total</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-lg">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                                {comments.filter(c => !c.approved).length}
                            </p>
                            <p className="text-xs sm:text-sm mt-1 opacity-90">Pending</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-lg">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                                {comments.filter(c => c.approved).length}
                            </p>
                            <p className="text-xs sm:text-sm mt-1 opacity-90">Approved</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Blog Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                📝 Filter by Blog
                            </label>
                            <select
                                value={selectedBlog}
                                onChange={(e) => setSelectedBlog(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                            >
                                <option value="all">All Blogs</option>
                                {groupedComments.map((group) => (
                                    <option key={group.blogId} value={group.blogId}>
                                        {group.blogTitle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                🔍 Filter by Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                            >
                                <option value="all">All Comments</option>
                                <option value="pending">Pending Approval</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                {loading ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">Loading comments...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-red-200 p-6 sm:p-8 text-center">
                        <p className="text-sm sm:text-base text-red-600">{error}</p>
                    </div>
                ) : filteredComments.length === 0 ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-sm sm:text-base text-gray-600">No comments found</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredComments.map((comment) => {
                            const blogGroup = groupedComments.find(g => g.blogId === comment.blogId);
                            const blogTitle = blogGroup?.blogTitle || 'Unknown Blog';
                            const isActionLoading = actionLoading === comment._id;
                            
                            return (
                                <div
                                    key={comment._id}
                                    className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border-l-4 ${
                                        comment.approved 
                                            ? 'border-green-500' 
                                            : 'border-yellow-500'
                                    } p-4 sm:p-6 transition hover:shadow-xl`}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {/* Avatar */}
                                                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${
                                                    comment.approved ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}>
                                                    {comment.name.charAt(0).toUpperCase()}
                                                </div>
                                                
                                                {/* Name and Email */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                                                        {comment.name}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                        {comment.email}
                                                    </p>
                                                    {comment.website && (
                                                        <a 
                                                            href={comment.website} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-xs sm:text-sm text-blue-600 hover:underline truncate block mt-1"
                                                        >
                                                            🌐 {comment.website}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            <span className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                                comment.approved
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {comment.approved ? '✓ Approved' : '⏳ Pending'}
                                            </span>
                                        </div>

                                        {/* Blog Title */}
                                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                                                📝 Blog: <span className="text-blue-600 font-semibold">{blogTitle}</span>
                                            </p>
                                        </div>

                                        {/* Comment Text */}
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                                {comment.comment}
                                            </p>
                                        </div>

                                        {/* Footer with Date and Actions */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                🕒 {formatDate(comment.createdAt)}
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                {!comment.approved && (
                                                    <button
                                                        onClick={() => handleApprove(comment._id)}
                                                        disabled={isActionLoading}
                                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                                                    >
                                                        {isActionLoading ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                <span>Processing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span>Approve</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    disabled={isActionLoading}
                                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                                                >
                                                    {isActionLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>Delete</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

