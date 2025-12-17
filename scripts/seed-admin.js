const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

// Admin credentials
const admin = {
    phone: '8059238403',  // Change this to your phone number
    password: 'admin123',  // Change this to your password
    name: 'Admin',
    createdAt: new Date()
};

async function seedAdmin() {
    const uri = envVars.MONGODB_URI;
    
    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env file');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        console.log('🔄 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('BlogVerse');
        const adminsCollection = db.collection('admins');

        // Clear existing admins (optional)
        console.log('🔄 Clearing existing admins...');
        await adminsCollection.deleteMany({});
        console.log('✅ Existing admins cleared');

        // Insert new admin
        console.log('🔄 Inserting admin...');
        const result = await adminsCollection.insertOne(admin);
        console.log(`✅ Admin added successfully`);

        console.log('\n📝 Admin Credentials:');
        console.log(`Phone: ${admin.phone}`);
        console.log(`Password: ${admin.password}`);
        console.log('\n⚠️  IMPORTANT: Change these credentials in production!');
        console.log('\n✨ Admin seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔒 MongoDB connection closed');
    }
}

// Run the seed function
seedAdmin();
