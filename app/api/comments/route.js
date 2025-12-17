import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET comments for a blog post
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('blogId');

        if (!blogId) {
            return NextResponse.json({
                success: false,
                error: 'Blog ID is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Fetch approved comments for the blog post, sorted by creation date
        const comments = await db.collection('comments')
            .find({ 
                blogId: blogId,
                approved: true 
            })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            comments: comments
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch comments'
        }, { status: 500 });
    }
}

// POST a new comment
export async function POST(request) {
    try {
        const body = await request.json();
        const { blogId, name, email, website, comment } = body;

        // Validation
        if (!blogId || !name || !email || !comment) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: blogId, name, email, and comment are required'
            }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid email format'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Insert new comment (initially not approved)
        const newComment = {
            blogId,
            name,
            email,
            website: website || '',
            comment,
            approved: false, // Comments need approval
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('comments').insertOne(newComment);

        return NextResponse.json({
            success: true,
            message: 'Comment submitted successfully. It will be visible after approval.',
            comment: {
                _id: result.insertedId,
                ...newComment
            }
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create comment'
        }, { status: 500 });
    }
}

