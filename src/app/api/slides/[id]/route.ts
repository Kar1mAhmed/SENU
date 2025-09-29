// API endpoints for individual slide operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { SlideDB, dbSlideToSlide } from '@/lib/db-utils';
import { uploadMedia, deleteMedia } from '@/lib/media';
import { getSlideTypeFromFile } from '@/lib/file-utils';
import { 
  CloudflareEnv, 
  APIResponse, 
  ProjectSlide,
  SlideType 
} from '@/lib/types';

export const runtime = 'edge';

console.log('🎯 Individual slide API loaded - ready for precision slide operations!');

// GET /api/slides/[id] - Get specific slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🔍 GET /api/slides/[id] - fetching slide:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const slideDB = new SlideDB(env.DB);
    const dbSlide = await slideDB.getById(id);
    const slide = dbSlideToSlide(dbSlide);

    const response: APIResponse<ProjectSlide> = {
      success: true,
      data: slide
    };

    console.log('✅ Successfully fetched slide:', slide.id, 'for project:', slide.projectId);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching slide:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch slide'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}

// PUT /api/slides/[id] - Update specific slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('✏️ PUT /api/slides/[id] - updating slide:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = process.env as unknown as CloudflareEnv;
    if (!env.DB || !env.R2) {
      throw new Error('Database or R2 storage not available');
    }

    const formData = await request.formData();
    
    // Extract form data
    const orderString = formData.get('order') as string || undefined;
    const slideType = formData.get('type') as SlideType || undefined;
    const text = formData.get('text') as string || undefined;
    const mediaFile = formData.get('mediaFile') as File | null;

    console.log('📝 Updating slide with fields:', {
      hasOrder: !!orderString,
      slideType,
      hasText: !!text,
      hasNewMedia: !!(mediaFile && mediaFile.size > 0)
    });

    const slideDB = new SlideDB(env.DB);

    // Parse order if provided
    let order: number | undefined;
    if (orderString) {
      order = parseInt(orderString);
    }

    // Handle media upload if new file provided
    let mediaKey: string | undefined;
    let finalSlideType = slideType;

    if (mediaFile && mediaFile.size > 0) {
      console.log('📁 Uploading new media file:', mediaFile.name);
      
      // Get current slide to delete old media
      try {
        const currentSlide = await slideDB.getById(id);
        if (currentSlide.media_key) {
          await deleteMedia(env.R2, currentSlide.media_key);
          console.log('🗑️ Deleted old media:', currentSlide.media_key);
        }
      } catch (error) {
        console.warn('⚠️ Could not delete old media:', error);
      }

      // Determine slide type from file if not provided
      if (!finalSlideType) {
        finalSlideType = getSlideTypeFromFile(mediaFile);
      }

      // Upload new media
      mediaKey = await uploadMedia(env.R2, mediaFile, 'slides');
    }

    // Update slide in database
    const updateData: Partial<{
      order: number;
      type: SlideType;
      text?: string;
      mediaKey: string;
    }> = {};
    if (order !== undefined) updateData.order = order;
    if (finalSlideType) updateData.type = finalSlideType;
    if (text !== undefined) updateData.text = text;
    if (mediaKey) updateData.mediaKey = mediaKey;

    const dbSlide = await slideDB.update(id, updateData);

    // Convert to frontend format
    const slide = dbSlideToSlide(dbSlide);

    const response: APIResponse<ProjectSlide> = {
      success: true,
      data: slide,
      message: 'Slide updated successfully'
    };

    console.log('🎉 Slide updated successfully:', slide.id);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error updating slide:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update slide'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}

// DELETE /api/slides/[id] - Delete specific slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('🗑️ DELETE /api/slides/[id] - deleting slide:', id);
  
  try {
    // Get Cloudflare bindings from request context
    const env = process.env as unknown as CloudflareEnv;
    if (!env.DB || !env.R2) {
      throw new Error('Database or R2 storage not available');
    }

    const slideDB = new SlideDB(env.DB);

    // Get slide to delete associated media file
    const dbSlide = await slideDB.getById(id);

    console.log('🧹 Cleaning up media for slide:', dbSlide.id);

    // Delete media file from R2
    try {
      if (dbSlide.media_key) {
        await deleteMedia(env.R2, dbSlide.media_key);
        console.log('🗑️ Deleted slide media:', dbSlide.media_key);
      }
    } catch (error) {
      console.warn('⚠️ Could not delete slide media:', error);
    }

    // Delete slide from database
    await slideDB.delete(id);

    const response: APIResponse = {
      success: true,
      message: 'Slide and associated media deleted successfully'
    };

    console.log('🎉 Slide deleted successfully:', id);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error deleting slide:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete slide'
    };
    return NextResponse.json(response, { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 });
  }
}
