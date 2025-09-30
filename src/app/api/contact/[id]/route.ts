// API endpoints for individual contact message operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import {
    CloudflareEnv,
    APIResponse,
    ContactMessage,
    DBContactMessage
} from '@/lib/types';

export const runtime = 'edge';

console.log('📬 Contact [id] API loaded - ready to manage individual messages!');

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

// GET /api/contact/[id] - Get single contact message
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('📋 GET /api/contact/[id] - fetching message:', id);

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

        const stmt = env.DB.prepare('SELECT * FROM contact_messages WHERE id = ?').bind(id);
        const dbMessage = await stmt.first<DBContactMessage>();

        if (!dbMessage) {
            const response: APIResponse = {
                success: false,
                error: 'Contact message not found'
            };
            return NextResponse.json(response, { status: 404 });
        }

        const message = dbContactMessageToContactMessage(dbMessage);

        const response: APIResponse<ContactMessage> = {
            success: true,
            data: message
        };

        console.log('✅ Successfully fetched contact message:', id);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching contact message:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch contact message'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// PATCH /api/contact/[id] - Update contact message status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('🔄 PATCH /api/contact/[id] - updating message:', id);

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
        const body = await request.json() as { status: string };
        const { status } = body;

        if (!status) {
            const response: APIResponse = {
                success: false,
                error: 'Status is required'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Validate status
        if (!['new', 'read', 'archived'].includes(status)) {
            const response: APIResponse = {
                success: false,
                error: 'Invalid status value'
            };
            return NextResponse.json(response, { status: 400 });
        }

        console.log('📝 Updating message status to:', status);

        // Update the message
        const updateStmt = env.DB.prepare(`
            UPDATE contact_messages 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).bind(status, id);

        await updateStmt.run();

        // Fetch the updated message
        const fetchStmt = env.DB.prepare('SELECT * FROM contact_messages WHERE id = ?').bind(id);
        const dbMessage = await fetchStmt.first<DBContactMessage>();

        if (!dbMessage) {
            const response: APIResponse = {
                success: false,
                error: 'Contact message not found after update'
            };
            return NextResponse.json(response, { status: 404 });
        }

        const message = dbContactMessageToContactMessage(dbMessage);

        const response: APIResponse<ContactMessage> = {
            success: true,
            data: message,
            message: 'Contact message updated successfully'
        };

        console.log('✅ Contact message updated successfully:', id);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error updating contact message:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update contact message'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// DELETE /api/contact/[id] - Delete contact message
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('🗑️ DELETE /api/contact/[id] - deleting message:', id);

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

        // Delete the message
        const stmt = env.DB.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id);
        await stmt.run();

        const response: APIResponse = {
            success: true,
            message: 'Contact message deleted successfully'
        };

        console.log('✅ Contact message deleted successfully:', id);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error deleting contact message:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete contact message'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
