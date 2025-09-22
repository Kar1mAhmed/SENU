// Simple test route to verify API is working
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    console.log('🧪 Test API route called');

    return NextResponse.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
}

export async function POST(request: NextRequest) {
    console.log('🧪 Test POST API route called');

    try {
        const body = await request.json();
        console.log('📝 Received body:', body);

        return NextResponse.json({
            success: true,
            message: 'POST API is working!',
            received: body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Test POST error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to parse JSON'
        }, { status: 400 });
    }
}
