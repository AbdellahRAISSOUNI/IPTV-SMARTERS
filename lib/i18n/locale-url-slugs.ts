import { locales, type Locale } from './index';

/**
 * Public URL path segment for each locale's HOMEPAGE only (e.g. the root
 * `/en/` -> `/iptv-subscription/`). Every other page under a locale (blog,
 * installation guides, legal pages, etc.) keeps its plain locale-code prefix
 * regardless of this map — only `en`'s homepage differs from its locale code.
 */
export const localeUrlSlugs: Record<Locale, string> = {
  en: 'iptv-subscription',
  es: 'es',
  fr: 'fr',
  ca: 'ca',
  uk: 'uk',
};

export const urlSlugToLocale: Record<string, Locale> = Object.fromEntries(
  locales.map((locale) => [localeUrlSlugs[locale], locale])
) as Record<string, Locale>;

export function localeToUrlSegment(locale: Locale): string {
  return localeUrlSlugs[locale];
}
