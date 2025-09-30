// API endpoints for contact messages CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import {
    CloudflareEnv,
    APIResponse,
    PaginatedResponse,
    ContactMessage,
    DBContactMessage,
    ContactMessageStatus,
    CreateContactMessageRequest
} from '@/lib/types';

export const runtime = 'edge';

console.log('📬 Contact API loaded - ready to handle messages like a digital mailroom!');

// Helper function to convert DB contact message to frontend format
function dbContactMessageToContactMessage(dbMessage: DBContactMessage): ContactMessage {
    return {
        id: dbMessage.id,
        name: dbMessage.name,
        contactMethod: dbMessage.contact_method,
        countryCode: dbMessage.country_code,
        phoneNumber: dbMessage.phone_number,
        email: dbMessage.email,
        message: dbMessage.message,
        status: dbMessage.status,
        createdAt: new Date(dbMessage.created_at),
        updatedAt: new Date(dbMessage.updated_at)
    };
}

// GET /api/contact - Get all contact messages with optional filtering
export async function GET(request: NextRequest) {
    console.log('📋 GET /api/contact - fetching contact messages');

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as ContactMessageStatus | null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        console.log('🔍 Query params:', { status, page, limit, offset });

        // Get Cloudflare bindings from request context with fallback
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            // Fallback for development - return empty data
            console.log('⚠️ Cloudflare context not available, returning empty data for development');
            const response: PaginatedResponse<ContactMessage> = {
                success: true,
                data: {
                    items: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0
                }
            };
            return NextResponse.json(response);
        }

        // Build query
        let query = 'SELECT * FROM contact_messages';
        const params: string[] = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit.toString(), offset.toString());

        console.log('🔍 Executing query:', query.substring(0, 100) + '...');

        const stmt = env.DB.prepare(query).bind(...params);
        const result = await stmt.all<DBContactMessage>();

        // Get total count
        let countQuery = 'SELECT COUNT(*) as count FROM contact_messages';
        if (status) {
            countQuery += ' WHERE status = ?';
        }
        const countStmt = status 
            ? env.DB.prepare(countQuery).bind(status)
            : env.DB.prepare(countQuery);
        const countResult = await countStmt.first<{ count: number }>();
        const total = countResult?.count || 0;

        // Convert to frontend format
        const messages: ContactMessage[] = (result.results || []).map(dbContactMessageToContactMessage);

        const response: PaginatedResponse<ContactMessage> = {
            success: true,
            data: {
                items: messages,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

        console.log(`✅ Successfully fetched ${messages.length} contact messages (page ${page}/${Math.ceil(total / limit)})`);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching contact messages:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch contact messages'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// POST /api/contact - Create new contact message
export async function POST(request: NextRequest) {
    console.log('📤 POST /api/contact - creating new contact message');

    try {
        // Get Cloudflare bindings from request context
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            console.log('⚠️ Cloudflare context not available in development');
            const response: APIResponse = {
                success: false,
                error: 'Database not available in development mode'
            };
            return NextResponse.json(response, { status: 503 });
        }

        // Parse request body
        const body = await request.json() as CreateContactMessageRequest;
        const { name, contactMethod, countryCode, phoneNumber, email, message } = body;

        console.log('📝 Creating contact message for:', name, 'via', contactMethod);

        // Validate required fields
        if (!name || !contactMethod) {
            const response: APIResponse = {
                success: false,
                error: 'Name and contact method are required'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Validate contact method specific fields
        if (contactMethod === 'email' && !email) {
            const response: APIResponse = {
                success: false,
                error: 'Email is required for email contact method'
            };
            return NextResponse.json(response, { status: 400 });
        }

        if ((contactMethod === 'phone' || contactMethod === 'whatsapp') && !phoneNumber) {
            const response: APIResponse = {
                success: false,
                error: 'Phone number is required for phone/whatsapp contact method'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Generate unique ID
        const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Insert into database
        const stmt = env.DB.prepare(`
            INSERT INTO contact_messages (
                id, name, contact_method, country_code, phone_number, email, message, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
        `).bind(
            id,
            name,
            contactMethod,
            countryCode || null,
            phoneNumber || null,
            email || null,
            message || null
        );

        await stmt.run();

        // Fetch the created message
        const createdStmt = env.DB.prepare('SELECT * FROM contact_messages WHERE id = ?').bind(id);
        const createdMessage = await createdStmt.first<DBContactMessage>();

        if (!createdMessage) {
            throw new Error('Failed to fetch created message');
        }

        const contactMessage = dbContactMessageToContactMessage(createdMessage);

        const response: APIResponse<ContactMessage> = {
            success: true,
            data: contactMessage,
            message: 'Contact message created successfully'
        };

        console.log('✅ Contact message created successfully with ID:', id);
        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating contact message:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create contact message'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
