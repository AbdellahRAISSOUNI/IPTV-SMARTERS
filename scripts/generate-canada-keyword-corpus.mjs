/**
 * Canada (/ca) SEO keyword corpus — 500+ unique phrases.
 * Run: node scripts/generate-canada-keyword-corpus.mjs
 * Updates: data/seo/keyword-corpus.json (adds/merges "ca")
 *          data/seo/canada-hub-visible.json (visible hub pills)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORPUS_PATH = path.join(__dirname, "..", "data", "seo", "keyword-corpus.json");
const HUB_PATH = path.join(__dirname, "..", "data", "seo", "canada-hub-visible.json");
const TARGET = 520;
const HUB_VISIBLE = 160;

const PRIORITY = [
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
];

const provinces = [
  "Ontario",
  "Quebec",
  "British Columbia",
  "Alberta",
  "Manitoba",
  "Saskatchewan",
  "Nova Scotia",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Prince Edward Island",
  "Northwest Territories",
  "Yukon",
  "Nunavut",
];

const cities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "London Ontario",
  "Victoria",
  "Halifax",
  "Saskatoon",
  "Regina",
  "St Johns",
  "Moncton",
  "Fredericton",
  "Charlottetown",
  "Laval",
  "Gatineau",
  "Longueuil",
  "Sherbrooke",
  "Saguenay",
  "Lévis",
  "Trois-Rivières",
  "Barrie",
  "Kelowna",
  "Abbotsford",
  "Kingston",
  "Guelph",
  "Cambridge",
  "Waterloo",
  "Brampton",
  "Mississauga",
  "Markham",
  "Surrey",
  "Burnaby",
  "Richmond BC",
  "Windsor",
  "Thunder Bay",
  "Sudbury",
  "Niagara Falls",
  "Red Deer",
  "Lethbridge",
  "Medicine Hat",
  "Grande Prairie",
  "Nanaimo",
  "Kamloops",
  "Prince George",
  "Chilliwack",
  "Whitehorse",
  "Yellowknife",
  "Iqaluit",
];

const devices = [
  "Firestick",
  "Fire TV",
  "Android TV",
  "Samsung Smart TV",
  "LG Smart TV",
  "Apple TV",
  "Roku",
  "MAG box",
  "Formuler",
  "Nvidia Shield",
  "iPhone",
  "iPad",
  "Windows PC",
  "Mac",
  "Chromecast",
  "Google TV",
  "Hisense TV",
  "TCL TV",
  "Sony Bravia",
];

const sports = [
  "NHL",
  "NFL",
  "NBA",
  "MLB",
  "CFL",
  "soccer",
  "UFC",
  "PPV",
  "F1",
  "Wimbledon",
  "Olympics",
  "World Cup 2026",
];

const templates = [
  (g) => `iptv ${g}`,
  (g) => `${g} iptv`,
  (g) => `best iptv ${g}`,
  (g) => `iptv subscription ${g}`,
  (g) => `iptv canada ${g}`,
  (g) => `iptv for ${g}`,
  (g) => `iptv box ${g}`,
  (g) => `iptv with box ${g}`,
  (g) => `iptv from canada ${g}`,
  (g) => `quebec iptv ${g}`,
  (g) => `iptv quebec ${g}`,
  (g) => `best iptv canada ${g}`,
  (g) => `best canada iptv ${g}`,
  (g) => `cheap iptv ${g}`,
  (g) => `4k iptv ${g}`,
  (g) => `iptv smarters pro ${g}`,
  (g) => `m3u iptv ${g}`,
  (g) => `xtream codes iptv ${g}`,
  (g) => `live tv iptv ${g}`,
  (g) => `sports iptv ${g}`,
];

const modifiers = [
  "free trial",
  "cad pricing",
  "no buffering",
  "anti freeze",
  "instant activation",
  "24/7 support",
  "epg guide",
  "vod movies",
  "series on demand",
  "multi device",
  "family plan",
  "reseller panel",
  "m3u playlist",
  "xtream login",
  "setup guide",
  "2026",
  "premium",
  "stable streams",
  "hd channels",
  "4k sports",
];

const set = new Set(PRIORITY.map((k) => k.toLowerCase().trim()));

for (const p of PRIORITY) {
  set.add(p);
  set.add(`${p} 2026`);
  set.add(`${p} cad`);
  set.add(`${p} smarters pro`);
}

const geo = [...provinces, ...cities, "Canada", "Canadian", "Quebec", "Francophone Canada"];
for (const g of geo) {
  for (const fn of templates) {
    const s = fn(g).replace(/\s+/g, " ").trim().toLowerCase();
    if (s.length > 4 && s.length < 120) set.add(s);
    if (set.size >= TARGET) break;
  }
  if (set.size >= TARGET) break;
}

for (const d of devices) {
  set.add(`iptv on ${d} canada`);
  set.add(`iptv box ${d}`);
  set.add(`install iptv ${d} canada`);
  set.add(`iptv with box ${d}`);
  set.add(`best iptv ${d} canada`);
}

for (const s of sports) {
  set.add(`iptv ${s} canada`);
  set.add(`watch ${s} iptv canada`);
  set.add(`best iptv ${s} streaming canada`);
}

const seeds = [
  "iptv canada",
  "iptv quebec",
  "iptv box",
  "best iptv canada",
  "iptv subscription",
  "iptv smarters pro",
  "iptv for canada",
  "quebec iptv",
  "iptv from canada",
  "best canada iptv",
  "iptv with box",
  "canadian iptv provider",
  "iptv service canada",
  "premium iptv canada",
  "cheap iptv canada",
  "reliable iptv canada",
  "iptv m3u canada",
  "xtream codes canada",
];

let n = 0;
while (set.size < TARGET) {
  const seed = seeds[n % seeds.length];
  const mod = modifiers[n % modifiers.length];
  set.add(`${seed} ${mod}`);
  set.add(`${mod} ${seed}`);
  n++;
  if (n > TARGET * 6) break;
}

const ca = [...set].slice(0, TARGET);

// Hub: priority first, then diverse corpus phrases (title case for display)
function toHubLabel(k) {
  return k
    .split(" ")
    .map((w) => (w.length <= 3 && w !== "iptv" ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\bIptv\b/g, "IPTV")
    .replace(/\bM3u\b/g, "M3U")
    .replace(/\bCad\b/g, "CAD")
    .replace(/\b4k\b/gi, "4K")
    .replace(/\bHd\b/g, "HD")
    .replace(/\bNhl\b/g, "NHL")
    .replace(/\bNfl\b/g, "NFL")
    .replace(/\bUfc\b/g, "UFC");
}

const hubSeen = new Set();
const hub = [];
for (const k of PRIORITY) {
  const key = k.toLowerCase();
  if (hubSeen.has(key)) continue;
  hubSeen.add(key);
  hub.push({ label: toHubLabel(k), keyword: k });
}
for (const k of ca) {
  if (hub.length >= HUB_VISIBLE) break;
  const key = k.toLowerCase();
  if (hubSeen.has(key)) continue;
  hubSeen.add(key);
  hub.push({ label: toHubLabel(k), keyword: k });
}

let existing = { en: [], es: [], fr: [] };
if (fs.existsSync(CORPUS_PATH)) {
  existing = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf8"));
}

const merged = { ...existing, ca };
fs.writeFileSync(CORPUS_PATH, JSON.stringify(merged, null, 0), "utf8");
fs.writeFileSync(HUB_PATH, JSON.stringify({ keywords: hub }, null, 2), "utf8");

console.log("Wrote", CORPUS_PATH, "ca count:", ca.length);
console.log("Wrote", HUB_PATH, "hub count:", hub.length);
