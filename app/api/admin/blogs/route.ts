import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllBlogs, getBlogBySlug, saveBlog, deleteBlog, type BlogPost } from "@/lib/admin/blog";
import { buildIndexNowUrlListForBlog, submitToIndexNow } from "@/lib/indexnow";

const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

function getPostSlugMap(blog: BlogPost): Record<SupportedLocale, string> {
  if (typeof blog.slug === "string") {
    const normalized = normalizeSlug(blog.slug);
    return { en: normalized, es: normalized, fr: normalized };
  }
  const raw = blog.slug || {};
  return {
    en: normalizeSlug(String(raw.en || "")),
    es: normalizeSlug(String(raw.es || "")),
    fr: normalizeSlug(String(raw.fr || "")),
  };
}

function getTextByLocale(
  value: Record<string, string> | undefined,
  locale: SupportedLocale
): string {
  if (!value) return "";
  return String(value[locale] || "").trim();
}

function hasRenderableContentForLocale(blog: BlogPost, locale: SupportedLocale): boolean {
  const blocks = Array.isArray(blog.blocks) ? blog.blocks : [];
  return blocks.some((block) => {
    if (block.type === "image") return Boolean(block.imageUrl && !block.imageUrl.startsWith("blob:"));
    // Legacy: single string body counts for every locale
    if (typeof block.content === "string") return block.content.trim().length > 0;
    if (block.content && typeof block.content === "object") {
      return String(block.content[locale] || "").trim().length > 0;
    }
    if (block.type === "list" && block.listItems) {
      if (Array.isArray(block.listItems)) {
        return block.listItems.some((item) => String(item).trim().length > 0);
      }
      if (typeof block.listItems === "object") {
        const items = block.listItems[locale] || [];
        return Array.isArray(items) && items.some((item) => String(item).trim().length > 0);
      }
    }
    return false;
  });
}

async function validateAndNormalizeBlogForPublish(blog: BlogPost): Promise<BlogPost> {
  if (!blog || typeof blog !== "object") {
    throw new Error("Invalid blog payload.");
  }
  if (!isSupportedLocale(blog.locale)) {
    throw new Error("Primary locale must be one of: en, es, fr.");
  }
  const slugMap = getPostSlugMap(blog);

  const normalizedSlugs: Record<SupportedLocale, string> = {
    en: normalizeSlug(String(slugMap.en || "")),
    es: normalizeSlug(String(slugMap.es || "")),
    fr: normalizeSlug(String(slugMap.fr || "")),
  };

  for (const loc of SUPPORTED_LOCALES) {
    if (!normalizedSlugs[loc]) {
      throw new Error(`Missing URL slug for ${loc.toUpperCase()}. Enter a unique slug for each language.`);
    }
    if (!getTextByLocale(blog.title, loc)) {
      throw new Error(`Missing title for ${loc.toUpperCase()}.`);
    }
    if (!getTextByLocale(blog.excerpt, loc)) {
      throw new Error(`Missing excerpt for ${loc.toUpperCase()}.`);
    }
    if (!getTextByLocale(blog.meta?.description, loc)) {
      throw new Error(`Missing SEO meta description for ${loc.toUpperCase()}.`);
    }
    if (!hasRenderableContentForLocale(blog, loc)) {
      throw new Error(
        `Missing body content for ${loc.toUpperCase()}. Add blocks and fill text for that language (images count for all languages).`
      );
    }
  }

  const publishedAt = new Date(blog.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Invalid published date.");
  }

  const allBlogs = await getAllBlogs();
  const incomingId = String(blog.id || "").trim();
  const duplicateSlug = allBlogs.find((existing) => {
    if (incomingId && existing.id === incomingId) return false;
    const existingMap = getPostSlugMap(existing);
    return SUPPORTED_LOCALES.some((loc) => {
      const existingSlug = existingMap[loc];
      return existingSlug && Object.values(normalizedSlugs).includes(existingSlug);
    });
  });
  if (duplicateSlug) {
    throw new Error("Duplicate blog slug detected. Slugs must be unique across all blog posts and languages.");
  }

  return {
    ...blog,
    slug: normalizedSlugs,
    publishedAt: publishedAt.toISOString(),
    updatedAt: new Date().toISOString(),
    translations: [...SUPPORTED_LOCALES],
  };
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale");

    if (slug) {
      const blog = await getBlogBySlug(slug, locale || undefined);
      return NextResponse.json(blog);
    }

    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.error("Error fetching blogs:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog: BlogPost = await request.json();
    const normalizedBlog = await validateAndNormalizeBlogForPublish(blog);
    await saveBlog(normalizedBlog);

    // Best-effort IndexNow notification (do not block admin UX on failure)
    submitToIndexNow(buildIndexNowUrlListForBlog(normalizedBlog)).catch((err) => {
      console.error("IndexNow blog notify failed:", err);
    });
    
    return NextResponse.json({ success: true, blog: normalizedBlog });
  } catch (error: unknown) {
    console.error("Error saving blog:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "Internal server error" ? 500 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    await deleteBlog(blogId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting blog:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

