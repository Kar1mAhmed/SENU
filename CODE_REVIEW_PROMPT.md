# Code Review Prompt: R2 CDN Direct Access Verification

## Context

I have successfully set up direct CDN access to my Cloudflare R2 bucket for serving media files. The CDN domain is `https://media.senu.studio` and I've confirmed it's working with test URLs like:
```
https://media.senu.studio/slides/1759332526778-7uyt57-2.webp
```

I need you to perform a comprehensive code review to ensure **ALL** media serving points in my codebase are using the direct CDN access instead of the Worker proxy.

---

## Your Task

Review my entire codebase and verify that all media files (images, videos, logos, thumbnails) are being served through the CDN domain, not through the Worker API proxy.

---

## What to Check

### **1. Primary Media Utility Function**

**Location:** `/src/lib/media.ts`

**Function to review:** `keyToUrl()`

**Expected behavior:**
- Should check for `process.env.NEXT_PUBLIC_R2_DOMAIN`
- If present, return: `https://media.senu.studio/{key}`
- If not present (dev mode), fallback to: `/api/media/{key}`
- Should handle null/undefined keys gracefully

**Verify:**
- [ ] Function correctly reads environment variable
- [ ] Returns full CDN URL when env var is set
- [ ] Falls back to Worker proxy for local dev
- [ ] No hardcoded URLs or domains
- [ ] Proper null/undefined handling

---

### **2. Data Transformation Layer**

**Location:** `/src/lib/data-transform.ts`

**Function to review:** `transformProjectForFrontend()`

**What it does:**
- Converts database keys to frontend URLs
- Transforms project data including thumbnails, videos, client logos

**Check these transformations:**
- [ ] `thumbnailKey` → `thumbnailUrl` uses `keyToUrl()`
- [ ] `clientLogoKey` → `clientLogo` uses `keyToUrl()`
- [ ] Slide `mediaKey` → `videoUrl` uses `keyToUrl()`
- [ ] First slide media properly transformed
- [ ] No direct `/api/media/` strings

**Expected pattern:**
```typescript
thumbnailUrl: keyToUrl(dbProject.thumbnailKey) || ''
clientLogo: keyToUrl(dbProject.clientLogoKey) || undefined
videoUrl: keyToUrl(firstSlide.mediaKey) || undefined
```

---

### **3. Video Components**

**Locations to check:**
- `/src/components/main/VideoPlayer/index.tsx`
- `/src/components/portfolio/ProjectSlides/HorizontalSlides.tsx`
- `/src/components/portfolio/ProjectSlides/VerticalSlides.tsx`

**What to verify:**
- [ ] All video URLs come from `keyToUrl(slide.mediaKey)`
- [ ] No hardcoded `/api/media/` paths
- [ ] Poster images (if any) also use `keyToUrl()`
- [ ] No direct R2 URLs or Worker proxy URLs

**Expected pattern:**
```typescript
<VideoPlayer
  videoUrl={keyToUrl(slide.mediaKey) || ''}
  posterUrl={posterUrl || generatedPoster || undefined}
/>
```

---

### **4. Image Components**

**Locations to check:**
- `/src/components/portfolio/ProjectSlides/ImageSlides.tsx`
- `/src/components/main/ProjectCard/index.tsx`
- `/src/components/main/ProjectHero/index.tsx`
- `/src/components/landing/ProjectHighlight/index.tsx`

**What to verify:**
- [ ] All image `src` attributes use `keyToUrl()`
- [ ] Preloading logic (if any) uses `keyToUrl()`
- [ ] Next.js `<Image>` components use transformed URLs
- [ ] No hardcoded media paths

**Expected pattern:**
```typescript
<Image
  src={keyToUrl(slide.mediaKey) || ''}
  alt="..."
/>

// Or for preloading
const img = new window.Image();
img.src = keyToUrl(slide.mediaKey) || '';
```

---

### **5. Project Display Components**

**Locations to check:**
- `/src/app/portfolio/page.tsx`
- `/src/app/portfolio/[projectName]/page.tsx`
- Any component displaying project thumbnails or media

