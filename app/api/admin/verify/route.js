import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json({
                success: false,
                error: 'Phone and password are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('LinkShorti');
        
        // Check if admin exists with matching credentials
        const admin = await db.collection('admins').findOne({
            phone: phone,
            password: password // In production, use hashed passwords
        });

        if (!admin) {
            return NextResponse.json({
                success: false,
                error: 'Invalid phone number or password'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            message: 'Authentication successful'
        });
    } catch (error) {
        console.error('Error verifying admin:', error);
        return NextResponse.json({
            success: false,
            error: 'Authentication failed'
        }, { status: 500 });
    }
}
