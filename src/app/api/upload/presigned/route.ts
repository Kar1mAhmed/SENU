// API endpoint for generating presigned URLs for direct R2 upload
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { generateMediaKey, generatePresignedUploadUrl } from '@/lib/media';
import { CloudflareEnv, APIResponse } from '@/lib/types';

export const runtime = 'edge';

console.log('🔐 Presigned URL API loaded - ready to generate secure upload URLs!');

// POST /api/upload/presigned - Generate presigned URL for direct R2 upload
export async function POST(request: NextRequest) {
  console.log('🆕 POST /api/upload/presigned - generating presigned URL');
  
  try {
    // Get Cloudflare bindings from request context
    const env = getRequestContext().env as CloudflareEnv;

    const body = await request.json();
    const { fileName, contentType, folder = 'uploads' } = body;

    console.log('📝 Generating presigned URL for:', { fileName, contentType, folder });

    // Validate required fields
    if (!fileName || !contentType) {
      throw new Error('Missing required fields: fileName, contentType');
    }

    // Get R2 credentials from environment
    const accountId = env.R2_ACCOUNT_ID;
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
    const bucketName = env.R2_BUCKET_NAME || 'senu';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error('❌ Missing R2 credentials in environment');
      throw new Error('R2 credentials not configured. Please check environment variables.');
    }

    // Generate unique key for the file
    const key = generateMediaKey(fileName, folder);

    // Generate presigned URL (valid for 1 hour)
    const presignedUrl = await generatePresignedUploadUrl(
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      key,
      contentType,
      3600 // 1 hour expiry
    );

    const response: APIResponse<{
      presignedUrl: string;
      key: string;
      expiresIn: number;
    }> = {
      success: true,
      data: {
        presignedUrl,
        key,
        expiresIn: 3600
      },
      message: 'Presigned URL generated successfully'
    };

    console.log('✅ Presigned URL generated for key:', key);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error generating presigned URL:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate presigned URL'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
