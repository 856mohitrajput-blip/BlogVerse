import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        
        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid blog ID'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('LinkShorti');
        
        // Fetch blog by ID
        const blog = await db.collection('blogs').findOne({
            _id: new ObjectId(id)
        });

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
