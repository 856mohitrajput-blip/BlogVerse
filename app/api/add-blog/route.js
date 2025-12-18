import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

// Generate unique slug
async function generateUniqueSlug(db, baseSlug) {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
        const existing = await db.collection('blogs').findOne({ slug });
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}

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
        
        // Generate unique slug from title
        const baseSlug = generateSlug(title);
        const slug = await generateUniqueSlug(db, baseSlug);
        
        // Create blog document
        const blog = {
            title,
            slug,
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
            slug: slug,
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
