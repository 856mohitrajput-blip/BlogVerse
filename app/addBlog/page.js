"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddBlogPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Technology');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showManage, setShowManage] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [deletingBlogId, setDeletingBlogId] = useState(null);
    const editorRef = useRef(null);

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

    // Fetch blogs for management
    const fetchBlogs = async () => {
        try {
            setLoadingBlogs(true);
            const response = await fetch('/api/get-blogs');
            const data = await response.json();
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoadingBlogs(false);
        }
    };

    // Handle manage button click
    const handleManageClick = () => {
        setShowManage(!showManage);
        if (!showManage) {
            fetchBlogs();
        }
    };

    // Delete blog
    const handleDeleteBlog = async (blogId) => {
        if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        setDeletingBlogId(blogId);
        try {
            const response = await fetch(`/api/delete-blog/${blogId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                // Remove blog from list
                setBlogs(prev => prev.filter(blog => blog._id !== blogId));
            } else {
                alert(data.error || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        } finally {
            setDeletingBlogId(null);
        }
    };

    // Rich text editor functions
    const executeCommand = (e, command, value = null) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!editorRef.current) return;
        
        // Ensure editor has focus
        editorRef.current.focus();
        
        // Check if text is selected (for formatting commands that need selection)
        const selection = window.getSelection();
        const hasSelection = selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
        
        // ALL formatting commands require text selection (except insertHorizontalRule which inserts an element)
        const requiresSelection = ['bold', 'italic', 'underline', 'formatBlock', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat'];
        
        if (requiresSelection.includes(command) && !hasSelection) {
            alert('Please select text to apply formatting');
            return;
        }
        
        // For formatBlock (headings and paragraphs), handle manually with toggle
        if (command === 'formatBlock' && value) {
            const tagName = value.replace(/[<>]/g, ''); // Remove < > from <h1> or <p>
            
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                // Find existing block element
                let targetElement = null;
                let node = range.startContainer;
                
                // Find existing block element
                while (node && node !== editorRef.current) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const tag = node.tagName?.toLowerCase();
                        if (tag && ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                            targetElement = node;
                            break;
                        }
                    }
                    node = node.parentNode;
                }
                
                // Check if already in the target format - if so, convert to paragraph (toggle off)
                if (targetElement && targetElement.tagName?.toLowerCase() === tagName.toLowerCase()) {
                    // Already in this format, remove it (convert to paragraph)
                    const paragraph = document.createElement('p');
                    paragraph.innerHTML = targetElement.innerHTML || targetElement.textContent || '';
                    
                    if (targetElement.parentNode) {
                        targetElement.parentNode.replaceChild(paragraph, targetElement);
                    }
                    
                    // Restore selection
                    const newRange = document.createRange();
                    newRange.selectNodeContents(paragraph);
                    if (range.collapsed) {
                        newRange.collapse(false);
                    } else {
                        newRange.setStart(paragraph, 0);
                        newRange.setEnd(paragraph, paragraph.childNodes.length || 1);
                    }
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                } else {
                    // Not in this format, apply it
                    // If no block found, create one
                    if (!targetElement || targetElement === editorRef.current) {
                        targetElement = document.createElement('p');
                        
                        if (range.collapsed) {
                            // Insert paragraph at cursor
                            if (range.startContainer.nodeType === Node.TEXT_NODE) {
                                const textNode = range.startContainer;
                                const parent = textNode.parentNode;
                                const offset = range.startOffset;
                                
                                if (offset === 0) {
                                    parent.insertBefore(targetElement, textNode);
                                } else if (offset === textNode.length) {
                                    parent.insertBefore(targetElement, textNode.nextSibling);
                                } else {
                                    // Split text node
                                    const afterText = textNode.splitText(offset);
                                    parent.insertBefore(targetElement, afterText);
                                }
                            } else {
                                range.insertNode(targetElement);
                            }
                            
                            // Move cursor inside paragraph
                            const newRange = document.createRange();
                            newRange.setStart(targetElement, 0);
                            newRange.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(newRange);
                        } else {
                            // Wrap selection
                            const content = range.extractContents();
                            targetElement.appendChild(content);
                            range.insertNode(targetElement);
                        }
                    }
                    
                    // Create heading and replace target element
                    const heading = document.createElement(tagName);
                    heading.innerHTML = targetElement.innerHTML || targetElement.textContent || '';
                    
                    if (targetElement.parentNode) {
                        targetElement.parentNode.replaceChild(heading, targetElement);
                    }
                    
                    // Set cursor at end
                    const newRange = document.createRange();
                    newRange.selectNodeContents(heading);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        } else if (command.startsWith('justify')) {
            // For alignment commands
            try {
                document.execCommand(command, false, value);
            } catch (err) {
                console.error('Error executing command:', command, err);
            }
        } else if (command === 'insertUnorderedList') {
            // For unordered list
            try {
                document.execCommand(command, false, value);
            } catch (err) {
                console.error('Error executing command:', command, err);
            }
        } else if (command === 'bold' || command === 'italic' || command === 'underline') {
            // For bold, italic, underline - toggle formatting (execCommand toggles by default)
            try {
                document.execCommand(command, false, null);
            } catch (err) {
                console.error('Error executing command:', command, err);
            }
        } else {
            // For other commands
            try {
                document.execCommand(command, false, value);
            } catch (err) {
                console.error('Error executing command:', command, err);
            }
        }
        
        // Keep focus on editor
        editorRef.current.focus();
    };

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || showManage) return;

        // Ensure editor is editable
        editor.contentEditable = 'true';

        const handleInput = () => {
            const html = editor.innerHTML;
            setContent(html);
            const isEmpty = html.trim() === '' || html === '<br>' || html === '<br/>' || html === '<p><br></p>' || html === '<p></p>';
            if (isEmpty) {
                editor.classList.add('editor-empty');
            } else {
                editor.classList.remove('editor-empty');
            }
        };

        editor.addEventListener('input', handleInput);
        editor.addEventListener('blur', handleInput);
        handleInput(); // Initial check

        return () => {
            editor.removeEventListener('input', handleInput);
            editor.removeEventListener('blur', handleInput);
        };
    }, [showManage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Get HTML content from the editor
            const editorContent = editorRef.current ? editorRef.current.innerHTML : '';

            const response = await fetch('/api/add-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content: editorContent,
                    category
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitMessage('Blog added successfully!');
                // Reset form
                setTitle('');
                setExcerpt('');
                setContent('');
                setCategory('Technology');
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                }
                
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setSubmitMessage('Error: ' + data.error);
            }
        } catch (error) {
            setSubmitMessage('Failed to add blog. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </form>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Create New Blog Post
                        </h1>
                        <p className="text-gray-600">Share your insights with the world</p>
                    </div>
                    <button
                        onClick={handleManageClick}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base whitespace-nowrap"
                    >
                        {showManage ? 'Hide Manage' : 'Manage'}
                    </button>
                </div>

                {/* Manage Blogs Section */}
                {showManage && (
                    <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Blogs</h2>
                        
                        {loadingBlogs ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading blogs...</p>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No blogs found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                        {blog.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                disabled={deletingBlogId === blog._id}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                            >
                                                {deletingBlogId === blog._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Deleting...</span>
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
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Add Blog Form - Hidden when manage is shown */}
                {!showManage && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
                    {/* Title & Category Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter blog title..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                required
                            >
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Cryptocurrency">Cryptocurrency</option>
                                <option value="Hosting">Hosting</option>
                                <option value="Wordpress Hosting">Wordpress Hosting</option>
                                <option value="Cloud Hosting">Cloud Hosting</option>
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Excerpt *
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                            placeholder="Write a compelling summary..."
                            rows="3"
                            required
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Content *
                        </label>
                        
                        {/* Toolbar */}
                        <div className="border-2 border-gray-200 rounded-t-xl p-2 bg-gray-50 flex flex-wrap gap-2">
                            {/* Text Formatting */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'bold')}
                                    className="px-3 py-1.5 border border-gray-300 rounded font-bold transition bg-white hover:bg-gray-100"
                                >
                                    B
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Bold
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'italic')}
                                    className="px-3 py-1.5 border border-gray-300 rounded italic transition bg-white hover:bg-gray-100"
                                >
                                    I
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Italic
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'underline')}
                                    className="px-3 py-1.5 border border-gray-300 rounded underline transition bg-white hover:bg-gray-100"
                                >
                                    U
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Underline
                                </span>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            
                            {/* Headings */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'formatBlock', '<h1>')}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm transition bg-white hover:bg-gray-100"
                                >
                                    H1
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Heading 1
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'formatBlock', '<h2>')}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm transition bg-white hover:bg-gray-100"
                                >
                                    H2
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Heading 2
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'formatBlock', '<h3>')}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm transition bg-white hover:bg-gray-100"
                                >
                                    H3
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Heading 3
                                </span>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            
                            {/* Alignment */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'justifyLeft')}
                                    className="px-3 py-1.5 border border-gray-300 rounded transition bg-white hover:bg-gray-100"
                                >
                                    ⬅
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Align Left
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'justifyCenter')}
                                    className="px-3 py-1.5 border border-gray-300 rounded transition bg-white hover:bg-gray-100"
                                >
                                    ⬌
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Align Center
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'justifyRight')}
                                    className="px-3 py-1.5 border border-gray-300 rounded transition bg-white hover:bg-gray-100"
                                >
                                    ➡
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Align Right
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'justifyFull')}
                                    className="px-3 py-1.5 border border-gray-300 rounded transition bg-white hover:bg-gray-100"
                                >
                                    ⬌⬌
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Justify Both Sides
                                </span>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            
                            {/* Other */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'insertHorizontalRule')}
                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    ─
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Horizontal Rule
                                </span>
                            </div>
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={(e) => executeCommand(e, 'removeFormat')}
                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Remove Formatting
                                </span>
                            </div>
                        </div>
                        
                        {/* Editor */}
                        <div
                            ref={editorRef}
                            id="content-editor"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                            onInput={(e) => {
                                const html = e.currentTarget.innerHTML;
                                setContent(html);
                                // Update empty state class
                                if (editorRef.current) {
                                    if (html.trim() === '' || html === '<br>' || html === '<br/>' || html === '<p><br></p>' || html === '<p></p>') {
                                        editorRef.current.classList.add('editor-empty');
                                    } else {
                                        editorRef.current.classList.remove('editor-empty');
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const html = e.currentTarget.innerHTML;
                                setContent(html);
                            }}
                            onPaste={(e) => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text/plain');
                                const selection = window.getSelection();
                                if (selection.rangeCount > 0) {
                                    const range = selection.getRangeAt(0);
                                    range.deleteContents();
                                    const textNode = document.createTextNode(text);
                                    range.insertNode(textNode);
                                    range.setStartAfter(textNode);
                                    range.collapse(true);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                } else {
                                    document.execCommand('insertText', false, text);
                                }
                            }}
                            onKeyDown={(e) => {
                                // Allow all keys to work normally
                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    document.execCommand('insertText', false, '    ');
                                }
                            }}
                            className="w-full min-h-[400px] px-4 py-3 border-2 border-t-0 border-gray-200 rounded-b-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none editor-empty"
                            style={{ 
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                WebkitUserSelect: 'text',
                                userSelect: 'text',
                                cursor: 'text'
                            }}
                            data-placeholder="Start writing your blog content here... Use the toolbar above to format your text."
                        ></div>
                        
                        <style dangerouslySetInnerHTML={{__html: `
                            #content-editor.editor-empty:before {
                                content: attr(data-placeholder);
                                color: #9ca3af;
                                pointer-events: none;
                            }
                            #content-editor:focus {
                                outline: none;
                            }
                            #content-editor h1 {
                                font-size: 2.25rem;
                                font-weight: 700;
                                line-height: 1.2;
                                margin-top: 1.5rem;
                                margin-bottom: 1rem;
                                color: #111827;
                            }
                            #content-editor h2 {
                                font-size: 1.875rem;
                                font-weight: 700;
                                line-height: 1.3;
                                margin-top: 1.25rem;
                                margin-bottom: 0.75rem;
                                color: #111827;
                            }
                            #content-editor h3 {
                                font-size: 1.5rem;
                                font-weight: 600;
                                line-height: 1.4;
                                margin-top: 1rem;
                                margin-bottom: 0.5rem;
                                color: #111827;
                            }
                            #content-editor p {
                                margin-bottom: 0.75rem;
                                line-height: 1.75;
                            }
                            #content-editor ul {
                                margin: 1rem 0;
                                padding-left: 2rem;
                                list-style-type: disc;
                            }
                            #content-editor li {
                                margin-bottom: 0.5rem;
                                line-height: 1.75;
                            }
                        `}} />
                    </div>

                    {/* Submit Message */}
                    {submitMessage && (
                        <div className={`${submitMessage.includes('Error') ? 'bg-red-50 border-red-300 text-red-700' : 'bg-green-50 border-green-300 text-green-700'} border-2 rounded-xl p-4`}>
                            <p className="font-medium">{submitMessage}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                )}
            </main>

            <Footer />
        </div>
    );
}

