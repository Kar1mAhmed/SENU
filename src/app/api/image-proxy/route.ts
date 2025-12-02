import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Image proxy endpoint to handle CORS issues and provide fallback
 * Proxies external image URLs through the Next.js server with retry logic
 * 
 * Usage: /api/image-proxy?url=https://example.com/image.jpg
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate URL
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Only allow specific domains for security
    const allowedDomains = [
      'media.senu.studio',
      'pub-f4bb3e24fa054b69bbffdc5aec87af9c.r2.dev',
    ];

    const isAllowed = allowedDomains.some(domain => url.hostname.endsWith(domain));
    if (!isAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    console.log('📡 Proxying image:', imageUrl);

    // Fetch the image with retry logic
    let lastError: Error | null = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'image/avif,image/webp,image/png,image/jpeg,image/*',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Get the image data
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        console.log(`✅ Image proxied successfully (attempt ${attempt + 1}):`, imageUrl);

        // Return the image with caching headers
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Content-Length': imageBuffer.byteLength.toString(),
          },
        });
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, lastError.message);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          const delay = 500 * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed - return placeholder SVG
    console.error(`❌ All ${maxRetries} attempts failed for:`, imageUrl, lastError);

    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect fill="#1a1a1a" width="800" height="600"/>
  <circle cx="400" cy="280" r="60" fill="#333" stroke="#555" stroke-width="2"/>
  <line x1="370" y1="250" x2="430" y2="310" stroke="#555" stroke-width="3"/>
  <line x1="430" y1="250" x2="370" y2="310" stroke="#555" stroke-width="3"/>
  <text fill="#666" x="50%" y="400" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18">Image temporarily unavailable</text>
  <text fill="#444" x="50%" y="430" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14">Please check your connection</text>
</svg>`;

    return new NextResponse(placeholderSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('❌ Image proxy error:', error);

    const errorSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#1a1a1a" width="400" height="300"/><text fill="#666" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">Error loading image</text></svg>';

    return new NextResponse(errorSvg, {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
