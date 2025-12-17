import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Build query
        const query = category ? { category } : {};
        
        // Get random blog using aggregation
        const blogs = await db.collection('blogs')
            .aggregate([
                { $match: query },
                { $sample: { size: 1 } }
            ])
            .toArray();

        if (blogs.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No blogs found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            blog: blogs[0]
        });
    } catch (error) {
        console.error('Error fetching random blog:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch blog'
        }, { status: 500 });
    }
}
