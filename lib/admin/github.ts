/**
 * GitHub API integration for admin dashboard
 * Handles file operations and commits
 */

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  content: string;
}

interface CommitFileParams {
  path: string;
  content: string;
  message: string;
  sha?: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Get GitHub configuration from environment
 */
function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;

  if (!token || !repo || !email || !name) {
    throw new Error('Missing required GitHub configuration');
  }

  return { token, repo, branch, email, name };
}

/**
 * Get file content from GitHub
 */
export async function getFileFromGitHub(filePath: string): Promise<GitHubFileContent> {
  const { token, repo, branch } = getGitHubConfig();
  
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${filePath}?ref=${branch}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    name: data.name,
    path: data.path,
    sha: data.sha,
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
  };
}

/**
 * Update file on GitHub
 */
export async function updateFileOnGitHub(params: CommitFileParams): Promise<void> {
  const { token, repo, branch, email, name } = getGitHubConfig();
  
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${params.path}`;
  
  // Encode content to base64
  const contentBase64 = Buffer.from(params.content, 'utf-8').toString('base64');
  
  const body: any = {
    message: params.message,
    content: contentBase64,
    branch,
    committer: {
      name,
      email,
    },
    author: {
      name,
      email,
    },
  };

  // If SHA is provided, it's an update operation
  if (params.sha) {
    body.sha = params.sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update file: ${error.message || response.statusText}`);
  }
}

/**
 * Get translation file
 */
export async function getTranslationFile(locale: string): Promise<any> {
  const filePath = `lib/i18n/translations/${locale}.json`;
  const file = await getFileFromGitHub(filePath);
  return {
    content: JSON.parse(file.content),
    sha: file.sha,
    path: file.path,
  };
}

/**
 * Update translation file
 */
export async function updateTranslationFile(
  locale: string,
  content: any,
  sha: string
): Promise<void> {
  const filePath = `lib/i18n/translations/${locale}.json`;
  const jsonContent = JSON.stringify(content, null, 2);
  
  await updateFileOnGitHub({
    path: filePath,
    content: jsonContent,
    message: `Update ${locale} translations via admin dashboard`,
    sha,
  });
}

/**
 * Get all translation files
 */
export async function getAllTranslations(): Promise<Record<string, any>> {
  const locales = ['en', 'es', 'fr'];
  const translations: Record<string, any> = {};

  for (const locale of locales) {
    try {
      const data = await getTranslationFile(locale);
      translations[locale] = data;
    } catch (error) {
      console.error(`Failed to fetch ${locale} translations:`, error);
    }
  }

  return translations;
}

/**
 * Verify GitHub token
 */
export async function verifyGitHubToken(): Promise<boolean> {
  try {
    const { token, repo } = getGitHubConfig();
    
    const url = `${GITHUB_API_BASE}/repos/${repo}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

