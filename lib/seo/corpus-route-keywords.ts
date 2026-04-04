import type { Locale } from "@/lib/i18n";
import keywordCorpus from "@/data/seo/keyword-corpus.json";

export type CorpusSeoProfile =
  | "windows"
  | "ios"
  | "firestick"
  | "smartTv"
  | "guide"
  | "reseller"
  | "blog"
  | "legal";

const corpus = keywordCorpus as Record<Locale, string[]>;

/** Deterministic rotation when a profile matches too few corpus lines. */
const PROFILE_OFFSET: Record<CorpusSeoProfile, number> = {
  windows: 11,
  ios: 73,
  firestick: 139,
  smartTv: 201,
  guide: 17,
  reseller: 251,
  blog: 89,
  legal: 311,
};

function phraseMatchesProfile(phrase: string, profile: CorpusSeoProfile): boolean {
  const p = phrase.toLowerCase();
  switch (profile) {
    case "windows":
      return /\bwindows\b/.test(p) || /\bpc\b/.test(p);
    case "ios":
      return /\bios\b/.test(p) || p.includes("iphone") || p.includes("ipad");
    case "firestick":
      return p.includes("fire") && (p.includes("stick") || p.includes("fire tv") || p.includes("amazon"));
    case "smartTv":
      return (
        p.includes("smart tv") ||
        p.includes("samsung") ||
        /\blg\b/.test(p) ||
        p.includes("android tv") ||
        p.includes("google tv")
      );
    case "guide":
      return (
        p.includes("install") ||
        p.includes("setup") ||
        p.includes("guía") ||
        p.includes("guide") ||
        p.includes("tutorial") ||
        p.includes("configuration") ||
        p.includes("instalar") ||
        p.includes("installer")
      );
    case "reseller":
      return (
        p.includes("reseller") ||
        p.includes("revendeur") ||
        p.includes("revendedor") ||
        p.includes("white label") ||
        p.includes("panel") ||
        p.includes("crédit") ||
        p.includes("credit")
      );
    case "blog":
      return p.includes("iptv") && (p.includes("stream") || p.includes("channel") || p.includes("vod") || p.includes("4k"));
    case "legal":
      return (
        p.includes("privacy") ||
        p.includes("refund") ||
        p.includes("terms") ||
        p.includes("política") ||
        p.includes("confidential") ||
        p.includes("remboursement") ||
        p.includes("reembolso") ||
        p.includes("datos") ||
        p.includes("données")
      );
    default:
      return false;
  }
}

function pickFromCorpus(locale: Locale, profile: CorpusSeoProfile, maxPick: number): string[] {
  const list = corpus[locale] ?? [];
  const picked: string[] = [];
  const seen = new Set<string>();

  for (const phrase of list) {
    if (picked.length >= maxPick) break;
    if (!phraseMatchesProfile(phrase, profile)) continue;
    const k = phrase.toLowerCase().trim();
    if (seen.has(k)) continue;
    seen.add(k);
    picked.push(phrase);
  }

  const minWant = Math.min(14, maxPick);
  if (picked.length < minWant && list.length > 0) {
    let i = PROFILE_OFFSET[profile] % list.length;
    let steps = 0;
    while (picked.length < maxPick && steps < list.length) {
      const phrase = list[i % list.length];
      i += 1;
      steps += 1;
      const k = phrase.toLowerCase().trim();
      if (seen.has(k)) continue;
      seen.add(k);
      picked.push(phrase);
    }
  }

  return picked;
}

/**
 * Merges hand-written route seeds with corpus phrases that match the page topic.
 * Use for meta keywords + WebPage JSON-LD `keywords` (structured data, not hidden body text).
 */
export function getRouteMetaKeywords(
  locale: Locale,
  profile: CorpusSeoProfile,
  seedKeywords: readonly string[],
  options?: { maxFromCorpus?: number; maxTotal?: number }
): string[] {
  const maxFromCorpus = options?.maxFromCorpus ?? 34;
  const maxTotal = options?.maxTotal ?? 72;
  const fromCorpus = pickFromCorpus(locale, profile, maxFromCorpus);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const s of seedKeywords) {
    const k = s.toLowerCase().trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
    if (out.length >= maxTotal) return out;
  }
  for (const s of fromCorpus) {
    const k = s.toLowerCase().trim();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
    if (out.length >= maxTotal) break;
  }
  return out;
}
