import type { BlogBlock, BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export const BLOG_LOCALES = locales;
export type BlogLocale = Locale;

export function isBlogLocale(value: string): value is BlogLocale {
  return BLOG_LOCALES.includes(value as BlogLocale);
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

export function getSlugForLocale(blog: BlogPost, locale: BlogLocale): string {
  if (typeof blog.slug === "string") {
    return normalizeSlug(blog.slug);
  }
  return normalizeSlug(String(blog.slug?.[locale] || ""));
}

export function getTextByLocale(
  value: Record<string, string> | undefined,
  locale: BlogLocale
): string {
  if (!value) return "";
  return String(value[locale] || "").trim();
}

function blockHasTextForLocale(block: BlogBlock, locale: BlogLocale): boolean {
  if (block.type === "image") {
    return Boolean(block.imageUrl && !block.imageUrl.startsWith("blob:"));
  }
  if (typeof block.content === "string") {
    return block.content.trim().length > 0;
  }
  if (block.content && typeof block.content === "object") {
    return String(block.content[locale] || "").trim().length > 0;
  }
  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      return block.listItems.some((item) => String(item).trim().length > 0);
    }
    const items = block.listItems[locale] || [];
    return Array.isArray(items) && items.some((item) => String(item).trim().length > 0);
  }
  return false;
}

/** True when this locale has enough filled fields to be published. */
export function hasLocalePublishableContent(blog: BlogPost, locale: BlogLocale): boolean {
  if (!getSlugForLocale(blog, locale)) return false;
  if (!getTextByLocale(blog.title, locale)) return false;
  if (!getTextByLocale(blog.excerpt, locale)) return false;
  if (!getTextByLocale(blog.meta?.description, locale)) return false;
  const blocks = Array.isArray(blog.blocks) ? blog.blocks : [];
  return blocks.some((block) => blockHasTextForLocale(block, locale));
}

/**
 * Locales that are live on the site. Uses `translations` when set; otherwise infers from content (legacy posts).
 */
export function getPublishedLocales(blog: BlogPost): BlogLocale[] {
  const explicit = (blog.translations || []).filter(isBlogLocale);
  if (explicit.length > 0) {
    return explicit;
  }

  const inferred = BLOG_LOCALES.filter((loc) => hasLocalePublishableContent(blog, loc));
  if (inferred.length > 0) {
    return inferred;
  }

  const primary = blog.locale;
  if (isBlogLocale(primary)) {
    return [primary];
  }
  return ["en"];
}

export function isLocalePublished(blog: BlogPost, locale: BlogLocale): boolean {
  return getPublishedLocales(blog).includes(locale);
}

export function emptyLocaleTextMap(): Record<BlogLocale, string> {
  return { en: "", es: "", fr: "" };
}

function copyBlockContentToLocale(block: BlogBlock, from: BlogLocale, to: BlogLocale): BlogBlock {
  const next = { ...block };

  if (typeof block.content === "string") {
    next.content = {
      en: block.content,
      es: block.content,
      fr: block.content,
      [to]: block.content,
    };
  } else if (block.content && typeof block.content === "object") {
    const source = String(block.content[from] || "").trim();
    next.content = { ...block.content, [to]: source };
  }

  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      next.listItems = { en: [...block.listItems], es: [...block.listItems], fr: [...block.listItems] };
    } else {
      const source = block.listItems[from] || [];
      next.listItems = { ...block.listItems, [to]: [...source] };
    }
  }

  if (block.imageAlt) {
    if (typeof block.imageAlt === "string") {
      next.imageAlt = { en: block.imageAlt, es: block.imageAlt, fr: block.imageAlt };
    } else {
      const source = String(block.imageAlt[from] || "").trim();
      next.imageAlt = { ...block.imageAlt, [to]: source };
    }
  }

  return next;
}

export type CopyBlogLocaleOptions = {
  /** Also copy URL slug (usually keep slugs unique per language). */
  includeSlug?: boolean;
  targets?: BlogLocale[];
};

/**
 * Copy title, excerpt, SEO fields, and block text from one locale to others.
 */
