// Media serving endpoint for R2 storage
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Import Cloudflare types
interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
}

interface R2Object {
  body: ReadableStream;
  size: number;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
  };
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta: { changes: number; last_row_id: number } }>;
}

export const runtime = 'edge';

console.log('📁 Media serving endpoint loaded - ready to serve files like a digital waiter!');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  console.log('🖼️ GET /api/media - serving media file');

  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;
    
    // Await the params promise
    const { path } = await params;
    
    // Join the path segments to get the full key
    const key = path.join('/');
    console.log('📂 Serving media file with key:', key);

    // Check if R2 is available (production/preview)
    if (!env.R2) {
      console.warn('⚠️ R2 not available, returning 404');
      return new NextResponse('Media not available in development', { status: 404 });
    }

    // Get the object from R2
    const object = await env.R2.get(key);
    
    if (!object) {
      console.log('❌ Media file not found:', key);
      return new NextResponse('Media not found', { status: 404 });
    }

    // Get the content type based on file extension
    const getContentType = (filename: string): string => {
      const ext = filename.toLowerCase().split('.').pop();
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        case 'webp':
          return 'image/webp';
        case 'svg':
          return 'image/svg+xml';
        case 'mp4':
          return 'video/mp4';
        case 'webm':
          return 'video/webm';
        case 'mov':
          return 'video/quicktime';
        default:
          return 'application/octet-stream';
      }
    };

    const contentType = getContentType(key);
    console.log('✅ Serving media file:', key, 'as', contentType);

    // Return the file with appropriate headers
    return new NextResponse(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': object.size.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error serving media file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Define the CloudflareEnv interface
interface CloudflareEnv {
  R2: R2Bucket;
  DB: D1Database;
}
