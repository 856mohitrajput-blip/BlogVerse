import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('LinkShorti');
        
        // Fetch blogs from database, sorted by creation date
        const blogs = await db.collection('blogs')
            .find({})
            .sort({ createdAt: -1 })
            .limit(6)
            .toArray();

        return NextResponse.json({
            success: true,
            blogs: blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch blogs'
        }, { status: 500 });
    }
}
