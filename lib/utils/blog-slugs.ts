import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/admin/blog-shared';

function safeEncodeSlug(slug: string): string {
  try {
    return encodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function safeDecodeSlug(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Get the blog slug for a specific locale (no cross-language fallback).
 * Legacy string slug is returned for every locale.
 */
export function getBlogSlug(blog: BlogPost, locale: Locale): string {
  if (typeof blog.slug === 'string') {
    return blog.slug;
  }

  const slugRecord = blog.slug as Record<string, string>;
  return String(slugRecord[locale] || '').trim();
}

/**
 * Get the blog URL for a specific locale
 * Includes trailing slash for consistency with next.config trailingSlash: true
 */
export function getBlogUrl(blog: BlogPost, locale: Locale): string {
  const slug = getBlogSlug(blog, locale);
  return `/${locale}/blog/${safeEncodeSlug(slug)}/`;
}

/**
 * Get all available slugs for a blog (for language switching)
 * Returns a map of locale to slug
 */
export function getAllBlogSlugs(blog: BlogPost): Record<Locale, string> {
  if (typeof blog.slug === 'string') {
    return {
      en: blog.slug,
      es: blog.slug,
      fr: blog.slug,
    };
  }

  const slugRecord = blog.slug as Record<string, string>;

  return {
    en: String(slugRecord['en'] || '').trim(),
    es: String(slugRecord['es'] || '').trim(),
    fr: String(slugRecord['fr'] || '').trim(),
  };
}

/**
 * Find a blog by any of its slugs (reverse lookup)
 * This is used to find a blog when we have a slug but don't know which locale it belongs to
 */
export function findBlogByAnySlug(
  blogs: BlogPost[],
  slug: string
): BlogPost | null {
  const target = safeDecodeSlug(slug).trim();
  return (
    blogs.find((blog) => {
      if (typeof blog.slug === "string") {
        return safeDecodeSlug(blog.slug).trim() === target;
      }

      const slugRecord = blog.slug as Record<string, string>;
      return Object.values(slugRecord).some(
        (s) => safeDecodeSlug(String(s)).trim() === target
      );
    }) || null
  );
}
