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

/**
 * Generate presigned URL for direct R2 upload (bypasses Worker limits)
 * This allows uploading files larger than 500MB directly to R2
 */
export async function generatePresignedUploadUrl(
    accountId: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    key: string,
    contentType: string,
    expiresIn: number = 3600 // 1 hour default
): Promise<string> {
    console.log('🔐 Generating presigned URL for key:', key);

    // R2 endpoint format
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

    // Create AWS v4 signature
    const url = new URL(endpoint);
    const date = new Date();
    const dateString = date.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
    const dateStamp = dateString.slice(0, 8);

    // Credential scope
    const region = 'auto'; // R2 uses 'auto' as region
    const service = 's3';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

    // Add query parameters for presigned URL
    url.searchParams.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    url.searchParams.set('X-Amz-Credential', `${accessKeyId}/${credentialScope}`);
    url.searchParams.set('X-Amz-Date', dateString);
    url.searchParams.set('X-Amz-Expires', expiresIn.toString());
    url.searchParams.set('X-Amz-SignedHeaders', 'content-type;host');

    // Canonical request
    const canonicalUri = `/${bucketName}/${key}`;
    const canonicalQueryString = Array.from(url.searchParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const canonicalHeaders = `content-type:${contentType}\nhost:${url.host}\n`;
    const signedHeaders = 'content-type;host';
    const payloadHash = 'UNSIGNED-PAYLOAD';

    const canonicalRequest = [
        'PUT',
        canonicalUri,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        payloadHash
    ].join('\n');

    // String to sign
    const canonicalRequestHash = await sha256(canonicalRequest);
    const stringToSign = [
        'AWS4-HMAC-SHA256',
        dateString,
        credentialScope,
        canonicalRequestHash
    ].join('\n');

    // Calculate signature
    const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
    const signature = await hmacSha256(signingKey, stringToSign);

    // Add signature to URL
    url.searchParams.set('X-Amz-Signature', signature);

    console.log('✅ Presigned URL generated successfully');
    return url.toString();
}

// Helper functions for AWS v4 signing
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, message: string): Promise<string> {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function getSignatureKey(
    key: string,
    dateStamp: string,
    region: string,
    service: string
): Promise<ArrayBuffer> {
    const kDate = await hmacSha256Raw(new TextEncoder().encode('AWS4' + key), dateStamp);
    const kRegion = await hmacSha256Raw(kDate, region);
    const kService = await hmacSha256Raw(kRegion, service);
    const kSigning = await hmacSha256Raw(kService, 'aws4_request');
    return kSigning;
}

async function hmacSha256Raw(key: ArrayBuffer | Uint8Array, message: string): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}
