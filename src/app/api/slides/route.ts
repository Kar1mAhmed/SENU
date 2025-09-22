// API endpoints for slides CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { SlideDB, dbSlideToSlide } from '@/lib/db-utils';
import { uploadFileToR2, getSlideTypeFromFile } from '@/lib/file-utils';
import { 
  CloudflareEnv, 
  APIResponse, 
  ProjectSlide,
  SlideType 
} from '@/lib/types';

export const runtime = 'edge';

console.log('🎬 Slides API loaded - ready to manage slides like a Hollywood director!');

// GET /api/slides - Get slides for a specific project
export async function GET(request: NextRequest) {
  console.log('📋 GET /api/slides - fetching slides');
  
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      throw new Error('projectId parameter is required');
    }

    console.log('🔍 Fetching slides for project:', projectId);

    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const slideDB = new SlideDB(env.DB);
    const dbSlides = await slideDB.getByProjectId(projectId);
    const slides = dbSlides.map(dbSlideToSlide);

    const response: APIResponse<ProjectSlide[]> = {
      success: true,
      data: slides
    };

    console.log(`✅ Successfully fetched ${slides.length} slides for project:`, projectId);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching slides:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch slides'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/slides - Create new slide
export async function POST(request: NextRequest) {
  console.log('🆕 POST /api/slides - creating new slide');
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const formData = await request.formData();
    
    // Extract form data
    const projectId = formData.get('projectId') as string;
    const orderString = formData.get('order') as string;
    const slideType = formData.get('type') as SlideType;
    const text = formData.get('text') as string || undefined;
    const mediaFile = formData.get('mediaFile') as File | null;

    console.log('📝 Creating slide with data:', { projectId, order: orderString, slideType, hasText: !!text, hasMedia: !!mediaFile });

    // Validate required fields
    if (!projectId || !orderString) {
      throw new Error('Missing required fields: projectId, order');
    }

    const order = parseInt(orderString);
    if (isNaN(order)) {
      throw new Error('Order must be a valid number');
    }

    // Upload media file if provided
    let mediaUrl = '';
    let finalSlideType = slideType;

    if (mediaFile && mediaFile.size > 0) {
      console.log('📁 Uploading media file:', mediaFile.name);
      
      // Determine slide type from file if not provided
      if (!finalSlideType) {
        finalSlideType = getSlideTypeFromFile(mediaFile);
      }
      
      const uploadResult = await uploadFileToR2(env.R2, mediaFile, 'slides');
      mediaUrl = uploadResult.url;
    } else {
      throw new Error('Media file is required');
    }

    // Default slide type if still not determined
    if (!finalSlideType) {
      finalSlideType = 'image';
    }

    // Create slide in database
    const slideDB = new SlideDB(env.DB);
    const dbSlide = await slideDB.create({
      projectId,
      order,
      type: finalSlideType,
      text,
      mediaUrl
    });

    // Convert to frontend format
    const slide = dbSlideToSlide(dbSlide);

    const response: APIResponse<ProjectSlide> = {
      success: true,
      data: slide,
      message: 'Slide created successfully'
    };

    console.log('🎉 Slide created successfully:', slide.id);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating slide:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create slide'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
