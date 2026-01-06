import type { Locale } from '@/lib/i18n';

/**
 * Installation page slug mappings
 * Maps English slugs to language-specific slugs
 */
export const installationSlugMap: Record<string, Record<Locale, string>> = {
  'iptv-installation-guide': {
    en: 'iptv-installation-guide',
    es: 'guia-instalacion-iptv',
    fr: 'guide-installation-iptv',
  },
  'iptv-installation-ios': {
    en: 'iptv-installation-ios',
    es: 'instalacion-ios-iptv',
    fr: 'installation-ios-iptv',
  },
  'iptv-installation-windows': {
    en: 'iptv-installation-windows',
    es: 'instalacion-windows-iptv',
    fr: 'installation-windows-iptv',
  },
  'iptv-installation-smart-tv': {
    en: 'iptv-installation-smart-tv',
    es: 'instalacion-smart-tv-iptv',
    fr: 'installation-smart-tv-iptv',
  },
  'iptv-installation-firestick': {
    en: 'iptv-installation-firestick',
    es: 'instalacion-firestick-iptv',
    fr: 'installation-firestick-iptv',
  },
};

/**
 * Reseller program slug mappings
 * Maps English slugs to language-specific slugs
 */
export const resellerSlugMap: Record<string, Record<Locale, string>> = {
  'iptv-reseller-program': {
    en: 'iptv-reseller-program',
    es: 'programa-revendedor-iptv',
    fr: 'programme-revendeur-iptv',
  },
};

/**
 * Get the language-specific slug for an installation page
 */
export function getInstallationSlug(englishSlug: string, locale: Locale): string {
  const mapping = installationSlugMap[englishSlug];
  if (!mapping) {
    // If not an installation page, return as-is
    return englishSlug;
  }
  return mapping[locale];
}

/**
 * Get the English slug from a language-specific slug (reverse lookup)
 * Tries the specified locale first, then checks all locales as fallback
 * Checks both installation and reseller maps
 */
export function getEnglishSlugFromLocalized(localizedSlug: string, locale?: Locale): string | null {
  // First try the specified locale for installation slugs
  if (locale) {
    for (const [englishSlug, mappings] of Object.entries(installationSlugMap)) {
      if (mappings[locale] === localizedSlug) {
        return englishSlug;
      }
    }
    // Then try the specified locale for reseller slugs
    for (const [englishSlug, mappings] of Object.entries(resellerSlugMap)) {
      if (mappings[locale] === localizedSlug) {
        return englishSlug;
      }
    }
  }
  
  // Fallback: check all locales for installation slugs
  for (const [englishSlug, mappings] of Object.entries(installationSlugMap)) {
    for (const loc of ['en', 'es', 'fr'] as Locale[]) {
      if (mappings[loc] === localizedSlug) {
        return englishSlug;
      }
    }
  }

  // Fallback: check all locales for reseller slugs
  for (const [englishSlug, mappings] of Object.entries(resellerSlugMap)) {
    for (const loc of ['en', 'es', 'fr'] as Locale[]) {
      if (mappings[loc] === localizedSlug) {
        return englishSlug;
      }
    }
  }
  
  return null;
}

/**
 * Check if a slug is an installation page slug
 */
export function isInstallationSlug(slug: string): boolean {
  return slug in installationSlugMap;
}

/**
 * Check if a slug is a reseller program slug
 */
export function isResellerSlug(slug: string): boolean {
  return slug in resellerSlugMap;
}

/**
 * Get the language-specific slug for a reseller page
 */
export function getResellerSlug(englishSlug: string, locale: Locale): string {
  const mapping = resellerSlugMap[englishSlug];
  if (!mapping) {
    return englishSlug;
  }
  return mapping[locale];
}

/**
 * Get installation page URL for a specific locale
 */
export function getInstallationUrl(englishSlug: string, locale: Locale): string {
  const slug = getInstallationSlug(englishSlug, locale);
  return `/${locale}/${slug}`;
}

/**
 * Get reseller page URL for a specific locale
 */
export function getResellerUrl(englishSlug: string, locale: Locale): string {
  const slug = getResellerSlug(englishSlug, locale);
  return `/${locale}/${slug}`;
}
