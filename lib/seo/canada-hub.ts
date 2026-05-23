import type { Locale } from "@/lib/i18n";
import hubData from "@/data/seo/canada-hub-visible.json";

export const PRIORITY_CANADA_KEYWORDS = [
  "iptv canada",
  "iptv quebec",
  "iptv box",
  "iptv from canada",
  "best iptv",
  "iptv with box",
  "best canada iptv",
  "iptv for canada",
  "quebec iptv",
  "best iptv canada",
  "iptv subscription",
] as const;

export type CanadaHubKeyword = {
  label: string;
  keyword: string;
};

export function getCanadaHubKeywords(): CanadaHubKeyword[] {
  return hubData.keywords ?? [];
}

/** Internal link targets rotated for visible keyword pills on /ca pages. */
export function getCanadaKeywordHref(
  locale: Locale,
  index: number,
  installGuide: string,
  firestick: string,
  smartTv: string
): string {
  const targets = [
    `/${locale}/`,
    `/${locale}/#pricing`,
    `/${locale}/#features`,
    `/${locale}/#faq`,
    `/${locale}/#channels`,
    `/${locale}/#cta`,
    `/${locale}/blog/`,
    installGuide,
    firestick,
    smartTv,
    `${installGuide}#download-iptv-smarters`,
    `/${locale}/#pricing`,
  ];
  return targets[index % targets.length];
}
