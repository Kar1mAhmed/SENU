# Presigned URL Upload Setup Guide

## Overview

We've implemented **direct R2 upload using presigned URLs** to bypass Cloudflare Worker limits and support large video files (>500MB, up to 5GB).

## How It Works

### **Old Flow (Limited to 500MB):**
```
Browser → Worker API → R2
         ↑ (File passes through Worker - 500MB limit!)
```

### **New Flow (Up to 5GB):**
```
Browser → Worker (Get presigned URL) → Browser uploads directly to R2
                                              ↓
                                         Worker saves metadata
```

## What Changed

### ✅ **No Breaking Changes!**
- Database still stores **keys** (not URLs)
- All existing components work unchanged
- Same media serving (`/api/media/`)
- Progress tracking still works
- Automatic fallback for small files

### 🆕 **New Features:**
- **Large file support**: Up to 5GB per file
- **Faster uploads**: Direct to R2, no Worker proxy
- **Smart routing**: Automatically uses presigned URLs for files >100MB
- **30-minute timeout**: For very large files on slow connections

## Required Environment Variables

Add these to your Cloudflare dashboard or `wrangler.jsonc`:

```json
{
  "vars": {
    "R2_ACCESS_KEY_ID": "your-r2-access-key-id",
    "R2_SECRET_ACCESS_KEY": "your-r2-secret-access-key",
    "R2_ACCOUNT_ID": "your-cloudflare-account-id",
    "R2_BUCKET_NAME": "senu"
  }
}
```

## How to Get R2 Credentials

### 1. **Get Your Account ID**
- Go to Cloudflare Dashboard
- Click on any domain
- Look at the URL: `https://dash.cloudflare.com/{ACCOUNT_ID}/...`
- Or find it in the right sidebar under "Account ID"

### 2. **Create R2 API Token**
1. Go to **R2** in Cloudflare Dashboard
2. Click **Manage R2 API Tokens**
3. Click **Create API Token**
4. Set permissions:
   - **Object Read & Write**
   - **Bucket: senu** (or your bucket name)
