// API endpoint for file uploads to R2
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { uploadFileToR2 } from '@/lib/file-utils';
import { 
  CloudflareEnv, 
  APIResponse, 
  FileUploadResponse 
} from '@/lib/types';

export const runtime = 'edge';

console.log('☁️ Upload API loaded - ready to handle files faster than cloud storage!');

// POST /api/upload - Upload file to R2
export async function POST(request: NextRequest) {
  console.log('📤 POST /api/upload - handling file upload');
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const formData = await request.formData();
    
    // Extract form data
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'uploads';

    console.log('📁 Processing upload:', { 
      hasFile: !!file, 
      fileName: file?.name, 
      fileSize: file?.size, 
      folder 
    });

    if (!file || file.size === 0) {
      throw new Error('No file provided or file is empty');
    }

    // Upload file to R2
    const uploadResult = await uploadFileToR2(env.R2, file, folder);

    const response: APIResponse<FileUploadResponse> = {
      success: true,
      data: uploadResult,
      message: 'File uploaded successfully'
    };

    console.log('🎉 File uploaded successfully:', uploadResult.key);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Error uploading file:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/upload - Delete file from R2
export async function DELETE(request: NextRequest) {
  console.log('🗑️ DELETE /api/upload - deleting file');
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const url = searchParams.get('url');

    console.log('🔍 Delete request:', { key, url });

    let fileKey = key;
    if (!fileKey && url) {
      // Extract key from URL if only URL is provided
      try {
        const urlObj = new URL(url);
        fileKey = urlObj.pathname.substring(1); // Remove leading slash
      } catch (error) {
        throw new Error('Invalid URL provided');
      }
    }

    if (!fileKey) {
      throw new Error('File key or URL is required');
    }

    // Delete file from R2
    await env.R2.delete(fileKey);

    const response: APIResponse = {
      success: true,
      message: 'File deleted successfully'
    };

    console.log('🎉 File deleted successfully:', fileKey);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
