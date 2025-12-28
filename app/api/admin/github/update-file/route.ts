import { NextRequest, NextResponse } from 'next/server';

// API routes cannot be statically exported
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { path, content, sha, message } = await request.json();

    if (!path || !content || !sha) {
      return NextResponse.json(
        { error: 'Path, content, and sha are required' },
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
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';
    const githubEmail = process.env.GITHUB_EMAIL || 'admin@example.com';
    const githubName = process.env.GITHUB_NAME || 'Admin';

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { error: 'GitHub configuration missing' },
        { status: 500 }
      );
    }

    // Encode content to base64
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');

    // Update file on GitHub
    const url = `https://api.github.com/repos/${githubRepo}/contents/${path}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message || `Update ${path}`,
        content: encodedContent,
        sha: sha,
        branch: githubBranch,
        committer: {
          name: githubName,
          email: githubEmail,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `GitHub API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      commit: data.commit,
      content: data.content,
    });
  } catch (error: any) {
    console.error('Update file error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