**What to verify:**
- [ ] Projects use `thumbnailUrl` from transformed data
- [ ] Client logos use `clientLogo` from transformed data
- [ ] Video URLs use `videoUrl` from transformed data
- [ ] No direct database key usage without transformation

**Expected pattern:**
```typescript
// Data should already be transformed
<Image src={project.thumbnailUrl} />
<Image src={project.clientLogo} />
<VideoPlayer videoUrl={project.videoUrl} />
```

---

### **6. API Routes (Should NOT Serve Media)**

**Locations to check:**
- `/src/app/api/media/[...path]/route.ts` - Should still exist but only for fallback
- Any other API routes that might serve media

**What to verify:**
- [ ] Media API route exists but is only used as fallback
- [ ] No other API routes serving media files
- [ ] Upload routes store keys, not URLs
- [ ] No routes generating `/api/media/` URLs

**Expected behavior:**
- Media API route can stay for local development fallback
- Production should bypass it entirely via CDN

---

### **7. Environment Configuration**

**Location:** `/wrangler.jsonc`

**What to verify:**
- [ ] `NEXT_PUBLIC_R2_DOMAIN` is set to `"https://media.senu.studio"`
- [ ] Variable is in the `vars` section
- [ ] No typos in the domain name
- [ ] Variable name matches what's used in code

**Expected:**
```jsonc
"vars": {
  "NEXT_PUBLIC_R2_DOMAIN": "https://media.senu.studio"
}
```

---

### **8. Upload Logic (Should Store Keys, Not URLs)**

**Locations to check:**
- `/src/app/api/projects/route.ts`
- `/src/app/api/slides/route.ts`
- Any upload-related API routes

**What to verify:**
- [ ] Uploads store **keys** in database (e.g., `slides/123-abc-video.mp4`)
- [ ] NOT storing full URLs (e.g., `https://media.senu.studio/...`)
- [ ] `uploadMedia()` function returns keys
- [ ] Database schema uses `_key` fields, not `_url` fields

**Expected pattern:**
```typescript
const key = await uploadMedia(r2, file, 'slides');
// Store key in database: "slides/123-abc-video.mp4"
// NOT: "https://media.senu.studio/slides/123-abc-video.mp4"
```

---

### **9. Database Schema**

**Location:** `/migrations/*.sql`

**What to verify:**
- [ ] Tables use `thumbnail_key`, `client_logo_key`, `media_key` columns
- [ ] NOT using `thumbnail_url`, `client_logo_url`, `media_url` columns
- [ ] Keys are stored as strings (e.g., `slides/file.mp4`)

---

### **10. Type Definitions**

**Location:** `/src/lib/types.ts`

**What to verify:**
- [ ] Database types use `thumbnailKey`, `clientLogoKey`, `mediaKey`
- [ ] Frontend types use `thumbnailUrl`, `clientLogo`, `videoUrl`
- [ ] Clear separation between database (keys) and frontend (URLs)

**Expected pattern:**
```typescript
// Database types
interface DBProject {
  thumbnailKey: string;
  clientLogoKey: string | null;
}

// Frontend types
interface Project {
  thumbnailUrl: string;
  clientLogo?: string;
}
```

---

## Common Issues to Look For

### **Anti-patterns (Should NOT exist):**

❌ **Hardcoded Worker proxy URLs:**
```typescript
src="/api/media/slides/video.mp4"  // BAD
```

❌ **Direct R2 URLs:**
```typescript
src="https://pub-xxx.r2.dev/slides/video.mp4"  // BAD
```

❌ **Storing URLs in database:**
```typescript
thumbnailUrl: "https://media.senu.studio/..."  // BAD - should store key
```

❌ **Not using keyToUrl():**
```typescript
src={slide.mediaKey}  // BAD - missing transformation
```

