// API endpoint to serve media files from R2 storage
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/lib/types';

export const runtime = 'edge';

console.log('🖼️ Media serving API loaded - ready to serve files like a digital waiter!');

// GET /api/media/[...path] - Serve media files from R2
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join('/');
  
  console.log('📁 Serving media file:', filePath);
  
  try {
    // Get Cloudflare bindings from request context with fallback
    let env: CloudflareEnv;
    try {
      env = getRequestContext().env as CloudflareEnv;
    } catch {
      // Fallback for development - return placeholder
      console.log('⚠️ Cloudflare context not available, returning placeholder image');
      return new NextResponse('Development mode - media not available', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Get file from R2
    const object = await env.R2.get(filePath);
    
    if (!object) {
      console.log('❌ File not found in R2:', filePath);
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file content and metadata
    const data = await object.arrayBuffer();
    const contentType = object.httpMetadata?.contentType || 'application/octet-stream';
    
    console.log('✅ Successfully served file:', filePath, 'type:', contentType, 'size:', data.byteLength);

    // Return file with appropriate headers
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': data.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error serving media file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
