import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, excerpt, content, category, image, readTime } = body;

        // Validate required fields
        if (!title || !excerpt || !category || !content) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: title, excerpt, category, and content are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Create blog document
        const blog = {
            title,
            excerpt,
            content: content || '',
            category,
            image: image || null,
            readTime: readTime || '5 min read',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert blog into database
        const result = await db.collection('blogs').insertOne(blog);

        return NextResponse.json({
            success: true,
            blogId: result.insertedId,
            message: 'Blog added successfully'
        });
    } catch (error) {
        console.error('Error adding blog:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to add blog'
        }, { status: 500 });
    }
}
