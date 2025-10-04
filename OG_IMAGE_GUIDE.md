# Open Graph (OG) Image Guide

## What is an OG Image?

An **Open Graph (OG) Image** is the preview image that appears when you share your website link on social media platforms like:
- **Facebook** - Shows in news feed when link is shared
- **LinkedIn** - Appears in posts and articles
- **Twitter** - Displays as Twitter Card image
- **WhatsApp** - Preview when sending links
- **Slack** - Link previews in conversations
- **Discord** - Embedded link previews

### Example:
When someone shares `https://senu.studio` on Facebook, instead of showing a blank preview, it shows:
- Your logo
- Your tagline "Creative Design Studio"
- Beautiful branded background
- Makes the link 10x more clickable!

---

## Technical Specifications

### Required Dimensions:
- **Width:** 1200px
- **Height:** 630px
- **Aspect Ratio:** 1.91:1
- **Format:** JPG or PNG (JPG recommended for smaller file size)
- **File Size:** Under 1MB (ideally under 300KB)
- **Location:** `public/images/og-image.jpg`

### Safe Zone:
Some platforms crop the image differently:
- **Facebook/LinkedIn:** Full 1200x630
- **Twitter:** Crops to 2:1 ratio
- **WhatsApp:** May crop edges

**Pro Tip:** Keep important content (logo, text) in the center 1000x500px area.

---

## Design Guidelines

### What to Include:
1. **Your Logo** - Large and centered
2. **Tagline/Slogan** - "Creative Design Studio" or "Video Editing & Motion Graphics"
3. **Brand Colors** - Use your website's color scheme
4. **Visual Elements** - Abstract shapes, gradients, or sample work
5. **Website URL** (optional) - Small text at bottom

### What to Avoid:
- ❌ Too much text (hard to read on mobile)
- ❌ Small fonts (minimum 48px for readability)
- ❌ Important content near edges (may get cropped)
- ❌ Low contrast (hard to see on different backgrounds)
- ❌ Complex designs (keep it simple and bold)

---

## Quick Creation Methods

### Method 1: Canva (Easiest - 5 minutes)
1. Go to [Canva.com](https://canva.com)
2. Search for "Open Graph Image" template
3. Or create custom size: 1200 x 630 px
4. Add your logo and text
5. Download as JPG
6. Save to `public/images/og-image.jpg`

**Canva Template Ideas:**
- Search "Social Media Banner"
- Search "Facebook Cover"
- Use gradient backgrounds
- Add your logo + tagline

### Method 2: Figma (Professional - 15 minutes)
1. Create new frame: 1200 x 630 px
2. Design with your brand assets
3. Export as JPG (quality: 80%)
4. Optimize with TinyPNG.com
5. Save to `public/images/og-image.jpg`

### Method 3: Photoshop (Advanced)
1. New document: 1200 x 630 px, 72 DPI
2. Design your OG image
3. Save for Web: JPG, quality 80%
4. Save to `public/images/og-image.jpg`

### Method 4: Online Tools (Quick - 3 minutes)
- [OG Image Generator](https://og-image.vercel.app/)
- [Social Sizes](https://socialsizes.io/)
- [Placid.app](https://placid.app/)

---

## Design Templates for SENU

### Template 1: Minimal & Professional
```
Background: Dark gradient (black to dark blue)
Center: SENU logo (large, white)
Below logo: "Creative Design Studio"
Bottom: "Video Editing • Motion Graphics • 3D Animation"
```

### Template 2: Showcase Style
```
Background: Collage of your best work (blurred)
Overlay: Semi-transparent dark layer
Center: SENU logo + tagline
Style: Modern, portfolio-focused
```

### Template 3: Bold & Colorful
```
Background: Your brand colors (blue, orange, red gradient)
Center: SENU logo (white)
Text: "Transforming Ideas into Visual Masterpieces"
Style: Energetic, creative
```

---

## Testing Your OG Image

### Before Publishing:
1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Paste your URL: `https://senu.studio`
   - Click "Scrape Again" to refresh cache
   - Check if image appears correctly

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Enter your URL
   - Preview how it looks on Twitter

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Check LinkedIn preview

4. **Social Share Preview**
   - URL: https://socialsharepreview.com/
   - See previews for all platforms at once

### Common Issues:
- **Image not showing?** Clear cache on social platform
- **Old image showing?** Use Facebook Debugger to scrape again
- **Image blurry?** Increase resolution or reduce compression
- **Wrong crop?** Check safe zone (center 1000x500px)

---

## Current Implementation

Your OG image is configured in:
- **File:** `src/lib/seo-config.ts`
- **Path:** `/images/og-image.jpg`
- **Full URL:** `https://senu.studio/images/og-image.jpg`

### To Update:
1. Create your OG image (1200x630px)
2. Save as `og-image.jpg`
3. Place in `public/images/` folder
4. Deploy your site
5. Test with Facebook Debugger

---

## Dynamic OG Images (Advanced)

Want different OG images for each project? You can:

### Option 1: Use Project Thumbnails
Already implemented! Each project uses its thumbnail as OG image.

### Option 2: Generate Dynamic OG Images
Use services like:
- **Vercel OG Image Generation** (free)
- **Cloudinary** (dynamic transformations)
- **Imgix** (real-time image processing)

Example: Generate OG image with project name overlaid on thumbnail.

---

## Best Practices

### Do's:
✅ Use high-quality images
✅ Keep text large and readable
✅ Test on multiple platforms
✅ Update seasonally or for campaigns
✅ Use consistent branding
✅ Optimize file size (under 300KB)

### Don'ts:
❌ Don't use copyrighted images
❌ Don't make text too small
❌ Don't forget to test
❌ Don't use low-resolution images
❌ Don't ignore mobile preview

---

## Examples from Top Creative Studios

### Good Examples:
- **Dribbble:** Logo + "Discover the world's top designers"
- **Behance:** Logo + featured artwork
- **Awwwards:** Bold typography + gradient
- **Unsplash:** Beautiful photo + logo

### What Makes Them Work:
1. **Clear branding** - Logo is prominent
2. **Simple message** - One clear tagline
3. **Visual appeal** - Eye-catching design
4. **Readable** - Large, bold text
5. **Professional** - High-quality graphics

---

## Quick Start Checklist

- [ ] Create 1200x630px image
- [ ] Add SENU logo (large, centered)
- [ ] Add tagline: "Creative Design Studio"
- [ ] Use brand colors (blue, orange, etc.)
- [ ] Keep important content in center 1000x500px
- [ ] Export as JPG (under 300KB)
- [ ] Save to `public/images/og-image.jpg`
- [ ] Deploy site
- [ ] Test with Facebook Debugger
- [ ] Share on social media to verify

---

## Need Help?

### Free Resources:
- [Canva OG Image Templates](https://www.canva.com/templates/s/open-graph/)
- [Unsplash](https://unsplash.com/) - Free stock photos
- [TinyPNG](https://tinypng.com/) - Image compression
- [Remove.bg](https://remove.bg/) - Background removal

### Inspiration:
- Search "OG image design" on Dribbble
- Check competitors' OG images
- Look at top creative studios

---

**Remember:** Your OG image is often the first impression people get of your brand on social media. Make it count! 🎨
