// API endpoints for projects CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB, SlideDB, dbProjectToProject, dbSlideToSlide } from '@/lib/db-utils';
import { uploadMedia } from '@/lib/media';
import {
    CloudflareEnv,
    APIResponse,
    PaginatedResponse,
    ProjectWithSlides,
    ProjectCategory
} from '@/lib/types';

export const runtime = 'edge';

console.log('🚀 Projects API loaded - ready to manage projects like a digital project manager!');

// GET /api/projects - Get all projects with optional filtering
export async function GET(request: NextRequest) {
    console.log('📋 GET /api/projects - fetching projects');

    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') as ProjectCategory | null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        console.log('🔍 Query params:', { category, page, limit, offset });

        // Get Cloudflare bindings from request context with fallback
        let env: CloudflareEnv;
        try {
            env = getRequestContext().env as CloudflareEnv;
        } catch {
            // Fallback for development - return empty data
            console.log('⚠️ Cloudflare context not available, returning empty data for development');
            const response: PaginatedResponse<ProjectWithSlides> = {
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

        const projectDB = new ProjectDB(env.DB);
        const slideDB = new SlideDB(env.DB);

        // Get projects with pagination
        const { projects, total } = await projectDB.getAll({
            category: category || undefined,
            limit,
            offset
        });

        // Convert to frontend format and get slides for each project
        const projectsWithSlides: ProjectWithSlides[] = await Promise.all(
            projects.map(async (dbProject) => {
                const project = dbProjectToProject(dbProject);
                const slides = await slideDB.getByProjectId(dbProject.id);
                project.slides = slides.map(dbSlideToSlide);
                return project;
            })
        );

        const response: PaginatedResponse<ProjectWithSlides> = {
            success: true,
            data: {
                items: projectsWithSlides,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

        console.log(`✅ Successfully fetched ${projectsWithSlides.length} projects (page ${page}/${Math.ceil(total / limit)})`);
        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch projects'
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
    console.log('🆕 POST /api/projects - creating new project');

    try {
        // Get Cloudflare bindings from request context
        const env = getRequestContext().env as CloudflareEnv;

        const formData = await request.formData();

        // Extract form data
        const name = formData.get('name') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string || undefined;
        const clientName = formData.get('clientName') as string;
        const tagsString = formData.get('tags') as string;
        const category = formData.get('category') as ProjectCategory;
        const projectType = formData.get('projectType') as 'image' | 'horizontal' | 'vertical';
        const dateFinished = formData.get('dateFinished') as string || undefined;
        const extraFieldsString = formData.get('extraFields') as string || undefined;
        const thumbnailFile = formData.get('thumbnailFile') as File | null;
        const clientLogoFile = formData.get('clientLogoFile') as File | null;
        const iconBarBgColor = formData.get('iconBarBgColor') as string || '#4FAF78';
        const iconBarIconColor = formData.get('iconBarIconColor') as string || '#FFFFFF';

        console.log('📝 Creating project with data:', { name, title, clientName, category, projectType });

        // Validate required fields
        if (!name || !title || !clientName || !category || !projectType) {
            throw new Error('Missing required fields: name, title, clientName, category, projectType');
        }

        // Parse tags
        let tags: string[] = [];
        try {
            tags = JSON.parse(tagsString || '[]');
        } catch {
            tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];
        }

        // Parse extra fields
        let extraFields: { name: string; value: string; url?: string }[] = [];
        try {
            extraFields = JSON.parse(extraFieldsString || '[]');
            // Validate and limit to 4 fields
            if (Array.isArray(extraFields)) {
                extraFields = extraFields.slice(0, 4).filter(field => 
                    field && typeof field === 'object' && field.name && field.value
                ).map(field => ({
                    name: field.name,
                    value: field.value,
                    url: field.url || undefined // Include URL if provided
                }));
            } else {
                extraFields = [];
            }
        } catch {
            console.log('⚠️ Failed to parse extra fields, using empty array');
            extraFields = [];
        }

        // Upload client logo if provided
        let clientLogoKey: string | undefined;
        if (clientLogoFile && clientLogoFile.size > 0) {
            console.log('📸 Uploading client logo file:', clientLogoFile.name);
            clientLogoKey = await uploadMedia(env.R2, clientLogoFile, 'logos');
        }

        // Upload thumbnail if provided
        let thumbnailKey: string | undefined;
        if (thumbnailFile && thumbnailFile.size > 0) {
            console.log('📸 Uploading thumbnail file:', thumbnailFile.name);
            thumbnailKey = await uploadMedia(env.R2, thumbnailFile, 'thumbnails');
        } else {
            throw new Error('Thumbnail file is required');
        }

        // Create project in database
        const projectDB = new ProjectDB(env.DB);
        const dbProject = await projectDB.create({
            name,
            title,
            description,
            clientName,
            clientLogoKey,
            tags,
            category,
            projectType,
            dateFinished,
            extraFields,
            thumbnailKey,
            iconBarBgColor,
            iconBarIconColor
        });

        // Convert to frontend format
        const project = dbProjectToProject(dbProject);

        const response: APIResponse<ProjectWithSlides> = {
            success: true,
            data: project,
            message: 'Project created successfully'
        };

        console.log('🎉 Project created successfully:', project.id);
        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating project:', error);
        const response: APIResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create project'
        };
        return NextResponse.json(response, { status: 500 });
    }
}
