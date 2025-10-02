// File upload utilities for R2 storage - DEPRECATED
// Use /lib/media.ts for new implementations
import { R2Bucket, FileUploadResponse } from './types';
import { uploadMedia } from './media';

console.log('📁 File utilities loaded - migrating to centralized media system!');

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Max file sizes (in bytes)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  console.log('🔍 Validating file:', file.name, 'type:', file.type, 'size:', file.size);

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024)}MB for ${isImage ? 'images' : 'videos'}`
    };
  }

  console.log('✅ File validation passed for:', file.name);
  return { valid: true };
}

export function generateFileKey(originalName: string, folder: string = 'uploads'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');

  const key = `${folder}/${timestamp}-${randomStr}-${sanitizedName}`;
  console.log('🔑 Generated file key:', key);
  return key;
}

// DEPRECATED: Use uploadMedia from /lib/media.ts instead
export async function uploadFileToR2(
  r2: R2Bucket,
  file: File,
  folder: string = 'uploads'
): Promise<FileUploadResponse> {
  console.log('⚠️ DEPRECATED: uploadFileToR2 - use uploadMedia instead');
  
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Use new centralized upload
  const key = await uploadMedia(r2, file, folder);
  // Import keyToUrl dynamically to avoid circular dependency
  const { keyToUrl } = await import('./media');
  const mediaUrl = keyToUrl(key) || `/api/media/${key}`;

  return {
    url: mediaUrl,
    key: key,
    size: file.size,
    contentType: file.type
  };
}

export async function deleteFileFromR2(r2: R2Bucket, key: string): Promise<void> {
  console.log('🗑️ Deleting file from R2:', key);

  try {
    await r2.delete(key);
    console.log('✅ File deleted successfully from R2:', key);
  } catch (error) {
    console.error('❌ Failed to delete file from R2:', key, error);
    throw new Error(`Failed to delete file: ${key}`);
  }
}

export function extractKeyFromUrl(url: string): string | null {
  // Extract the key from a full R2 URL
  // This assumes URLs are in format: https://your-r2-domain.com/uploads/...
  try {
    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1); // Remove leading slash
    console.log('🔑 Extracted key from URL:', key);
    return key;
  } catch (error) {
    console.error('❌ Failed to extract key from URL:', url, error);
    return null;
  }
}

// Helper to get file type from extension
export function getFileTypeFromExtension(filename: string): 'image' | 'video' | 'unknown' {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];

  if (imageExtensions.includes(extension)) {
    return 'image';
  } else if (videoExtensions.includes(extension)) {
    return 'video';
  }

  return 'unknown';
}

// Helper to determine slide type from file
export function getSlideTypeFromFile(file: File): 'image' | 'vertical' | 'horizontal' {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'image';
  }

  // For videos, we'll default to horizontal
  // In a real app, you might want to analyze video dimensions
  return 'horizontal';
}
