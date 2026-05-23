/**
 * Merge trending UK phrases into data/seo/keyword-corpus.json (uk array).
 * Usage: node scripts/seed-uk-keyword-corpus.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CORPUS_PATH = join(ROOT, "data/seo/keyword-corpus.json");

const TRENDING = [
  "british iptv",
  "iptv uk",
  "best iptv uk",
  "iptv subscription uk",
  "iptv providers uk",
  "uk iptv provider",
  "iptv with subscription uk",
  "iptv smarters player uk",
  "iptv smarters pro uk",
  "united kingdom iptv",
  "iptv fire stick uk",
  "fire stick iptv uk",
  "amazon fire stick iptv",
  "iptv free trial uk",
  "cheapest iptv uk",
  "stable iptv uk",
  "4k iptv uk",
  "premier league iptv uk",
  "football streaming iptv uk",
  "champions league iptv uk",
  "sports iptv uk",
  "mag box iptv uk",
  "formuler iptv uk",
  "android tv iptv uk",
  "smart tv iptv uk",
  "tivimate iptv uk",
  "m3u iptv uk",
  "xtream iptv uk",
  "catch up iptv uk",
  "epg iptv uk",
  "multi screen iptv uk",
  "gbp iptv plans",
  "iptv london",
  "iptv manchester",
  "iptv birmingham",
  "iptv liverpool",
  "iptv glasgow",
  "iptv edinburgh",
  "iptv belfast",
  "iptv scotland",
  "iptv wales",
  "iptv northern ireland",
  "watch iptv uk",
  "buy iptv uk",
  "iptv no contract uk",
  "iptv 24/7 support uk",
];

const corpus = JSON.parse(readFileSync(CORPUS_PATH, "utf8"));
const existing = new Set((corpus.uk || []).map((p) => p.toLowerCase().trim()));
let added = 0;
for (const phrase of TRENDING) {
  const key = phrase.toLowerCase().trim();
  if (!existing.has(key)) {
    corpus.uk.push(phrase);
    existing.add(key);
    added++;
  }
}
writeFileSync(CORPUS_PATH, JSON.stringify(corpus) + "\n", "utf8");
console.log(`UK corpus: ${corpus.uk.length} phrases (+${added} new trending)`);
