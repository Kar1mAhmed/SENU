// API endpoints for individual project operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ProjectDB, SlideDB, dbProjectToProject, dbSlideToSlide } from '@/lib/db-utils';
import { uploadMedia, deleteMedia } from '@/lib/media';
import { 
  CloudflareEnv, 
  APIResponse, 
  ProjectWithSlides,
  ProjectCategory,
  ProjectType,
  ProjectExtraField,
  DBSlide
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

    // Get slides for the project with error handling
    let dbSlides: DBSlide[] = [];
    try {
      dbSlides = await slideDB.getByProjectId(id);
      project.slides = dbSlides.map(dbSlideToSlide);
      console.log('✅ Successfully fetched', dbSlides.length, 'slides for project:', id);
    } catch (slideError) {
      console.warn('⚠️ Failed to fetch slides for project:', id, slideError);
      project.slides = []; // Fallback to empty slides array
    }

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
    const env = getRequestContext().env as CloudflareEnv;

    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string || undefined;
    const title = formData.get('title') as string || undefined;
    const description = formData.get('description') as string || undefined;
    const clientName = formData.get('clientName') as string || undefined;
    const clientLogoFile = formData.get('clientLogoFile') as File | null;
    const tagsString = formData.get('tags') as string || undefined;
    const extraFieldsString = formData.get('extraFields') as string || undefined;
    const categoryIdString = formData.get('categoryId') as string || undefined;
    const projectType = formData.get('projectType') as 'image' | 'horizontal' | 'vertical' || undefined;
    const dateFinished = formData.get('dateFinished') as string || undefined;
    const thumbnailFile = formData.get('thumbnailFile') as File | null;
    const iconBarBgColor = formData.get('iconBarBgColor') as string || undefined;
    const iconBarIconColor = formData.get('iconBarIconColor') as string || undefined;

    console.log('🎨 Backend received colors:', {
      iconBarBgColor,
      iconBarIconColor,
      hasColors: !!(iconBarBgColor && iconBarIconColor)
    });

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

    // Parse extra fields if provided
    let extraFields: { name: string; value: string }[] | undefined;
    if (extraFieldsString) {
      try {
        const parsed = JSON.parse(extraFieldsString);
        // Validate and limit to 4 fields
        if (Array.isArray(parsed)) {
          extraFields = parsed.slice(0, 4).filter(field => 
            field && typeof field === 'object' && field.name && field.value
          );
          console.log('📋 Parsed extra fields:', extraFields.length, 'fields');
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse extra fields:', error);
        extraFields = undefined;
      }
    }

    // Log what fields are being updated
    console.log('📝 Updating project with fields:', [
      name && 'name',
      title && 'title', 
      description !== undefined && 'description',
      clientName && 'clientName',
      tags && 'tags',
      extraFields && 'extraFields',
      categoryIdString && 'categoryId',
      projectType && 'projectType',
      dateFinished !== undefined && 'dateFinished',
      thumbnailFile && 'thumbnailFile'
    ].filter(Boolean).join(', '));
    
    if (extraFields) {
      console.log('📋 Extra fields being updated:', extraFields);
    }

    // Handle client logo upload if new file provided
    let clientLogoKey: string | undefined;
    if (clientLogoFile && clientLogoFile.size > 0) {
      console.log('📸 Uploading new client logo file:', clientLogoFile.name);
      
      // Get current project to delete old client logo
      try {
        const currentProject = await projectDB.getById(id);
        if (currentProject.client_logo_key) {
          await deleteMedia(env.R2, currentProject.client_logo_key);
          console.log('🗑️ Deleted old client logo:', currentProject.client_logo_key);
        }
      } catch (error) {
        console.warn('⚠️ Could not delete old client logo:', error);
      }

      // Upload new client logo
      clientLogoKey = await uploadMedia(env.R2, clientLogoFile, 'logos');
    }

    // Handle thumbnail upload if new file provided
    let thumbnailKey: string | undefined;
    if (thumbnailFile && thumbnailFile.size > 0) {
      console.log('📸 Uploading new thumbnail file:', thumbnailFile.name);
      
      // Get current project to delete old thumbnail
      try {
        const currentProject = await projectDB.getById(id);
        if (currentProject.thumbnail_key) {
          await deleteMedia(env.R2, currentProject.thumbnail_key);
          console.log('🗑️ Deleted old thumbnail:', currentProject.thumbnail_key);
        }
      } catch (error) {
        console.warn('⚠️ Could not delete old thumbnail:', error);
      }

      // Upload new thumbnail
      thumbnailKey = await uploadMedia(env.R2, thumbnailFile, 'thumbnails');
    }

    // Parse categoryId if provided
    let categoryId: number | undefined;
    if (categoryIdString) {
      categoryId = parseInt(categoryIdString);
      if (isNaN(categoryId)) {
        throw new Error('Invalid categoryId');
      }
    }

    // Update project in database
    const updateData: Partial<{
      name: string;
      title: string;
      description?: string;
      clientName: string;
      clientLogoKey?: string;
      tags: string[];
      categoryId: number;
      projectType: ProjectType;
      dateFinished?: string;
      extraFields?: ProjectExtraField[];
      thumbnailKey?: string;
      iconBarBgColor?: string;
      iconBarIconColor?: string;
    }> = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientLogoKey !== undefined) updateData.clientLogoKey = clientLogoKey;
    if (tags !== undefined) updateData.tags = tags;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (projectType !== undefined) updateData.projectType = projectType;
    if (dateFinished !== undefined) updateData.dateFinished = dateFinished;
    if (thumbnailKey !== undefined) updateData.thumbnailKey = thumbnailKey;
    if (extraFields !== undefined) updateData.extraFields = extraFields;
    if (iconBarBgColor !== undefined) updateData.iconBarBgColor = iconBarBgColor;
    if (iconBarIconColor !== undefined) updateData.iconBarIconColor = iconBarIconColor;

    const dbProject = await projectDB.update(id, updateData);

    // Get updated project with slides
    const slideDB = new SlideDB(env.DB);
    const project = dbProjectToProject(dbProject);
    
    // Get slides with error handling
    try {
      const dbSlides = await slideDB.getByProjectId(id);
      project.slides = dbSlides.map(dbSlideToSlide);
    } catch (slideError) {
      console.warn('⚠️ Failed to fetch slides for updated project:', id, slideError);
      project.slides = []; // Fallback to empty slides array
    }

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
    const env = getRequestContext().env as CloudflareEnv;

    const projectDB = new ProjectDB(env.DB);
    const slideDB = new SlideDB(env.DB);

    // Get project and slides to delete associated files
    const dbProject = await projectDB.getById(id);
    let dbSlides: DBSlide[] = [];
    
    // Get slides with error handling
    try {
      dbSlides = await slideDB.getByProjectId(id);
    } catch (slideError) {
      console.warn('⚠️ Failed to fetch slides for deletion, continuing with project deletion:', id, slideError);
      dbSlides = []; // Continue with empty slides array
    }

    console.log('🧹 Cleaning up files for project:', dbProject.name, 'with', dbSlides.length, 'slides');

    // Delete thumbnail from R2
    try {
      if (dbProject.thumbnail_key) {
        await deleteMedia(env.R2, dbProject.thumbnail_key);
        console.log('🗑️ Deleted thumbnail:', dbProject.thumbnail_key);
      }
    } catch (error) {
      console.warn('⚠️ Could not delete thumbnail:', error);
    }

    // Delete slide media files from R2
    for (const slide of dbSlides) {
      try {
        if (slide.media_key) {
          await deleteMedia(env.R2, slide.media_key);
          console.log('🗑️ Deleted slide media:', slide.media_key);
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
