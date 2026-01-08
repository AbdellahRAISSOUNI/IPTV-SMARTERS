import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/admin/blog';

/**
 * Get the blog slug for a specific locale
 * If the slug is a string (old format), return it as-is
 * If the slug is a Record (new format), return the locale-specific slug or fallback to English
 */
export function getBlogSlug(blog: BlogPost, locale: Locale): string {
  if (typeof blog.slug === 'string') {
    return blog.slug;
  }
  
  const slugRecord = blog.slug as Record<string, string>;
  // Return locale-specific slug, or fallback to English, or empty string
  return slugRecord[locale] || slugRecord['en'] || '';
}

/**
 * Get the blog URL for a specific locale
 * Includes trailing slash for consistency with next.config trailingSlash: true
 */
export function getBlogUrl(blog: BlogPost, locale: Locale): string {
  const slug = getBlogSlug(blog, locale);
  return `/${locale}/blog/${slug}/`;
}

/**
 * Get all available slugs for a blog (for language switching)
 * Returns a map of locale to slug
 */
export function getAllBlogSlugs(blog: BlogPost): Record<Locale, string> {
  if (typeof blog.slug === 'string') {
    // Old format: same slug for all locales
    return {
      en: blog.slug,
      es: blog.slug,
      fr: blog.slug,
    };
  }
  
  const slugRecord = blog.slug as Record<string, string>;
  const englishSlug = slugRecord['en'] || '';
  
  return {
    en: slugRecord['en'] || '',
    es: slugRecord['es'] || englishSlug,
    fr: slugRecord['fr'] || englishSlug,
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
  return blogs.find((blog) => {
    if (typeof blog.slug === 'string') {
      return blog.slug === slug;
    }
    
    const slugRecord = blog.slug as Record<string, string>;
    return Object.values(slugRecord).includes(slug);
  }) || null;
}
