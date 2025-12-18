import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        let blog = null;
        
        // First, try to find by slug
        blog = await db.collection('blogs').findOne({ slug: id });
        
        // If not found by slug and it's a valid ObjectId, try by ID (for backward compatibility)
        if (!blog && ObjectId.isValid(id)) {
            blog = await db.collection('blogs').findOne({
                _id: new ObjectId(id)
            });
        }

        if (!blog) {
            return NextResponse.json({
                success: false,
                error: 'Blog not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            blog: blog
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch blog'
        }, { status: 500 });
    }
}
