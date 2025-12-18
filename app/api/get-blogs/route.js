import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('BlogVerse');
        
        // Fetch blogs from database, sorted by creation date
        const blogs = await db.collection('blogs')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Auto-generate slugs for blogs that don't have one
        const blogsWithSlugs = await Promise.all(blogs.map(async (blog) => {
            if (!blog.slug) {
                const slug = generateSlug(blog.title);
                // Update the blog in database with the generated slug
                await db.collection('blogs').updateOne(
                    { _id: blog._id },
                    { $set: { slug: slug } }
                );
                return { ...blog, slug };
            }
            return blog;
        }));

        return NextResponse.json({
            success: true,
            blogs: blogsWithSlugs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch blogs'
        }, { status: 500 });
    }
}
