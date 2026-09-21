import { locales, type Locale } from "@/lib/i18n";
import { localeToUrlSegment, urlSlugToLocale } from "@/lib/i18n/locale-url-slugs";

/**
 * First path segment when it is a supported locale code (e.g. `/uk/blog/` → `uk`),
 * or the `en` homepage's URL-slug alias (e.g. `/iptv-subscription/` → `en`).
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  if (segment in urlSlugToLocale) return urlSlugToLocale[segment];
  if (locales.includes(segment as Locale)) return segment as Locale;
  return null;
}

function isLocaleSegment(segment: string): boolean {
  return segment in urlSlugToLocale || locales.includes(segment as Locale);
}

/**
 * Remove one or more leading locale segments (locale codes or the homepage slug alias).
 * Fixes malformed paths like `/ca/uk/blog/` → `/blog/`.
 */
export function stripLocalePrefix(pathname: string): string {
  let segments = pathname.split("/").filter(Boolean);

  while (segments.length > 0 && isLocaleSegment(segments[0])) {
    segments = segments.slice(1);
  }

  if (segments.length === 0) {
    return "/";
  }

  return `/${segments.join("/")}`;
}

/**
 * Build a localized URL path with trailing slash (matches site trailingSlash config).
 * Only the `en` homepage (root path) uses its URL-slug alias; every other page keeps
 * the plain locale-code prefix.
 */
export function buildLocalizedPath(locale: Locale, pathWithoutLocale: string): string {
  const rest = stripLocalePrefix(pathWithoutLocale);

  if (rest === "/") {
    return `/${localeToUrlSegment(locale)}/`;
  }

  const suffix = rest.endsWith("/") ? rest : `${rest}/`;
  return `/${locale}${suffix}`;
}

/** True when path has two locale segments in a row (`/ca/uk/...`). */
export function hasDuplicateLocalePrefix(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length >= 2 && isLocaleSegment(segments[0]) && isLocaleSegment(segments[1]);
}

/** Resolve `/ca/uk/foo/` → `/uk/foo/` (keeps the second locale as canonical). */
export function fixDuplicateLocalePath(pathname: string): string | null {
  if (!hasDuplicateLocalePrefix(pathname)) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const secondSegment = segments[1];
  const targetLocale = secondSegment in urlSlugToLocale ? urlSlugToLocale[secondSegment] : (secondSegment as Locale);
  const rest = segments.slice(2).join("/");

  if (!rest) {
    return `/${localeToUrlSegment(targetLocale)}/`;
  }
  return `/${targetLocale}/${rest}/`;
}
