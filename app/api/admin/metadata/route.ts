import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin/auth';
import { getAllMetadata, updateMetadataFile } from '@/lib/admin/metadata';

// GET - Fetch all metadata
export async function GET() {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const metadata = await getAllMetadata();
    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Fetch metadata error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}

// POST - Update metadata
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { locale, content, sha } = await request.json();

    if (!locale || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update metadata file on GitHub
    await updateMetadataFile(locale, content, sha || '');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update metadata error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update metadata' },
      { status: 500 }
    );
  }
}