❌ **Conditional logic without env check:**
```typescript
const url = isDev ? `/api/media/${key}` : `https://media.senu.studio/${key}`  // BAD
```

### **Correct patterns (Should exist):**

✅ **Using keyToUrl():**
```typescript
src={keyToUrl(slide.mediaKey) || ''}  // GOOD
```

✅ **Environment-based switching:**
```typescript
const domain = process.env.NEXT_PUBLIC_R2_DOMAIN;
if (domain) return `${domain}/${key}`;  // GOOD
```

✅ **Storing keys in database:**
```typescript
thumbnailKey: "slides/123-abc-video.mp4"  // GOOD
```

✅ **Transformed URLs in frontend:**
```typescript
thumbnailUrl: keyToUrl(dbProject.thumbnailKey)  // GOOD
```

---

## Search Patterns to Use

Use these grep/search patterns to find potential issues:

### **1. Find hardcoded API paths:**
```bash
grep -r "/api/media/" src/
grep -r "api/media" src/
```

### **2. Find direct R2 URLs:**
```bash
grep -r "r2.dev" src/
grep -r "r2.cloudflarestorage.com" src/
```

### **3. Find media key usage without transformation:**
```bash
grep -r "mediaKey" src/ | grep -v "keyToUrl"
grep -r "thumbnailKey" src/ | grep -v "keyToUrl"
```

### **4. Find URL storage in database:**
```bash
grep -r "_url" migrations/
grep -r "Url:" src/lib/types.ts
```

---

## Expected Output

Provide a comprehensive report with:

### **1. Summary**
- Total files reviewed
- Issues found (if any)
- Compliance percentage

### **2. Detailed Findings**

For each file reviewed, report:
- ✅ **PASS:** File correctly uses CDN access
- ⚠️ **WARNING:** Potential issue found
- ❌ **FAIL:** Definite issue requiring fix

### **3. Issues Found**

For each issue:
- **File:** `/path/to/file.tsx`
- **Line:** 42
- **Issue:** Hardcoded `/api/media/` path
- **Current code:** `src="/api/media/slides/video.mp4"`
- **Recommended fix:** `src={keyToUrl('slides/video.mp4')}`
- **Severity:** High/Medium/Low

### **4. Recommendations**

List any:
- Code improvements
- Potential optimizations
- Best practices to implement
- Documentation updates needed

---

## Success Criteria

The codebase passes review if:

- ✅ All media URLs use `keyToUrl()` function
- ✅ No hardcoded `/api/media/` paths in components
- ✅ No direct R2 URLs in code
- ✅ Database stores keys, not URLs
- ✅ Environment variable properly configured
- ✅ Data transformation layer correctly converts keys to URLs
- ✅ Upload logic stores keys only
- ✅ All video/image components use transformed URLs

---

## Additional Context

### **Project Structure:**
- **Framework:** Next.js with TypeScript
- **Deployment:** Cloudflare Pages/Workers
- **Storage:** Cloudflare R2
- **CDN Domain:** `https://media.senu.studio`
- **Fallback:** `/api/media/` for local development

### **Key Files:**
- Media utility: `/src/lib/media.ts`
- Data transform: `/src/lib/data-transform.ts`
- Types: `/src/lib/types.ts`
- Config: `/wrangler.jsonc`

### **Media Types Served:**
- Videos: `.mp4`, `.webm`, `.mov`
- Images: `.jpg`, `.png`, `.webp`, `.gif`
- Logos: Client logos in various formats

---

## Example Review Format

```markdown
# R2 CDN Direct Access Code Review

## Summary
- Files Reviewed: 25
- Issues Found: 3
- Compliance: 88%

## Detailed Findings

### ✅ PASS: /src/lib/media.ts
- Correctly implements keyToUrl() with env check
- Proper fallback to Worker proxy
- No issues found

### ⚠️ WARNING: /src/components/custom/Gallery.tsx
- Line 42: Uses slide.mediaKey directly without keyToUrl()
- Severity: High
- Recommendation: Change to keyToUrl(slide.mediaKey)

### ✅ PASS: /src/app/api/projects/route.ts
- Correctly stores keys in database
- No URL storage detected
- No issues found

## Issues Summary

1. **File:** /src/components/custom/Gallery.tsx
   - **Line:** 42
   - **Issue:** Direct key usage
   - **Fix:** Use keyToUrl()

[... continue for all issues ...]

## Recommendations
1. Add TypeScript strict mode to catch key/URL confusion
2. Create a custom ESLint rule to prevent /api/media/ usage
3. Add unit tests for keyToUrl() function
```

---

## Start Your Review

Please review my codebase following this prompt and provide a detailed report of your findings.
