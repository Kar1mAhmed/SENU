// API endpoints for individual category operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CategoryDB, dbCategoryToCategory } from '@/lib/db-utils';
import {
    CloudflareEnv,
    APIResponse,
    Category,
    UpdateCategoryRequest
} from '@/lib/types';

export const runtime = 'edge';

// GET /api/categories/[id] - Get category by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('🔍 GET /api/categories/[id] - fetching category:', id);

    try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) {
            const response: APIResponse = {
                success: false,
                error: 'Invalid category ID'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Get Cloudflare bindings from request context
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            console.log('❌ Cloudflare context not available');
            const response: APIResponse = {
                success: false,
                error: 'Database not available in development mode'
            };
            return NextResponse.json(response, { status: 503 });
        }

        const categoryDB = new CategoryDB(env.DB);
        const dbCategory = await categoryDB.getById(categoryId);
        const category = dbCategoryToCategory(dbCategory);

        const response: APIResponse<Category> = {
            success: true,
            data: category
        };

        console.log('✅ Category found:', category.name);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching category:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch category'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('✏️ PUT /api/categories/[id] - updating category:', id);

    try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) {
            const response: APIResponse = {
                success: false,
                error: 'Invalid category ID'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Get Cloudflare bindings from request context
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            console.log('❌ Cloudflare context not available');
            const response: APIResponse = {
                success: false,
                error: 'Database not available in development mode'
            };
            return NextResponse.json(response, { status: 503 });
        }

        // Parse request body
        const body: Omit<UpdateCategoryRequest, 'id'> = await request.json();
        console.log('📦 Update data received for category:', categoryId);

        // Validate at least one field is provided
        if (!body.name && body.displayOrder === undefined) {
            const response: APIResponse = {
                success: false,
                error: 'At least one field (name or displayOrder) is required'
            };
            return NextResponse.json(response, { status: 400 });
        }

        const categoryDB = new CategoryDB(env.DB);

        // Update category
        const updateData: Partial<{ name: string; displayOrder: number }> = {};
        if (body.name) updateData.name = body.name.trim();
        if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;

        const dbCategory = await categoryDB.update(categoryId, updateData);
        const category = dbCategoryToCategory(dbCategory);

        const response: APIResponse<Category> = {
            success: true,
            data: category,
            message: 'Category updated successfully'
        };

        console.log('✅ Category updated successfully:', category.name);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error updating category:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update category'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log('🗑️ DELETE /api/categories/[id] - deleting category:', id);

    try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) {
            const response: APIResponse = {
                success: false,
                error: 'Invalid category ID'
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Get Cloudflare bindings from request context
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            console.log('❌ Cloudflare context not available');
            const response: APIResponse = {
                success: false,
                error: 'Database not available in development mode'
            };
            return NextResponse.json(response, { status: 503 });
        }

        const categoryDB = new CategoryDB(env.DB);

        // Delete category (will throw error if projects are using it)
        await categoryDB.delete(categoryId);

        const response: APIResponse = {
            success: true,
            message: 'Category deleted successfully'
        };

        console.log('✅ Category deleted successfully');
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error deleting category:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete category'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
