import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET all comments (both approved and pending) for admin management
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Fetch all comments, sorted by creation date (newest first)
        const comments = await db.collection('comments')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Fetch all blogs to get blog titles
        const blogs = await db.collection('blogs')
            .find({})
            .toArray();

        // Create a map of blogId to blog title
        const blogMap = {};
        blogs.forEach(blog => {
            blogMap[blog._id.toString()] = {
                title: blog.title,
                _id: blog._id.toString()
            };
        });

        // Group comments by blogId
        const commentsByBlog = {};
        comments.forEach(comment => {
            const blogId = comment.blogId;
            if (!commentsByBlog[blogId]) {
                commentsByBlog[blogId] = {
                    blogId: blogId,
                    blogTitle: blogMap[blogId]?.title || 'Unknown Blog',
                    comments: []
                };
            }
            commentsByBlog[blogId].comments.push(comment);
        });

        // Convert to array and sort by blog title
        const groupedComments = Object.values(commentsByBlog).sort((a, b) => 
            a.blogTitle.localeCompare(b.blogTitle)
        );

        return NextResponse.json({
            success: true,
            comments: comments,
            groupedComments: groupedComments
        });
    } catch (error) {
        console.error('Error fetching all comments:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch comments'
        }, { status: 500 });
    }
}

