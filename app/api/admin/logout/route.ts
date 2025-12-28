import { NextResponse } from 'next/server';

// API routes cannot be statically exported
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}

