import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Approve a comment
export async function PUT(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();
        const { action } = body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid comment ID'
            }, { status: 400 });
        }

        if (action !== 'approve') {
            return NextResponse.json({
                success: false,
                error: 'Invalid action. Use "approve"'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');

        // Update comment to approved
        const result = await db.collection('comments').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    approved: true,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Comment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Comment approved successfully'
        });
    } catch (error) {
        console.error('Error approving comment:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to approve comment'
        }, { status: 500 });
    }
}

// DELETE - Delete a comment
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid comment ID'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('BlogVerse');

        // Delete comment
        const result = await db.collection('comments').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Comment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete comment'
        }, { status: 500 });
    }
}

