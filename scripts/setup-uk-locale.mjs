/**
 * One-time setup: uk.json, metadata, hub keywords, corpus slice, blog uk locales.
 * Usage: node scripts/setup-uk-locale.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const BLOG_IDS = new Set([
  "ymhtymv24u",
  "kr6i8ax5yol",
  "3q2vg4ltwr",
  "6gyp2fra1v8",
  "rikp3jx9gt",
  "juy47i611gi",
  "b40wqijyjnl",
  "34izr6ai49j",
]);

function localizeForUk(text) {
  if (!text || typeof text !== "string") return text;
  return (
    text
      .replace(/https:\/\/www\.pro-iptvsmarters\.com\/ca\//gi, "https://www.pro-iptvsmarters.com/uk/")
      .replace(/https:\/\/www\.pro-iptvsmarters\.com\/en\//gi, "https://www.pro-iptvsmarters.com/uk/")
      .replace(/www\.pro-iptvsmarters\.com\/ca\//gi, "www.pro-iptvsmarters.com/uk/")
      .replace(/www\.pro-iptvsmarters\.com\/en\//gi, "www.pro-iptvsmarters.com/uk/")
      .replace(/\/ca\/#/g, "/uk/#")
      .replace(/\/en\/#/g, "/uk/#")
      .replace(/\bIPTV Canada\b/gi, "IPTV UK")
      .replace(/\bCanadian\b/gi, "British")
      .replace(/\bCanada\b/gi, "UK")
      .replace(/\bCAD\b/g, "GBP")
      .replace(/\bOntario\b/gi, "England")
      .replace(/\bQuebec\b/gi, "Scotland")
      .replace(/\bquebec iptv\b/gi, "iptv uk")
      .replace(/\biptv canada\b/gi, "iptv uk")
      .replace(/\bbest iptv canada\b/gi, "best iptv uk")
      .replace(/\biptv for canada\b/gi, "iptv for uk")
      .replace(/\biptv subscription in Canada\b/gi, "IPTV subscription in the UK")
      .replace(/\bIPTV subscription\b/gi, "IPTV subscription UK")
      .replace(/\bcolor\b/gi, "colour")
      .replace(/\bfavorite\b/gi, "favourite")
      .replace(/\bcenter\b/gi, "centre")
  );
}

function ukTitle(title) {
  const t = localizeForUk(title);
  if (/\buk\b/i.test(t)) return t;
  if (/^IPTV /i.test(t)) return t.replace(/^IPTV /i, "IPTV UK: ");
  return `${t} | IPTV UK`;
}

function transformCaJsonToUk(ca) {
  const raw = JSON.stringify(ca);
  let s = raw
    .replace(/"canadaLanding"/g, '"ukLanding"')
    .replace(/"canadaKeywords"/g, '"ukKeywords"')
    .replace(/Canada/g, "United Kingdom")
    .replace(/canada/g, "uk")
    .replace(/Canadian/g, "British")
    .replace(/Quebec/g, "Scotland")
    .replace(/Ontario/g, "England")
    .replace(/British Columbia/g, "Wales")
    .replace(/Alberta/g, "Manchester")
    .replace(/CAD/g, "GBP")
    .replace(/\$CA/g, "£")
    .replace(/29 \$CA/g, "£14.99")
    .replace(/49 \$CA/g, "£19.99")
    .replace(/79 \$CA/g, "£32.99")
    .replace(/129 \$CA/g, "£44.99")
    .replace(/39 \$CA/g, "£22.99")
    .replace(/65 \$CA/g, "£29.99")
    .replace(/99 \$CA/g, "£49.99")
    .replace(/149 \$CA/g, "£74.99")
    .replace(/219 CAD/g, "£179 GBP")
    .replace(/399 CAD/g, "£329 GBP")
    .replace(/579 CAD/g, "£479 GBP")
    .replace(/iptv quebec/gi, "iptv uk")
    .replace(/iptv box/gi, "iptv fire stick uk")
    .replace(/NHL/g, "Premier League")
    .replace(/CFL/g, "Championship football");

  const uk = JSON.parse(s);

  uk.hero = {
    ...uk.hero,
    title: "Best IPTV UK Service in 2026",
    subtitlePart1: "Fast · Reliable · Unlimited",
    subtitlePart2: "IPTV Subscription",
    eyebrow: "United Kingdom · Plans in GBP",
    lead: "iptv uk for England, Scotland, Wales & Northern Ireland — stream",
    channelsLink: "25,000+ channels",
    lead2: " and 120,000+ films & series on Firestick, Smart TV, or Mag/box. Use",
    lead3: " or",
    lead4: " with",
    lead5:
      ". IPTV subscription in GBP, Premier League & sports, multi-device plans, 99.9% uptime — best iptv uk without the Sky bill.",
    cta: "View plans & pricing",
    ctaNote: "Instant activation · No contract",
  };

  uk.ukLanding = {
    statsEyebrow: "IPTV UK · Premium streaming",
    stat1Value: "25,000+",
    stat1Label: "Live TV channels",
    stat2Value: "120,000+",
    stat2Label: "Films & series",
    stat3Value: "99.9%",
    stat3Label: "Uptime guarantee",
    stat4Value: "24h",
    stat4Label: "Free trial",
    stepsEyebrow: "How to get your IPTV",
    stepsTitle: "3 Easy Steps to Start Streaming",
    stepsSubtitle:
      "Quick activation, no long contracts, and 24/7 UK support on every plan.",
    step1Title: "Choose Your Plan",
    step1Body:
      "Pick standard or premium iptv subscription with 25,000+ live channels in 4K. Best iptv uk plans for London, Manchester, Birmingham, Glasgow, and nationwide.",
    step2Title: "Complete Your Order",
    step2Body:
      "Secure checkout in GBP with instant activation. Popular 12-month iptv uk packages offer the best value — Firestick and multi-screen options available.",
    step3Title: "Start Watching",
    step3Body:
      "Receive login details by email, install IPTV Smarters Pro or your player, and enjoy Premier League, sports, films, and UK channels on all your devices.",
    ctaPlans: "View GBP plans",
    ctaTrial: "Get free trial",
  };

  uk.ukKeywords = {
    title: "IPTV UK — search topics & guides",
    subtitle:
      "Explore iptv uk, best iptv uk, iptv subscription, iptv fire stick uk, mag box iptv, british iptv, and hundreds of UK IPTV topics below.",
    expandLabel: "Show all topics",
    collapseLabel: "Hide topics",
  };

  uk.pricing = {
    ...uk.pricing,
    title: "IPTV Subscription Plans UK",
    subtitle:
      "Choose your ideal iptv uk plan — 25,000+ channels, 4K streaming, instant activation, and UK support. No contracts.",
    currencyCode: "GBP",
    plan3MonthsPrice: "£14.99",
    plan6MonthsPrice: "£19.99",
    plan12MonthsPrice: "£32.99",
    plan24MonthsPrice: "£44.99",
    plan3MonthsPremiumPrice: "£22.99",
    plan6MonthsPremiumPrice: "£29.99",
    plan12MonthsPremiumPrice: "£49.99",
    plan24MonthsPremiumPrice: "£74.99",
    currencyNote: "",
  };

  return uk;
}

function copyBlockToUk(block, from = "en") {
  const next = { ...block };

  if (typeof block.content === "string") {
    const v = localizeForUk(block.content);
    next.content = { en: block.content, ca: block.content, uk: v, es: block.content, fr: block.content };
  } else if (block.content && typeof block.content === "object") {
    const source = String(block.content[from] || block.content.ca || block.content.en || "").trim();
    next.content = { ...block.content, uk: localizeForUk(source) };
  }

  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      const items = block.listItems.map((i) => localizeForUk(String(i)));
      next.listItems = { en: block.listItems, ca: block.listItems, uk: items, es: block.listItems, fr: block.listItems };
    } else {
      const source = block.listItems[from] || block.listItems.ca || block.listItems.en || [];
      next.listItems = { ...block.listItems, uk: source.map((i) => localizeForUk(String(i))) };
    }
  }

  if (block.imageAlt) {
    if (typeof block.imageAlt === "string") {
      next.imageAlt = { en: block.imageAlt, ca: block.imageAlt, uk: localizeForUk(block.imageAlt), es: block.imageAlt, fr: block.imageAlt };
    } else {
      const source = String(block.imageAlt[from] || block.imageAlt.ca || "");
      next.imageAlt = { ...block.imageAlt, uk: localizeForUk(source) };
    }
  }

  return next;
}

// --- uk.json ---
const caJson = JSON.parse(readFileSync(join(ROOT, "lib/i18n/translations/ca.json"), "utf8"));
const ukJson = transformCaJsonToUk(caJson);
writeFileSync(join(ROOT, "lib/i18n/translations/uk.json"), JSON.stringify(ukJson, null, 2) + "\n", "utf8");
console.log("Wrote lib/i18n/translations/uk.json");

// --- metadata ---
const caMeta = JSON.parse(readFileSync(join(ROOT, "data/metadata/ca.json"), "utf8"));
const ukMeta = JSON.parse(
  JSON.stringify(caMeta)
    .replace(/Canada/g, "UK")
    .replace(/Canadian/g, "British")
    .replace(/CAD/g, "GBP")
    .replace(/Quebec/g, "Scotland")
    .replace(/Ontario/g, "England")
);
ukMeta.homepage.title = "Best IPTV UK 2026 | 25,000+ Channels | 24h Free Trial | GBP";
ukMeta.homepage.description =
  "Best IPTV UK service: 25,000+ live channels, 120,000+ films, 4K sports, 99.9% uptime. iptv uk, fire stick iptv, iptv subscription in GBP — free trial, no contract.";
writeFileSync(join(ROOT, "data/metadata/uk.json"), JSON.stringify(ukMeta, null, 2) + "\n", "utf8");
console.log("Wrote data/metadata/uk.json");

// --- uk hub visible (subset) ---
const ukHubKeywords = [
  { label: "IPTV UK", keyword: "iptv uk" },
  { label: "Best IPTV UK", keyword: "best iptv uk" },
  { label: "IPTV subscription UK", keyword: "iptv subscription uk" },
  { label: "IPTV Fire Stick UK", keyword: "iptv fire stick uk" },
  { label: "British IPTV", keyword: "british iptv" },
  { label: "IPTV London", keyword: "iptv london" },
  { label: "IPTV Manchester", keyword: "iptv manchester" },
  { label: "IPTV Scotland", keyword: "iptv scotland" },
  { label: "Mag box IPTV", keyword: "mag box iptv" },
  { label: "IPTV Smarters UK", keyword: "iptv smarters uk" },
  { label: "UK IPTV provider", keyword: "uk iptv provider" },
  { label: "IPTV for UK", keyword: "iptv for uk" },
];
writeFileSync(
  join(ROOT, "data/seo/uk-hub-visible.json"),
  JSON.stringify({ keywords: ukHubKeywords }, null, 2) + "\n",
  "utf8"
);
console.log("Wrote data/seo/uk-hub-visible.json");

// --- keyword corpus uk slice ---
const corpusPath = join(ROOT, "data/seo/keyword-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8"));
if (!corpus.uk) {
  const base = corpus.ca || corpus.en || [];
  corpus.uk = base.map((p) =>
    String(p)
      .replace(/Canada/gi, "UK")
      .replace(/Canadian/gi, "British")
      .replace(/Quebec/gi, "Scotland")
      .replace(/Ontario/gi, "England")
      .replace(/Toronto/gi, "London")
      .replace(/Montreal/gi, "Manchester")
      .replace(/Vancouver/gi, "Birmingham")
      .replace(/CAD/gi, "GBP")
  );
  writeFileSync(corpusPath, JSON.stringify(corpus) + "\n", "utf8");
  console.log("Added uk to keyword-corpus.json");
}

// --- blogs ---
const blogs = JSON.parse(readFileSync(join(ROOT, "data/blogs.json"), "utf8"));
let updated = 0;
for (const blog of blogs) {
  if (!BLOG_IDS.has(blog.id)) continue;

  const translations = new Set([...(blog.translations || []), "uk"]);
  blog.translations = [...translations];

  const titleEn = typeof blog.title === "string" ? blog.title : blog.title?.en || blog.title?.ca || "";
  const excerptEn =
    typeof blog.excerpt === "string" ? blog.excerpt : blog.excerpt?.en || blog.excerpt?.ca || "";

  if (typeof blog.slug === "string") {
    blog.slug = { en: blog.slug, ca: blog.slug, uk: blog.slug, es: blog.slug, fr: blog.slug };
  } else if (blog.slug) {
    blog.slug = { ...blog.slug, uk: blog.slug.uk || blog.slug.en || blog.slug.ca || "" };
  }

  blog.title =
    typeof blog.title === "string"
      ? { en: blog.title, ca: blog.title, uk: ukTitle(blog.title), es: blog.title, fr: blog.title }
      : { ...blog.title, uk: blog.title.uk || ukTitle(titleEn) };

  blog.excerpt =
    typeof blog.excerpt === "string"
      ? { en: blog.excerpt, ca: blog.excerpt, uk: localizeForUk(blog.excerpt), es: blog.excerpt, fr: blog.excerpt }
      : { ...blog.excerpt, uk: blog.excerpt.uk || localizeForUk(excerptEn) };

  if (blog.meta?.description) {
    const descEn = typeof blog.meta.description === "string" ? blog.meta.description : blog.meta.description.en || "";
    blog.meta.description =
      typeof blog.meta.description === "string"
        ? { en: blog.meta.description, ca: blog.meta.description, uk: localizeForUk(blog.meta.description), es: blog.meta.description, fr: blog.meta.description }
        : { ...blog.meta.description, uk: blog.meta.description.uk || localizeForUk(descEn) };
  }

  blog.blocks = (blog.blocks || []).map((b) => copyBlockToUk(b, blog.title?.ca ? "ca" : "en"));
  updated++;
}
writeFileSync(join(ROOT, "data/blogs.json"), JSON.stringify(blogs, null, 2) + "\n", "utf8");
console.log(`Updated ${updated} blogs with uk locale`);
