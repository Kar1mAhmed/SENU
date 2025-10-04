// API endpoint for reordering projects
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB } from '@/lib/db-utils';
import { CloudflareEnv, APIResponse } from '@/lib/types';

export const runtime = 'edge';

console.log('🔄 Projects Reorder API loaded - ready to shuffle projects like a deck of cards!');

// POST /api/projects/reorder - Reorder a project
export async function POST(request: NextRequest) {
    console.log('🔄 POST /api/projects/reorder - reordering project');

    try {
        // Get Cloudflare bindings from request context
        const env = getRequestContext().env as CloudflareEnv;

        const body = await request.json();
        const { projectId, direction, categoryId } = body;

        console.log('📝 Reorder request:', { projectId, direction, categoryId });

        // Validate required fields
        if (!projectId || !direction) {
            throw new Error('Missing required fields: projectId, direction');
        }

        if (direction !== 'up' && direction !== 'down') {
            throw new Error('Invalid direction. Must be "up" or "down"');
        }

        // Reorder the project
        const projectDB = new ProjectDB(env.DB);
        await projectDB.reorder(projectId, direction, categoryId === undefined ? null : categoryId);

        const response: APIResponse = {
            success: true,
            message: 'Project reordered successfully'
        };

        console.log('🎉 Project reordered successfully');
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error reordering project:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reorder project'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
