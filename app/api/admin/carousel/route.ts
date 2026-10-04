import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin/auth';
import { getFileFromGitHub, updateFileOnGitHub } from '@/lib/admin/github';

// GET - Fetch carousel config
export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return hardcoded carousel data
    // In production, this would come from a config file
    const carouselData = {
      channels: [
        "/carousel-categories/01-sports.webp",
        "/carousel-categories/02-news.webp",
        "/carousel-categories/03-movies.webp",
        "/carousel-categories/04-series.webp",
        "/carousel-categories/05-kids.webp",
        "/carousel-categories/06-documentary.webp",
        "/carousel-categories/07-music.webp",
        "/carousel-categories/08-lifestyle.webp",
        "/carousel-categories/09-comedy.webp",
        "/carousel-categories/10-drama.webp",
        "/carousel-categories/11-cooking.webp",
        "/carousel-categories/12-travel.webp",
      ],
      streaming: [
        "/carousel-features/01-live-events.webp",
        "/carousel-features/02-catch-up-tv.webp",
        "/carousel-features/03-hd-and-4k.webp",
        "/carousel-features/04-replay.webp",
        "/carousel-features/05-multi-screen.webp",
        "/carousel-features/06-on-demand.webp",
      ],
      content: [
        "/carousel-content/01-movies.webp",
        "/carousel-content/02-series.webp",
        "/carousel-content/03-live-sports.webp",
        "/carousel-content/04-kids.webp",
        "/carousel-content/05-documentaries.webp",
        "/carousel-content/06-comedy.webp",
        "/carousel-content/07-drama.webp",
        "/carousel-content/08-action.webp",
        "/carousel-content/09-music.webp",
        "/carousel-content/10-news.webp",
        "/carousel-content/11-family.webp",
        "/carousel-content/12-adventure.webp",
        "/carousel-content/13-reality.webp",
        "/carousel-content/14-cooking.webp",
        "/carousel-content/15-travel.webp",
        "/carousel-content/16-lifestyle.webp",
      ],
    };

    return NextResponse.json(carouselData);
  } catch (error: any) {
    console.error('Fetch carousel error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch carousel data' },
      { status: 500 }
    );
  }
}

// POST - Update carousel config
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, images } = await request.json();

    if (!type || !images) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to a config file in GitHub
    // For now, just return success
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update carousel error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update carousel' },
      { status: 500 }
    );
  }
}

