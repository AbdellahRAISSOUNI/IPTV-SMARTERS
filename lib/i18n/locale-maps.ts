import type { Locale } from "@/lib/i18n";

/** Open Graph / hreflang locale codes */
export const openGraphLocaleMap: Record<Locale, string> = {
  en: "en_US",
  ca: "en_CA",
  es: "es_ES",
  fr: "fr_FR",
};

export const siteNameMap: Record<Locale, string> = {
  en: "StreamPro - Premium IPTV Service",
  ca: "StreamPro - Premium IPTV Service Canada",
  es: "StreamPro - Servicio IPTV Premium",
  fr: "StreamPro - Service IPTV Premium",
};

/** Footer / switcher labels (ca is regional, not "English") */
export const regionDisplayNames: Record<Locale, string> = {
  en: "United States",
  ca: "Canada",
  es: "Español",
  fr: "Français",
};
