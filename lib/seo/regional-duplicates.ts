import type { Locale } from "@/lib/i18n";
import { hreflangByLocale } from "@/lib/seo/hreflang";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getPublishedLocales } from "@/lib/admin/blog-locales";

/**
 * ca (English – Canada) and uk (English – UK) pages that carry the same body text as /en/
 * are near-duplicates. Google then picks its own canonical for the cluster, which shows up in
 * Search Console as "Duplicate, Google chose different canonical than user".
 * For those pages the regional URL declares the /en/ URL as canonical and is left out of
 * hreflang and the sitemap. Pages with genuinely regional content (homepage, blog listing,
 * truly localized posts) keep their own canonical.
 */
export const REGIONAL_DUPLICATE_LOCALES: readonly Locale[] = ["ca", "uk"];

/** Share of 4-word phrases from the English post that must also appear in the regional post. */
export const BLOG_DUPLICATE_THRESHOLD = 0.9;

export function isRegionalDuplicateLocale(locale: Locale): boolean {
  return REGIONAL_DUPLICATE_LOCALES.includes(locale);
}

/** `/ca/foo/` or `https://host/uk/foo/` -> same URL under `/en/`. Other locales unchanged. */
export function consolidateRegionalUrl(locale: Locale, url: string): string {
  if (!isRegionalDuplicateLocale(locale)) return url;
  return url.replace(`/${locale}/`, "/en/");
}

/** Drops the regional hreflang entries so `en` pages stop advertising their duplicates. */
export function withoutRegionalAlternates(
  alternates: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (!alternates) return alternates;
  const regionalCodes = REGIONAL_DUPLICATE_LOCALES.map((l) => hreflangByLocale[l]);
  return Object.fromEntries(
    Object.entries(alternates).filter(([code]) => !regionalCodes.includes(code))
  );
}

function blogText(blog: BlogPost, locale: Locale): string {
  const parts: string[] = [];
  for (const block of blog.blocks ?? []) {
    const c = block.content;
    if (typeof c === "string") parts.push(c);
    else if (c && typeof c === "object") parts.push(String(c[locale] ?? ""));
    const items = block.listItems;
    if (Array.isArray(items)) parts.push(...items.map(String));
    else if (items && typeof items === "object") parts.push(...(items[locale] ?? []).map(String));
  }
  return parts.join(" ");
}

function shingles(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + 4 <= words.length; i++) out.add(words.slice(i, i + 4).join(" "));
  return out;
}

/**
 * True when a ca/uk blog post repeats the published English post (same text, regional spelling
 * tweaks aside). Posts without a published English version are never treated as duplicates.
 */
export function isRegionalBlogDuplicate(blog: BlogPost, locale: Locale): boolean {
  if (!isRegionalDuplicateLocale(locale)) return false;
  if (!getPublishedLocales(blog).includes("en")) return false;
  const en = shingles(blogText(blog, "en"));
  if (en.size === 0) return false;
  const regional = shingles(blogText(blog, locale));
  let shared = 0;
  en.forEach((s) => {
    if (regional.has(s)) shared++;
  });
  return shared / en.size >= BLOG_DUPLICATE_THRESHOLD;
}
