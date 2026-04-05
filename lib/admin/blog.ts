import { Octokit } from "@octokit/rest";

/** GitHub is only required when calling blog persistence APIs — not when importing types/helpers. */
function getGithubBlogContext() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  const owner = repoFull?.split("/")[0];
  const repo = repoFull?.split("/")[1];
  const branch = process.env.GITHUB_BRANCH || "main";
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;
  if (!token || !owner || !repo || !email || !name) {
    throw new Error("Missing GitHub environment variables for blog system.");
  }
  return {
    octokit: new Octokit({ auth: token }),
    owner,
    repo,
    branch,
    email,
    name,
  };
}

export const BLOG_CONTENT_LOCALES = ["en", "es", "fr"] as const;
export type BlogContentLocale = (typeof BLOG_CONTENT_LOCALES)[number];

/** Ensures every supported locale key exists on stored `htmlBody` (default empty string). */
export function normalizeHtmlBody(
  htmlBody?: Record<string, string> | null
): Record<BlogContentLocale, string> {
  if (!htmlBody || typeof htmlBody !== "object") {
    return { en: "", es: "", fr: "" };
  }
  return {
    en: typeof htmlBody.en === "string" ? htmlBody.en : "",
    es: typeof htmlBody.es === "string" ? htmlBody.es : "",
    fr: typeof htmlBody.fr === "string" ? htmlBody.fr : "",
  };
}

function normalizeBlogPost(blog: BlogPost): BlogPost {
  return {
    ...blog,
    htmlBody: normalizeHtmlBody(blog.htmlBody),
  };
}

export interface BlogBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "list";
  content: string | Record<string, string>; // Support both old format (string) and new format (multi-language)
  level?: number; // For headings (1-6)
  imageUrl?: string;
  imageAlt?: string | Record<string, string>; // Support multi-language alt text
  imageWidth?: "full" | "half" | "third" | "quarter";
  imageAlign?: "left" | "center" | "right";
  listItems?: string[] | Record<string, string[]>; // Support multi-language lists
  style?: {
    textAlign?: "left" | "center" | "right";
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string | Record<string, string>; // Support both old format (string) and new format (Record<string, string>)
  title: Record<string, string>; // { en: "Title", es: "Título", fr: "Titre" }
  excerpt: Record<string, string>;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  locale: string; // Primary language
  translations?: string[]; // Array of locale codes that have translations
  /** Per-locale rich HTML; when non-empty for the resolved locale, public pages prefer this over `blocks`. */
  htmlBody?: Record<string, string>;
  blocks: BlogBlock[];
  meta?: {
    description?: Record<string, string>;
    keywords?: Record<string, string>;
  };
}

const BLOG_DATA_PATH = "data/blogs.json";

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const { octokit, owner, repo, branch } = getGithubBlogContext();
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: BLOG_DATA_PATH,
      ref: branch,
    });

    if (response.status === 200 && "content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString("utf8");
      const parsed = JSON.parse(content) as BlogPost[];
      return Array.isArray(parsed) ? parsed.map(normalizeBlogPost) : [];
    }
    return [];
  } catch (error: any) {
    if (error.status === 404) {
      // File doesn't exist yet, return empty array
      return [];
    }
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string, locale?: string): Promise<BlogPost | null> {
  const blogs = await getAllBlogs();
  
  // Find blog by slug - support both old format (string) and new format (Record<string, string>)
  const blog = blogs.find((b) => {
    if (typeof b.slug === 'string') {
      // Old format: direct match
      return b.slug === slug;
    } else if (typeof b.slug === 'object' && b.slug !== null) {
      // New format: check all locales
      const slugRecord = b.slug as Record<string, string>;
      // If locale is specified, check that locale first, then fallback to all
      if (locale && slugRecord[locale] === slug) {
        return true;
      }
      // Check all locales
      return Object.values(slugRecord).includes(slug);
    }
    return false;
  });
  
  if (!blog) return null;
  
  // Always return the blog - the page component will handle locale fallbacks
  // This ensures Googlebot can index the page even if not fully translated
  return blog;
}

export async function saveBlog(blog: BlogPost): Promise<void> {
  try {
    const { octokit, owner, repo, branch, email, name } = getGithubBlogContext();
    const blogs = await getAllBlogs();
    const existingIndex = blogs.findIndex((b) => b.id === blog.id);
    
    if (existingIndex >= 0) {
      blogs[existingIndex] = blog;
    } else {
      blogs.push(blog);
    }

    // Sort by publishedAt (newest first)
    blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const content = JSON.stringify(blogs, null, 2);
    
    // Try to get existing file to get SHA
    let sha: string | undefined;
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: BLOG_DATA_PATH,
        ref: branch,
      });
      if (response.status === 200 && "sha" in response.data) {
        sha = response.data.sha;
      }
    } catch (error: any) {
      // File doesn't exist, will create new
      if (error.status !== 404) throw error;
    }

    // Use createOrUpdateFileContents which works for both create and update
    const slugDisplay = typeof blog.slug === 'string' 
      ? blog.slug 
      : (blog.slug[blog.locale] || blog.slug['en'] || Object.values(blog.slug)[0] || 'blog');
    
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: BLOG_DATA_PATH,
      message: sha 
        ? `Update blog: ${blog.title[blog.locale] || slugDisplay}`
        : `Create blog: ${blog.title[blog.locale] || slugDisplay}`,
      content: Buffer.from(content).toString("base64"),
      sha: sha, // Include SHA if updating existing file
      branch,
      committer: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    throw error;
  }
}

export async function deleteBlog(blogId: string): Promise<void> {
  try {
    const { octokit, owner, repo, branch, email, name } = getGithubBlogContext();
    const blogs = await getAllBlogs();
    const filtered = blogs.filter((b) => b.id !== blogId);
    
    const content = JSON.stringify(filtered, null, 2);
    
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: BLOG_DATA_PATH,
      ref: branch,
    });
    
    if (response.status === 200 && "sha" in response.data) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: BLOG_DATA_PATH,
        message: `Delete blog: ${blogId}`,
        content: Buffer.from(content).toString("base64"),
        sha: response.data.sha,
        branch,
        committer: {
          name,
          email,
        },
      });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