export function copyBlogLocaleContent(
  blog: BlogPost,
  from: BlogLocale,
  options: CopyBlogLocaleOptions = {}
): BlogPost {
  const published = getPublishedLocales(blog);
  const targets =
    options.targets?.filter((t) => t !== from && published.includes(t)) ||
    published.filter((t) => t !== from);

  if (targets.length === 0) {
    return blog;
  }

  const title = { ...emptyLocaleTextMap(), ...blog.title };
  const excerpt = { ...emptyLocaleTextMap(), ...blog.excerpt };
  const description = { ...emptyLocaleTextMap(), ...blog.meta?.description };
  const keywords = { ...emptyLocaleTextMap(), ...blog.meta?.keywords };

  const sourceTitle = getTextByLocale(title, from);
  const sourceExcerpt = getTextByLocale(excerpt, from);
  const sourceDesc = getTextByLocale(description, from);
  const sourceKeywords = getTextByLocale(keywords, from);

  for (const to of targets) {
    title[to] = sourceTitle;
    excerpt[to] = sourceExcerpt;
    description[to] = sourceDesc;
    keywords[to] = sourceKeywords;
  }

  let slug = blog.slug;
  if (options.includeSlug) {
    const sourceSlug = getSlugForLocale(blog, from);
    if (typeof slug === "string") {
      slug = { en: sourceSlug, es: sourceSlug, fr: sourceSlug };
    } else {
      slug = { en: "", es: "", fr: "", ...slug };
      for (const to of targets) {
        (slug as Record<string, string>)[to] = sourceSlug;
      }
    }
  }

  const blocks = (blog.blocks || []).map((block) => {
    let updated = block;
    for (const to of targets) {
      updated = copyBlockContentToLocale(updated, from, to);
    }
    return updated;
  });

  return {
    ...blog,
    slug,
    title,
    excerpt,
    blocks,
    meta: {
      ...blog.meta,
      description,
      keywords,
    },
  };
}

export function validateBlogForPublish(
  blog: BlogPost,
  publishedLocales: BlogLocale[]
): { ok: true; blog: BlogPost } | { ok: false; error: string } {
  if (!blog || typeof blog !== "object") {
    return { ok: false, error: "Invalid blog payload." };
  }

  if (publishedLocales.length === 0) {
    return { ok: false, error: "Select at least one language to publish." };
  }

  const primary = blog.locale;
  if (!isBlogLocale(primary)) {
    return { ok: false, error: "Primary language must be one of: en, es, fr." };
  }

  if (!publishedLocales.includes(primary)) {
    return {
      ok: false,
      error: "Primary language must be included in published languages.",
    };
  }

  for (const loc of publishedLocales) {
    if (!hasLocalePublishableContent(blog, loc)) {
      return {
        ok: false,
        error: `Incomplete content for ${loc.toUpperCase()}. Each published language needs: slug, title, excerpt, SEO description, and at least one content block with text (images count for all languages).`,
      };
    }
  }

  const publishedAt = new Date(blog.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) {
    return { ok: false, error: "Invalid published date." };
  }

  const normalizedSlugs: Record<BlogLocale, string> = {
    en: getSlugForLocale(blog, "en"),
    es: getSlugForLocale(blog, "es"),
    fr: getSlugForLocale(blog, "fr"),
  };

  return {
    ok: true,
    blog: {
      ...blog,
      slug: normalizedSlugs,
      publishedAt: publishedAt.toISOString(),
      updatedAt: new Date().toISOString(),
      translations: [...publishedLocales],
    },
  };
}

export function findDuplicateSlugError(
  blog: BlogPost,
  allBlogs: BlogPost[],
  publishedLocales: BlogLocale[]
): string | null {
  const incomingId = String(blog.id || "").trim();
  const slugsToCheck = publishedLocales
    .map((loc) => getSlugForLocale(blog, loc))
    .filter(Boolean);

  const duplicate = allBlogs.find((existing) => {
    if (incomingId && existing.id === incomingId) return false;
    const existingPublished = getPublishedLocales(existing);
    return existingPublished.some((loc) => {
      const existingSlug = getSlugForLocale(existing, loc);
      return existingSlug && slugsToCheck.includes(existingSlug);
    });
  });

  if (duplicate) {
    return "Duplicate blog slug detected. Slugs must be unique across all published blog posts and languages.";
  }
  return null;
}
