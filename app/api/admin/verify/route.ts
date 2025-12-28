import { NextRequest, NextResponse } from 'next/server';

// API routes cannot be statically exported
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // In production, verify token properly
    // For now, just check if token exists
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

