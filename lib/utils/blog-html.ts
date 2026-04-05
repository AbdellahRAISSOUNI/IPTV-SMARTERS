import type { BlogPost } from "@/lib/admin/blog";
import { normalizeHtmlBody, type BlogContentLocale } from "@/lib/admin/blog";
import { sanitizeBlogHtml } from "@/lib/utils/sanitize-blog-html";

const LOCALE_ORDER: BlogContentLocale[] = ["en", "es", "fr"];

/**
 * Picks raw HTML for the active locale with fallbacks, then sanitizes for public display.
 * Returns null when there is no usable HTML (caller should use legacy blocks).
 */
export function getSanitizedBlogHtmlForDisplay(
  htmlBody: BlogPost["htmlBody"],
  activeLocale: string,
  blogLocale: string
): string | null {
  const h = normalizeHtmlBody(htmlBody);
  const chain = [activeLocale, blogLocale, ...LOCALE_ORDER];
  let raw = "";
  for (const loc of chain) {
    const v = h[loc as BlogContentLocale];
    if (v?.trim()) {
      raw = v;
      break;
    }
  }
  if (!raw.trim()) {
    for (const v of Object.values(h)) {
      if (v?.trim()) {
        raw = v;
        break;
      }
    }
  }
  if (!raw.trim()) return null;
  const safe = sanitizeBlogHtml(raw);
  return safe.trim() ? safe : null;
}
