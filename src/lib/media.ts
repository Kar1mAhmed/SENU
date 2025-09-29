// Centralized media utilities for key-based storage
import { R2Bucket } from './types';

console.log('🎬 Media utilities loaded - centralized media management ready!');

/**
 * Generate a unique media key for R2 storage
 */
export function generateMediaKey(originalName: string, folder: string = 'uploads'): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');

    const key = `${folder}/${timestamp}-${randomStr}-${sanitizedName}`;
    console.log('🔑 Generated media key:', key);
    return key;
}

/**
 * Convert media key to URL for frontend consumption
 */
export function keyToUrl(key: string | null | undefined): string | null {
    if (!key) return null;
    const url = `/api/media/${key}`;
    console.log('🔗 Key to URL:', key, '→', url);
    return url;
}

/**
 * Upload file to R2 and return the key
 */
export async function uploadMedia(
    r2: R2Bucket,
    file: File,
    folder: string = 'uploads'
): Promise<string> {
    console.log('☁️ Uploading media:', file.name, 'to folder:', folder);

    const key = generateMediaKey(file.name, folder);
    const arrayBuffer = await file.arrayBuffer();

    const result = await r2.put(key, arrayBuffer, {
        httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000', // 1 year cache
        },
        customMetadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
        }
    });

    if (!result) {
        throw new Error('Failed to upload media to R2');
    }

    console.log('🎉 Media uploaded successfully with key:', key);
    return key;
}

/**
 * Delete media from R2 by key
 */
export async function deleteMedia(r2: R2Bucket, key: string): Promise<void> {
    console.log('🗑️ Deleting media with key:', key);

    try {
        await r2.delete(key);
        console.log('✅ Media deleted successfully:', key);
    } catch (error) {
        console.error('❌ Failed to delete media:', key, error);
        throw new Error(`Failed to delete media: ${key}`);
    }
}

/**
 * Get media from R2 by key
 */
export async function getMedia(r2: R2Bucket, key: string) {
    console.log('📥 Fetching media with key:', key);

    try {
        const object = await r2.get(key);
        if (!object) {
            console.warn('⚠️ Media not found:', key);
            return null;
        }

        console.log('✅ Media fetched successfully:', key);
        return object;
    } catch (error) {
        console.error('❌ Failed to fetch media:', key, error);
        return null;
    }
}
