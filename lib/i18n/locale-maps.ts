import type { Locale } from "@/lib/i18n";

/** Open Graph / hreflang locale codes */
export const openGraphLocaleMap: Record<Locale, string> = {
  en: "en_US",
  ca: "en_CA",
  uk: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
};

export const siteNameMap: Record<Locale, string> = {
  en: "StreamPro - Premium IPTV Service",
  ca: "StreamPro - Premium IPTV Service Canada",
  uk: "StreamPro - Premium IPTV Service UK",
  es: "StreamPro - Servicio IPTV Premium",
  fr: "StreamPro - Service IPTV Premium",
};

/** Footer / switcher labels (ca/uk are regional, not "English") */
export const regionDisplayNames: Record<Locale, string> = {
  en: "United States",
  ca: "Canada",
  uk: "United Kingdom",
  es: "Español",
  fr: "Français",
};
