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
        "/carouselle-channels/abc-tv-logo-Copy.webp",
        "/carouselle-channels/ae-tv-logo-1.png",
        "/carouselle-channels/AMC-tv-logo.webp",
        "/carouselle-channels/cbs-tv-logo.png",
        "/carouselle-channels/discovery-channel-tv-logo.png",
        "/carouselle-channels/fox-tv-logo.png",
        "/carouselle-channels/hbo-tv-logo.webp",
        "/carouselle-channels/history-tv-logo.png",
        "/carouselle-channels/national-geographic-tv-logo.png",
        "/carouselle-channels/nbc-tv-logo.png",
        "/carouselle-channels/tnt-tv-logo.png",
        "/carouselle-channels/usa-network-logo.webp",
      ],
      streaming: [
        "/carouselle-streaming/580b57fcd9996e24bc43c529-300x169-min-1.png",
        "/carouselle-streaming/Bein_sport_logo-1024x595-1-min-300x174-2.png",
        "/carouselle-streaming/canal-logo-png-transparent-385x385-1-e1677705689705-min-300x149-2.webp",
        "/carouselle-streaming/FOX_Sports_logo.svg-1024x606-min-300x178-2.png",
        "/carouselle-streaming/HBO-Max-Logo-768x432-2-min-300x169-2.png",
        "/carouselle-streaming/pngegg-2-e1677705730772-min-300x155-2.png",
        "/carouselle-streaming/sky-sports-logo-png-8-768x432-1-min-300x169-2.png",
      ],
      content: [
        "/carouselle-shows/1876.webp",
        "/carouselle-shows/3f8e093cd2b2aa6993c1d936a154831c-1.webp",
        "/carouselle-shows/asteroid-city-movie-poster-7030.webp",
        "/carouselle-shows/bob-marley-one-love-movie-poster.webp",
        "/carouselle-shows/boxing-4679822_640-1.webp",
        "/carouselle-shows/dune-part-two-movie-poster.webp",
        "/carouselle-shows/FJdfCjyXsAEBxsP.jpg",
        "/carouselle-shows/furiosa-a-mad-max-saga-movie-poster.webp",
        "/carouselle-shows/gettyimages-2168236843-612x612-1.webp",
        "/carouselle-shows/gettyimages-2176226053-612x612-1.webp",
        "/carouselle-shows/ghostbusters-frozen-empire-movie-poster.webp",
        "/carouselle-shows/godzilla-x-kong-the-new-empire-movie-poster.webp",
        "/carouselle-shows/guardians-of-the-galaxy-vol-3-movie-poster.webp",
        "/carouselle-shows/gygy-1.webp",
        "/carouselle-shows/heuhe.webp",
        "/carouselle-shows/hjh-1.webp",
        "/carouselle-shows/jjf-1.webp",
        "/carouselle-shows/jkjnhbg.webp",
        "/carouselle-shows/kingdom-of-the-planet-of-the-apes-malaysian-movie-poster.webp",
        "/carouselle-shows/kung-fu-panda-4-chinese-movie-poster.webp",
        "/carouselle-shows/llk-1.webp",
        "/carouselle-shows/los-angeles-lakers-v-milwaukee-bucks-gary-dineen-1.webp",
        "/carouselle-shows/luciferver3xlgjpg-fe465d.jpg",
        "/carouselle-shows/M7SUK85sKjaStg4TKhlAVyGlz3-scaled-1.jpg",
        "/carouselle-shows/mean-girls-movie-poster.webp",
        "/carouselle-shows/motor-sports-excitement-formula-1-racing-car-high-speed-vertical-mobile-wallpaper_795881-32675.webp",
        "/carouselle-shows/MV5BM2EwMmRhMmUtMzBmMS00ZDQ3LTg4OGEtNjlkODk3ZTMxMmJlXkEyXkFqcGdeQXVyMjM5ODk1NDU@._V1_.jpg",
        "/carouselle-shows/MV5BNWYwNzhhNzMtMWM2Yi00NzdlLTgxNmUtYWI2YTdiNmFmNzQwXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
        "/carouselle-shows/no-hard-feelings-movie-poster.webp",
        "/carouselle-shows/p12022_p_v8_aa.jpg",
        "/carouselle-shows/pathaan-movie-poster.webp",
        "/carouselle-shows/Reacher-S2-Key-Art-Cropped-1.webp",
        "/carouselle-shows/scream-vi-movie-poster.webp",
        "/carouselle-shows/the-flash-movie-poster.webp",
        "/carouselle-shows/the-marvels-movie-poster.webp",
        "/carouselle-shows/the-nun-ii-movie-poster.webp",
        "/carouselle-shows/the-super-mario-bros-movie-movie-poster.webp",
        "/carouselle-shows/transformers-rise-of-the-beasts-movie-poster.webp",
        "/carouselle-shows/wonka-movie-poster.webp",
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

