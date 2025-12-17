import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();
        const { content } = body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid blog ID'
            }, { status: 400 });
        }

        // Validate content
        if (!content) {
            return NextResponse.json({
                success: false,
                error: 'Content is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');

        // Update blog content
        const result = await db.collection('blogs').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    content: content,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Blog not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Blog updated successfully'
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update blog'
        }, { status: 500 });
    }
}