5. Click **Create API Token**
6. Copy the **Access Key ID** and **Secret Access Key**
7. **Save them immediately** (you won't see the secret again!)

### 3. **Add to wrangler.jsonc**
```json
{
  "vars": {
    "R2_ACCESS_KEY_ID": "paste-access-key-id-here",
    "R2_SECRET_ACCESS_KEY": "paste-secret-access-key-here",
    "R2_ACCOUNT_ID": "paste-account-id-here",
    "R2_BUCKET_NAME": "senu"
  }
}
```

## Files Modified

### **New Files:**
- ✅ `/src/app/api/upload/presigned/route.ts` - Generates presigned URLs
- ✅ `/src/lib/media.ts` - Added `generatePresignedUploadUrl()` function

### **Updated Files:**
- ✅ `/src/lib/api-client.ts` - Added `uploadAPI.uploadWithPresignedUrl()`
- ✅ `/src/lib/types.ts` - Added R2 credential types to `CloudflareEnv`
- ✅ `/src/app/api/slides/route.ts` - Accepts both FormData and JSON (presigned flow)
- ✅ `/wrangler.jsonc` - Added R2 credential placeholders

### **Unchanged (Still Work!):**
- ✅ All frontend components (ProjectCard, ProjectHero, etc.)
- ✅ Database schema (still uses keys)
- ✅ Media serving (`/api/media/[...path]`)
- ✅ Data transformation (`keyToUrl()`)

## How It's Used

### **Automatic Smart Routing:**

The system automatically chooses the best upload method:

```typescript
// Small files (<100MB) - Traditional upload through Worker
slidesAPI.create({ mediaFile: smallFile }, onProgress);
// ↓ Uses FormData → Worker → R2

// Large files (>100MB) - Direct R2 upload
slidesAPI.create({ mediaFile: largeFile }, onProgress);
// ↓ Gets presigned URL → Uploads directly to R2 → Saves key
```

### **Manual Usage (Optional):**

```typescript
// Upload directly to R2 with presigned URL
const { key } = await uploadAPI.uploadWithPresignedUrl(
  file,
  'slides',
  (progress) => {
    console.log(`${progress.percentage}% uploaded`);
  }
);

// Then save the key to database
await slidesAPI.create({
  projectId: 'xxx',
  order: 1,
  type: 'horizontal',
  mediaKey: key // Use the uploaded key
});
```

## Upload Limits

| Method | Max File Size | Timeout | Use Case |
|--------|---------------|---------|----------|
| **Worker Upload** | 500 MB | 10 min | Small files, images |
| **Presigned URL** | 5 GB | 30 min | Large videos |
| **Multipart** | 5 TB | N/A | Future: Very large files |

## Testing

### 1. **Test Small File (<100MB)**
- Should use traditional Worker upload
- Check console: "📝 Creating slide with data"
- Should complete quickly

### 2. **Test Large File (>100MB)**
- Should use presigned URL
- Check console: "📦 Large file detected, using presigned URL upload"
- Check console: "🚀 Starting presigned URL upload"
- Should see progress updates
- Should complete within 30 minutes

### 3. **Test Progress Tracking**
- Upload any file
- Should see percentage updates in UI
- Should see console logs with progress

### 4. **Test Error Handling**
- Try uploading without credentials (should fail gracefully)
- Try uploading with bad internet (should show timeout error)
- Try uploading very large file (should show progress)

## Troubleshooting

### **Error: "R2 credentials not configured"**
**Cause**: Missing environment variables
**Fix**: Add R2 credentials to `wrangler.jsonc` and redeploy

### **Error: "SignatureDoesNotMatch"**
**Cause**: Incorrect R2 credentials or account ID
**Fix**: 
1. Verify credentials are correct
2. Check account ID matches your Cloudflare account
3. Ensure bucket name is correct

### **Upload Timeout After 30 Minutes**
**Cause**: File too large for connection speed
**Fix**:
1. Compress video before upload
2. Use faster internet connection
3. Consider multipart upload (future enhancement)

### **Upload Stuck at 0%**
**Cause**: Presigned URL generation failed
**Fix**:
1. Check browser console for errors
2. Verify R2 credentials are set
3. Check Worker logs in Cloudflare dashboard

## Security Notes

### **Presigned URLs are Secure:**
- ✅ Expire after 1 hour
- ✅ Signed with your secret key
- ✅ Can only upload to specific key
- ✅ Cannot be reused for different files
- ✅ Cannot access other files in bucket

### **Best Practices:**
- ✅ Never commit credentials to git
- ✅ Use environment variables only
- ✅ Rotate API tokens periodically
- ✅ Use separate tokens for dev/prod
- ✅ Monitor R2 usage in dashboard

## Next Steps (Optional Enhancements)

### **1. Multipart Upload (For files >5GB)**
- Split files into chunks
- Upload chunks in parallel
- Assemble on R2 side
- Support files up to 5TB

### **2. Resume Failed Uploads**
- Save upload state
- Resume from last chunk
- Better for unreliable connections

### **3. Client-Side Compression**
- Compress videos before upload
- Reduce upload time
- Save bandwidth

### **4. Upload Queue**
- Queue multiple uploads
- Upload in background
- Better UX for multiple files

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Cloudflare Worker logs
3. Verify R2 credentials are correct
4. Test with small file first
5. Check R2 bucket exists and is accessible

## Summary

✅ **Supports files up to 5GB** (vs 500MB before)
✅ **Faster uploads** (direct to R2)
✅ **No breaking changes** (all existing code works)
✅ **Automatic routing** (smart file size detection)
✅ **Progress tracking** (real-time feedback)
✅ **Better error messages** (timeout, network issues)

Your upload issues should now be resolved! 🚀
