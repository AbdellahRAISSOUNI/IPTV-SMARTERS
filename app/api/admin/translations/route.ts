import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin/auth';
import { getAllTranslations, updateTranslationFile } from '@/lib/admin/github';

// GET - Fetch all translations
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

    const translations = await getAllTranslations();
    return NextResponse.json(translations);
  } catch (error: any) {
    console.error('Fetch translations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST - Update translations
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

    if (!locale || !content || !sha) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update translation file on GitHub
    await updateTranslationFile(locale, content, sha);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update translations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update translations' },
      { status: 500 }
    );
  }
}

