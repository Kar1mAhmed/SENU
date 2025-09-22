// API endpoint for dashboard authentication
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { 
  CloudflareEnv,
  APIResponse, 
  DashboardAuth 
} from '@/lib/types';

export const runtime = 'edge';

console.log('🔐 Auth API loaded - ready to guard the dashboard like a digital bouncer!');

// Authentication duration (30 days in milliseconds)
const AUTH_DURATION = 30 * 24 * 60 * 60 * 1000;

// POST /api/auth - Authenticate user
export async function POST(request: NextRequest) {
  console.log('🔑 POST /api/auth - processing login attempt');

  // Ensure we always return JSON, even if there's an error
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      const response: APIResponse = {
        success: false,
        error: 'Invalid JSON in request body'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { username, password } = body as { username: string; password: string };

    console.log('👤 Login attempt for username:', username ? username.substring(0, 3) + '***' : 'undefined');

    if (!username || !password) {
      const response: APIResponse = {
        success: false,
        error: 'Username and password are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get credentials from environment with Cloudflare fallback
    let validUsername = 'admin';
    let validPassword = 'senu2024';
    
    try {
      // Try Cloudflare environment first
      const env = getRequestContext().env as CloudflareEnv;
      validUsername = env.DASHBOARD_USERNAME || 'admin';
      validPassword = env.DASHBOARD_PASSWORD || 'senu2024';
      console.log('🌐 Using Cloudflare environment credentials');
    } catch {
      // Fallback to process.env for development
      validUsername = process.env.DASHBOARD_USERNAME || 'admin';
      validPassword = process.env.DASHBOARD_PASSWORD || 'senu2024';
      console.log('🔧 Using development environment credentials');
    }

    // Validate credentials
    if (username !== validUsername || password !== validPassword) {
      console.log('❌ Invalid credentials provided');
      const response: APIResponse = {
        success: false,
        error: 'Invalid username or password'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Generate auth token (simple timestamp-based for this use case)
    const expiresAt = Date.now() + AUTH_DURATION;
    const authData: DashboardAuth = {
      isAuthenticated: true,
      expiresAt
    };

    const response: APIResponse<DashboardAuth> = {
      success: true,
      data: authData,
      message: 'Authentication successful'
    };

    console.log('🎉 Authentication successful, expires at:', new Date(expiresAt).toISOString());
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error during authentication:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/auth - Check authentication status
export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/auth - checking authentication status');

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      const response: APIResponse<DashboardAuth> = {
        success: true,
        data: {
          isAuthenticated: false,
          expiresAt: 0
        }
      };
      return NextResponse.json(response);
    }

    // Parse token (in our simple case, it's just the expiration timestamp)
    const expiresAt = parseInt(token);
    const isAuthenticated = !isNaN(expiresAt) && Date.now() < expiresAt;

    console.log('🕐 Token check:', {
      isAuthenticated,
      expiresAt: isAuthenticated ? new Date(expiresAt).toISOString() : 'expired'
    });

    const authData: DashboardAuth = {
      isAuthenticated,
      expiresAt: isAuthenticated ? expiresAt : 0
    };

    const response: APIResponse<DashboardAuth> = {
      success: true,
      data: authData
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    const response: APIResponse<DashboardAuth> = {
      success: false,
      data: {
        isAuthenticated: false,
        expiresAt: 0
      },
      error: error instanceof Error ? error.message : 'Failed to check authentication'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/auth - Logout (invalidate token)
export async function DELETE() {
  console.log('👋 DELETE /api/auth - processing logout');

  try {
    const authData: DashboardAuth = {
      isAuthenticated: false,
      expiresAt: 0
    };

    const response: APIResponse<DashboardAuth> = {
      success: true,
      data: authData,
      message: 'Logged out successfully'
    };

    console.log('✅ User logged out successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error during logout:', error);
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
