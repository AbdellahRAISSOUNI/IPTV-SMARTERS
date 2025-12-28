import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO?.split("/")[0];
const GITHUB_REPO_NAME = process.env.GITHUB_REPO?.split("/")[1];
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_EMAIL = process.env.GITHUB_EMAIL;
const GITHUB_NAME = process.env.GITHUB_NAME;

if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME || !GITHUB_EMAIL || !GITHUB_NAME) {
  throw new Error("Missing GitHub environment variables for blog system.");
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export interface BlogBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "list";
  content: string;
  level?: number; // For headings (1-6)
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: "full" | "half" | "third" | "quarter";
  imageAlign?: "left" | "center" | "right";
  listItems?: string[]; // For list type
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
  slug: string;
  title: Record<string, string>; // { en: "Title", es: "Título", fr: "Titre" }
  excerpt: Record<string, string>;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  locale: string; // Primary language
  translations?: string[]; // Array of locale codes that have translations
  blocks: BlogBlock[];
  meta?: {
    description?: Record<string, string>;
    keywords?: Record<string, string>;
  };
}

const BLOG_DATA_PATH = "data/blogs.json";

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER!,
      repo: GITHUB_REPO_NAME!,
      path: BLOG_DATA_PATH,
      ref: GITHUB_BRANCH,
    });

    if (response.status === 200 && "content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString("utf8");
      return JSON.parse(content);
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
  const blog = blogs.find((b) => b.slug === slug);
  
  if (!blog) return null;
  
  // If locale is specified, return blog with that locale's content if available
  if (locale && blog.translations?.includes(locale)) {
    return blog;
  }
  
  return blog;
}

export async function saveBlog(blog: BlogPost): Promise<void> {
  try {
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
        owner: GITHUB_REPO_OWNER!,
        repo: GITHUB_REPO_NAME!,
        path: BLOG_DATA_PATH,
        ref: GITHUB_BRANCH,
      });
      if (response.status === 200 && "sha" in response.data) {
        sha = response.data.sha;
      }
    } catch (error: any) {
      // File doesn't exist, will create new
      if (error.status !== 404) throw error;
    }

    // Use createOrUpdateFileContents which works for both create and update
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_REPO_OWNER!,
      repo: GITHUB_REPO_NAME!,
      path: BLOG_DATA_PATH,
      message: sha 
        ? `Update blog: ${blog.title[blog.locale] || blog.slug}`
        : `Create blog: ${blog.title[blog.locale] || blog.slug}`,
      content: Buffer.from(content).toString("base64"),
      sha: sha, // Include SHA if updating existing file
      branch: GITHUB_BRANCH,
      committer: {
        name: GITHUB_NAME!,
        email: GITHUB_EMAIL!,
      },
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    throw error;
  }
}

export async function deleteBlog(blogId: string): Promise<void> {
  try {
    const blogs = await getAllBlogs();
    const filtered = blogs.filter((b) => b.id !== blogId);
    
    const content = JSON.stringify(filtered, null, 2);
    
    const response = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER!,
      repo: GITHUB_REPO_NAME!,
      path: BLOG_DATA_PATH,
      ref: GITHUB_BRANCH,
    });
    
    if (response.status === 200 && "sha" in response.data) {
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_REPO_OWNER!,
        repo: GITHUB_REPO_NAME!,
        path: BLOG_DATA_PATH,
        message: `Delete blog: ${blogId}`,
        content: Buffer.from(content).toString("base64"),
        sha: response.data.sha,
        branch: GITHUB_BRANCH,
        committer: {
          name: GITHUB_NAME!,
          email: GITHUB_EMAIL!,
        },
      });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

