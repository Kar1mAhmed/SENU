// API endpoints for individual project operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB, SlideDB, dbProjectToProject, dbSlideToSlide } from '@/lib/db-utils';
import { uploadFileToR2, deleteFileFromR2, extractKeyFromUrl } from '@/lib/file-utils';
import { 
  CloudflareEnv, 
  APIResponse, 
  ProjectWithSlides,
  ProjectCategory 
} from '@/lib/types';

export const runtime = 'edge';

console.log('🎯 Individual project API loaded - ready for targeted project operations!');

// GET /api/projects/[id] - Get specific project with slides
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 GET /api/projects/[id] - fetching project:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const projectDB = new ProjectDB(env.DB);
    const slideDB = new SlideDB(env.DB);

    // Get project
    const dbProject = await projectDB.getById(id);
    const project = dbProjectToProject(dbProject);

    // Get slides for the project
    const dbSlides = await slideDB.getByProjectId(id);
    project.slides = dbSlides.map(dbSlideToSlide);

    const response: APIResponse<ProjectWithSlides> = {
      success: true,
      data: project
    };

    console.log('✅ Successfully fetched project:', project.name, 'with', project.slides.length, 'slides');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch project'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}

// PUT /api/projects/[id] - Update specific project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('✏️ PUT /api/projects/[id] - updating project:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = process.env as unknown as CloudflareEnv;
    if (!env.DB || !env.R2) {
      throw new Error('Database or R2 storage not available');
    }

    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string || undefined;
    const title = formData.get('title') as string || undefined;
    const description = formData.get('description') as string || undefined;
    const clientName = formData.get('clientName') as string || undefined;
    const tagsString = formData.get('tags') as string || undefined;
    const category = formData.get('category') as ProjectCategory || undefined;
    const projectType = formData.get('projectType') as 'image' | 'horizontal' | 'vertical' || undefined;
    const dateFinished = formData.get('dateFinished') as string || undefined;
    const thumbnailFile = formData.get('thumbnailFile') as File | null;

    console.log('📝 Updating project with fields:', Object.keys({
      name, title, description, clientName, category, projectType, dateFinished
    }).filter(key => (formData.get(key) !== null && formData.get(key) !== undefined)).join(', '));

    const projectDB = new ProjectDB(env.DB);

    // Parse tags if provided
    let tags: string[] | undefined;
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
      } catch {
        tags = tagsString.split(',').map(t => t.trim());
      }
    }

    // Handle thumbnail upload if new file provided
    let thumbnailUrl: string | undefined;
    if (thumbnailFile && thumbnailFile.size > 0) {
      console.log('📸 Uploading new thumbnail file:', thumbnailFile.name);
      
      // Get current project to delete old thumbnail
      try {
        const currentProject = await projectDB.getById(id);
        const oldKey = extractKeyFromUrl(currentProject.thumbnail_url);
        if (oldKey) {
          await deleteFileFromR2(env.R2, oldKey);
          console.log('🗑️ Deleted old thumbnail:', oldKey);
        }
      } catch (error) {
        console.warn('⚠️ Could not delete old thumbnail:', error);
      }

      // Upload new thumbnail
      const uploadResult = await uploadFileToR2(env.R2, thumbnailFile, 'thumbnails');
      thumbnailUrl = uploadResult.url;
    }

    // Update project in database
    const dbProject = await projectDB.update(id, {
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

    // Get updated project with slides
    const slideDB = new SlideDB(env.DB);
    const project = dbProjectToProject(dbProject);
    const dbSlides = await slideDB.getByProjectId(id);
    project.slides = dbSlides.map(dbSlideToSlide);

    const response: APIResponse<ProjectWithSlides> = {
      success: true,
      data: project,
      message: 'Project updated successfully'
    };

    console.log('🎉 Project updated successfully:', project.name);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error updating project:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}

// DELETE /api/projects/[id] - Delete specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🗑️ DELETE /api/projects/[id] - deleting project:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = process.env as unknown as CloudflareEnv;
    if (!env.DB || !env.R2) {
      throw new Error('Database or R2 storage not available');
    }

    const projectDB = new ProjectDB(env.DB);
    const slideDB = new SlideDB(env.DB);

    // Get project and slides to delete associated files
    const dbProject = await projectDB.getById(id);
    const dbSlides = await slideDB.getByProjectId(id);

    console.log('🧹 Cleaning up files for project:', dbProject.name, 'with', dbSlides.length, 'slides');

    // Delete thumbnail from R2
    try {
      const thumbnailKey = extractKeyFromUrl(dbProject.thumbnail_url);
      if (thumbnailKey) {
        await deleteFileFromR2(env.R2, thumbnailKey);
      }
    } catch (error) {
      console.warn('⚠️ Could not delete thumbnail:', error);
    }

    // Delete slide media files from R2
    for (const slide of dbSlides) {
      try {
        const mediaKey = extractKeyFromUrl(slide.media_url);
        if (mediaKey) {
          await deleteFileFromR2(env.R2, mediaKey);
        }
      } catch (error) {
        console.warn('⚠️ Could not delete slide media:', slide.id, error);
      }
    }

    // Delete slides from database (will be handled by CASCADE, but let's be explicit)
    await slideDB.deleteByProjectId(id);

    // Delete project from database
    await projectDB.delete(id);

    const response: APIResponse = {
      success: true,
      message: 'Project and all associated data deleted successfully'
    };

    console.log('🎉 Project deleted successfully:', id);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error deleting project:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete project'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}
