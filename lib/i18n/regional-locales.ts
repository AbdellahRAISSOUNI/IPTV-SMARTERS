import type { Locale } from "@/lib/i18n";

/** English regional sites (not the default US /en/ market). */
export const REGIONAL_ENGLISH_LOCALES = ["ca", "uk"] as const satisfies readonly Locale[];

export type RegionalEnglishLocale = (typeof REGIONAL_ENGLISH_LOCALES)[number];

export function isRegionalEnglishLocale(locale: Locale): boolean {
  return locale === "ca" || locale === "uk";
}
