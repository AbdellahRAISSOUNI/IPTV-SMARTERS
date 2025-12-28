import { NextRequest, NextResponse } from 'next/server';

// API routes cannot be statically exported
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO; // Format: owner/repo
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { error: 'GitHub configuration missing' },
        { status: 500 }
      );
    }

    // Read file from GitHub
    const url = `https://api.github.com/repos/${githubRepo}/contents/${path}?ref=${githubBranch}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `GitHub API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const sha = data.sha; // Needed for updating the file

    return NextResponse.json({
      content,
      sha,
      path: data.path,
    });
  } catch (error: any) {
    console.error('Read file error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

