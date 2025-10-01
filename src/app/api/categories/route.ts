// API endpoints for categories CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CategoryDB, dbCategoryToCategory } from '@/lib/db-utils';
import {
    CloudflareEnv,
    APIResponse,
    Category,
    CreateCategoryRequest
} from '@/lib/types';

export const runtime = 'edge';

console.log('🏷️ Categories API loaded - ready to manage categories dynamically!');

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
    console.log('📋 GET /api/categories - fetching all categories');

    try {
        // Get Cloudflare bindings from request context with fallback
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            // Fallback for development - return default categories
            console.log('⚠️ Cloudflare context not available, returning default categories for development');
            const defaultCategories: Category[] = [
                { id: 1, name: 'Branding', displayOrder: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Logo design', displayOrder: 2, createdAt: new Date(), updatedAt: new Date() },
                { id: 3, name: 'UI/UX', displayOrder: 3, createdAt: new Date(), updatedAt: new Date() },
                { id: 4, name: 'Products', displayOrder: 4, createdAt: new Date(), updatedAt: new Date() },
                { id: 5, name: 'Prints', displayOrder: 5, createdAt: new Date(), updatedAt: new Date() },
                { id: 6, name: 'Motions', displayOrder: 6, createdAt: new Date(), updatedAt: new Date() },
                { id: 7, name: 'Shorts', displayOrder: 7, createdAt: new Date(), updatedAt: new Date() }
            ];
            const response: APIResponse<Category[]> = {
                success: true,
                data: defaultCategories
            };
            return NextResponse.json(response);
        }

        const categoryDB = new CategoryDB(env.DB);

        // Get all categories
        const dbCategories = await categoryDB.getAll();
        const categories = dbCategories.map(dbCategoryToCategory);

        const response: APIResponse<Category[]> = {
            success: true,
            data: categories
        };

        console.log(`✅ Successfully fetched ${categories.length} categories`);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch categories'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
    console.log('🆕 POST /api/categories - creating new category');

    try {
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
        const body: CreateCategoryRequest = await request.json();
        console.log('📦 Category data received:', body.name);

        // Validate required fields
        if (!body.name || body.name.trim() === '') {
            const response: APIResponse = {
                success: false,
                error: 'Category name is required'
            };
            return NextResponse.json(response, { status: 400 });
        }

        const categoryDB = new CategoryDB(env.DB);

        // Create category
        const dbCategory = await categoryDB.create({
            name: body.name.trim(),
            displayOrder: body.displayOrder
        });

        const category = dbCategoryToCategory(dbCategory);

        const response: APIResponse<Category> = {
            success: true,
            data: category,
            message: 'Category created successfully'
        };

        console.log('✅ Category created successfully:', category.name);
        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating category:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create category'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
