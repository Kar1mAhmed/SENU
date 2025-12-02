// API endpoint for getting project thumbnails
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB } from '@/lib/db-utils';
import { keyToUrl } from '@/lib/media';
import { CloudflareEnv, APIResponse } from '@/lib/types';

export const runtime = 'edge';

console.log('🖼️ Thumbnails API loaded - ready to serve beautiful project previews!');

interface ThumbnailData {
    id: string;
    name: string;
    thumbnailUrl: string;
}

// GET /api/projects/thumbnails - Get all project thumbnails
export async function GET(request: NextRequest) {
    console.log('🖼️ GET /api/projects/thumbnails - fetching thumbnails');

    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '12'); // Default 12 for circular gallery

        console.log('🔍 Query params:', { limit });

        // Get Cloudflare bindings from request context with fallback
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            // Fallback for development - return empty data
            console.log('⚠️ Cloudflare context not available, returning empty data for development');
            const response: APIResponse<ThumbnailData[]> = {
                success: true,
                data: []
            };
            return NextResponse.json(response);
        }

        const projectDB = new ProjectDB(env.DB);

        // Get projects without pagination (or with limit)
        const { projects } = await projectDB.getAll({
            limit,
            offset: 0
        });

        console.log(`📸 Found ${projects.length} projects with thumbnails`);

        // Map to thumbnail data with URLs
        const thumbnails: ThumbnailData[] = projects
            .filter(project => project.thumbnail_key) // Only include projects with thumbnails
            .map(project => {
                const url = keyToUrl(project.thumbnail_key!);
                const thumbnail = {
                    id: String(project.id),
                    name: project.name,
                    thumbnailUrl: url || '' // Fallback to empty string if null
                };
                console.log('📦 Thumbnail data:', thumbnail);
                return thumbnail;
            })
            .filter(thumb => thumb.thumbnailUrl); // Remove any with empty URLs

        console.log(`✅ Returning ${thumbnails.length} thumbnails:`, thumbnails);

        const response: APIResponse<ThumbnailData[]> = {
            success: true,
            data: thumbnails
        };

        return NextResponse.json(response, {
            headers: {
                // Cache for 1 hour in browser, 24 hours in CDN
                'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
                // Allow caching
                'CDN-Cache-Control': 'max-age=86400',
                // Vary by query parameters
                'Vary': 'Accept-Encoding',
            },
        });

    } catch (error) {
        console.error('❌ Error fetching thumbnails:', error);
        const response: APIResponse<ThumbnailData[]> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch thumbnails'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
