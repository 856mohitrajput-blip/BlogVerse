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

// Function to convert plain text to HTML with proper formatting
function formatBlogContent(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    // Split content into paragraphs (double newlines)
    let paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    let html = '';
    let inList = false;
    let introParagraphs = 0;
    
    // Count intro paragraphs (first 1-2 non-heading paragraphs)
    for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
        const para = paragraphs[i].trim();
        const isHeading = detectHeading(para);
        if (!isHeading && para.length > 100) {
            introParagraphs++;
        } else {
            break;
        }
    }
    
    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i].trim();
        
        // Check if it's a heading
        const isHeading = detectHeading(para);
        
        // Check if it's a list item
        const isListItem = /^[•\-\*]\s/.test(para) || /^\d+\.\s/.test(para);
        
        if (isHeading) {
            // Close any open list
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            
            // Determine heading level
            // Main sections (after intro) are H2
            // Subsections are H3
            let headingLevel = 'h2';
            if (i <= introParagraphs) {
                // First heading after intro is H2
                headingLevel = 'h2';
            } else {
                // Check if it's a shorter subsection
                if (para.length < 50 && !para.includes(':')) {
                    headingLevel = 'h3';
                } else {
                    headingLevel = 'h2';
                }
            }
            
            const headingText = para.replace(/:/g, '').trim();
            html += `<${headingLevel}>${escapeHtml(headingText)}</${headingLevel}>`;
        } else if (isListItem) {
            // Start list if not already in one
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            
            // Remove list marker and format
            const listText = para.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '').trim();
            html += `<li>${formatInlineText(listText)}</li>`;
        } else {
            // Close any open list
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            
            // Regular paragraph with inline formatting
            const formattedPara = formatInlineText(para);
            html += `<p>${formattedPara}</p>`;
        }
    }
    
    // Close any remaining open list
    if (inList) {
        html += '</ul>';
    }
    
    return html;
}

// Helper function to detect if a paragraph is a heading
function detectHeading(para) {
    // Heading characteristics:
    // 1. Ends with colon (common pattern)
    // 2. Short (less than 100 chars) and doesn't end with period/question/exclamation
    // 3. All caps and short
    // 4. Title case, short, and looks like a section header
    
    if (para.endsWith(':')) {
        return true;
    }
    
    if (para.length < 100) {
        // If it's all caps and short, likely a heading
        if (para === para.toUpperCase() && para.length < 80) {
            return true;
        }
        
        // If it doesn't end with sentence punctuation and is short
        if (!para.match(/[.!?]$/) && para.length < 80) {
            // Check if it looks like title case (capital first letter, some capitals in middle)
            const words = para.split(' ');
            if (words.length > 1 && words.length < 8) {
                const firstWordCapitalized = words[0] && words[0][0] === words[0][0].toUpperCase();
                if (firstWordCapitalized) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Function to format inline text (bold important terms, italic for emphasis)
function formatInlineText(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);
    
    // Bold common important terms
    const importantTerms = [
        /Bitcoin/gi,
        /Ethereum/gi,
        /DeFi/gi,
        /AI|Artificial Intelligence/gi,
        /blockchain/gi,
        /cryptocurrency/gi,
        /NFTs/gi,
        /401\(k\)/gi,
        /IRA/gi,
        /ETF/gi,
        /cloud computing/gi,
        /Kubernetes/gi,
        /serverless/gi,
        /emergency fund/gi,
        /credit score/gi,
        /compound interest/gi,
        /diversification/gi,
    ];
    
    importantTerms.forEach(term => {
        formatted = formatted.replace(term, (match) => {
            return `<strong>${match}</strong>`;
        });
    });
    
    // Italic for emphasis phrases (quotes, special terms)
    const emphasisPhrases = [
        /'[^']+'/g,  // Single quotes
        /"[^"]+"/g,  // Double quotes
    ];
    
    emphasisPhrases.forEach(pattern => {
        formatted = formatted.replace(pattern, (match) => {
            return `<em>${match}</em>`;
        });
    });
    
    return formatted;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

async function formatAllBlogs() {
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
        const blogsCollection = db.collection('blogs');

        // Fetch all blogs
        console.log('🔄 Fetching all blogs...');
        const blogs = await blogsCollection.find({}).toArray();
        console.log(`✅ Found ${blogs.length} blogs`);

        let updatedCount = 0;
        
        for (const blog of blogs) {
            // Skip if content is already HTML (contains HTML tags)
            if (blog.content && /<[a-z][\s\S]*>/i.test(blog.content)) {
                console.log(`⏭️  Skipping "${blog.title}" - already formatted as HTML`);
                continue;
            }

            // Format the content
            const formattedContent = formatBlogContent(blog.content);
            
            // Update the blog
            await blogsCollection.updateOne(
                { _id: blog._id },
                { 
                    $set: { 
                        content: formattedContent,
                        updatedAt: new Date()
                    } 
                }
            );
            
            console.log(`✅ Updated: "${blog.title}"`);
            updatedCount++;
        }

        console.log(`\n✨ Successfully formatted ${updatedCount} blog(s)!`);
        console.log(`📊 Total blogs processed: ${blogs.length}`);
    } catch (error) {
        console.error('❌ Error formatting blogs:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔒 MongoDB connection closed');
    }
}

// Run the formatting function
formatAllBlogs();
