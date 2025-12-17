import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// DELETE - Delete a blog
export async function DELETE(request, { params }) {
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
        const db = client.db('BlogVerse');

        // Delete blog
        const result = await db.collection('blogs').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Blog not found'
            }, { status: 404 });
        }

        // Also delete all comments associated with this blog
        await db.collection('comments').deleteMany({
            blogId: id
        });

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete blog'
        }, { status: 500 });
    }
}

