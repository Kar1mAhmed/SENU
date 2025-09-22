// API endpoints for projects CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB, SlideDB, dbProjectToProject } from '@/lib/db-utils';
import { uploadFileToR2 } from '@/lib/file-utils';
import {
    CloudflareEnv,
    APIResponse,
    PaginatedResponse,
    ProjectWithSlides,
    CreateProjectRequest,
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
                project.slides = slides.map(slide => ({
                    id: slide.id,
                    projectId: slide.project_id,
                    order: slide.slide_order,
                    type: slide.slide_type,
                    text: slide.slide_text,
                    mediaUrl: slide.media_url,
                    createdAt: new Date(slide.created_at),
                    updatedAt: new Date(slide.updated_at)
                }));
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
        const thumbnailFile = formData.get('thumbnailFile') as File | null;

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

        // Upload thumbnail if provided
        let thumbnailUrl = '';
        if (thumbnailFile && thumbnailFile.size > 0) {
            console.log('📸 Uploading thumbnail file:', thumbnailFile.name);
            const uploadResult = await uploadFileToR2(env.R2, thumbnailFile, 'thumbnails');
            thumbnailUrl = uploadResult.url;
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
            tags,
            category,
            projectType,
            dateFinished,
            thumbnailUrl
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
