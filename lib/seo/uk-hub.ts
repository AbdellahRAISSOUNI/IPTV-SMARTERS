import type { Locale } from "@/lib/i18n";
import hubData from "@/data/seo/uk-hub-visible.json";

/** Always-visible UK search phrases (homepage hero + footer pills). */
export const PRIORITY_UK_KEYWORDS = [
  "british iptv",
  "iptv uk",
  "best iptv uk",
  "iptv subscription uk",
  "iptv providers",
  "iptv fire stick uk",
  "iptv free trial uk",
  "premier league iptv",
  "iptv smarters player",
  "united kingdom iptv",
] as const;

export type UkHubKeyword = {
  label: string;
  keyword: string;
};

function titleCaseKeyword(keyword: string): string {
  return keyword.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getUkHubKeywords(): UkHubKeyword[] {
  return hubData.keywords ?? [];
}

/** Priority pills in user-defined order; falls back if hub JSON is missing an entry. */
export function getUkPriorityHubKeywords(): UkHubKeyword[] {
  const all = getUkHubKeywords();
  const byKeyword = new Map(all.map((item) => [item.keyword, item]));

  return PRIORITY_UK_KEYWORDS.map((keyword) => {
    const existing = byKeyword.get(keyword);
    if (existing) return existing;
    return { keyword, label: titleCaseKeyword(keyword) };
  });
}

export function getUkKeywordHref(
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
