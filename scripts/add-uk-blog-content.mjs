/**
 * Add UK locale + proper English body copy for high-value blog posts.
 * Preserves existing FR/ES block copy when replacing EN/UK guides.
 * Usage: node scripts/add-uk-blog-content.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_PATH = join(__dirname, "../data/blogs.json");
const UK = "https://www.pro-iptvsmarters.com/uk/";
const EN = "https://www.pro-iptvsmarters.com/en/";

function localizeForUk(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/https:\/\/www\.pro-iptvsmarters\.com\/ca\//gi, UK)
    .replace(/https:\/\/www\.pro-iptvsmarters\.com\/en\//gi, UK)
    .replace(/www\.pro-iptvsmarters\.com\/ca\//gi, "www.pro-iptvsmarters.com/uk/")
    .replace(/www\.pro-iptvsmarters\.com\/en\//gi, "www.pro-iptvsmarters.com/uk/")
    .replace(/\/ca\/#/g, "/uk/#")
    .replace(/\/en\/#/g, "/uk/#")
    .replace(/\bUnited States\b/gi, "United Kingdom")
    .replace(/\bUS viewers\b/gi, "UK viewers")
    .replace(/\bUSD\b/g, "GBP")
    .replace(/\$\d+/g, (m) => m.replace("$", "£"))
    .replace(/\bcolor\b/gi, "colour")
    .replace(/\bfavorite\b/gi, "favourite")
    .replace(/\bcenter\b/gi, "centre")
    .replace(/\bIPTV subscription\b/gi, "iptv subscription")
    .replace(/\bBest IPTV\b/g, "best iptv uk")
    .replace(/\bIPTV UK service\b/gi, "british iptv service");
}

function ukTitle(titleEn) {
  const t = localizeForUk(titleEn);
  if (/\bIPTV UK\b/i.test(t) || /\| IPTV UK\b/i.test(t)) return t;
  if (/^IPTV /i.test(t)) return t.replace(/^IPTV /i, "IPTV UK: ");
  return `${t} | IPTV UK`;
}

function emptyMap() {
  return { en: "", ca: "", uk: "", es: "", fr: "" };
}

function copyBlockToUk(block, from = "en") {
  const next = { ...block };
  if (typeof block.content === "string") {
    const v = localizeForUk(block.content);
    next.content = { en: block.content, ca: "", uk: v, es: "", fr: "" };
  } else if (block.content && typeof block.content === "object") {
    const source = String(block.content[from] || "").trim();
    next.content = { ...emptyMap(), ...block.content, uk: localizeForUk(source) };
  }
  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      const items = block.listItems.map((i) => localizeForUk(String(i)));
      next.listItems = { en: block.listItems, ca: [], uk: items, es: [], fr: [] };
    } else {
      const source = block.listItems[from] || [];
      next.listItems = { ...block.listItems, uk: source.map((i) => localizeForUk(String(i))) };
    }
  }
  if (block.imageAlt) {
    if (typeof block.imageAlt === "string") {
      next.imageAlt = { en: block.imageAlt, ca: "", uk: localizeForUk(block.imageAlt), es: "", fr: "" };
    } else {
      const source = String(block.imageAlt[from] || "");
      next.imageAlt = { ...block.imageAlt, uk: localizeForUk(source) };
    }
  }
  return next;
}

function mergeLocaleFields(blog, locale, fields) {
  blog.title = { ...emptyMap(), ...blog.title, [locale]: fields.title };
  blog.excerpt = { ...emptyMap(), ...blog.excerpt, [locale]: fields.excerpt };
  if (!blog.meta) blog.meta = {};
  blog.meta.description = { ...emptyMap(), ...blog.meta.description, [locale]: fields.metaDescription };
  blog.meta.keywords = { ...emptyMap(), ...blog.meta.keywords, [locale]: fields.keywords || "" };
  if (typeof blog.slug !== "object") {
    blog.slug = { en: blog.slug, ca: "", uk: "", es: "", fr: "" };
  }
  blog.slug = { ...emptyMap(), ...blog.slug, [locale]: fields.slug };
}

function addUkFromEn(blog) {
  const titleEn = blog.title?.en || "";
  const excerptEn = blog.excerpt?.en || "";
  const descEn = blog.meta?.description?.en || excerptEn;
  const slugEn =
    typeof blog.slug === "string" ? blog.slug : blog.slug?.en || "";

  mergeLocaleFields(blog, "uk", {
    title: ukTitle(titleEn),
    excerpt: localizeForUk(excerptEn),
    metaDescription: localizeForUk(descEn),
    keywords: blog.meta?.keywords?.en || "",
    slug: slugEn,
  });

  blog.blocks = (blog.blocks || []).map((b) => copyBlockToUk(b, "en"));
  blog.translations = [...new Set([...(blog.translations || []), "uk"])];
}

function buildBlocks(template, featuredImage, imageAlt) {
  const blocks = [];
  for (const item of template) {
    if (item.type === "image") {
      blocks.push({
        id: item.id,
        type: "image",
        content: emptyMap(),
        imageUrl: featuredImage,
        imageAlt: { en: imageAlt, uk: imageAlt, ca: "", es: "", fr: "" },
        imageAlign: "center",
      });
      continue;
    }
    const block = {
      id: item.id,
      type: item.type,
      content: {
        en: item.en,
        uk: item.uk || localizeForUk(item.en),
        ca: "",
        es: "",
        fr: "",
      },
    };
    if (item.level) block.level = item.level;
    if (item.listItems) {
      block.listItems = {
        en: item.listItems,
        uk: item.listItemsUk || item.listItems.map((i) => localizeForUk(i)),
        ca: [],
        es: [],
        fr: [],
      };
    }
    blocks.push(block);
  }
  return blocks;
}

function applyEnglishAndUk(blog, config, legacyBlocks = []) {
  mergeLocaleFields(blog, "en", config.en);
  mergeLocaleFields(blog, "uk", config.uk);
  const newBlocks = buildBlocks(config.blocks, blog.featuredImage, config.imageAlt);
  // Keep legacy FR/ES sections below the new EN/UK article
  blog.blocks = [...newBlocks, ...legacyBlocks];
  blog.translations = [...new Set([...(blog.translations || []), "en", "uk"])];
  blog.updatedAt = new Date().toISOString();
}

const LINK = `${UK}#pricing`;

const FIRESTICK_BLOCKS = [
  {
    id: "fs-h1",
    type: "heading",
    level: 3,
    en: "Best IPTV Player for Fire Stick UK 2026: Full Comparison & Setup Guide",
  },
  { id: "fs-img", type: "image" },
  {
    id: "fs-p1",
    type: "paragraph",
    en: `Choosing the best IPTV player for Fire Stick UK is essential for smooth, stable streaming. A good player reduces buffering, keeps EPG data readable, and makes it easy to switch between live TV, VOD, and catch-up content. This guide compares the top Fire Stick IPTV apps for British viewers in 2026.`,
  },
  {
    id: "fs-h2",
    type: "heading",
    level: 4,
    en: "Key takeaways",
  },
  {
    id: "fs-l1",
    type: "list",
    listItems: [
      "IPTV Smarters Pro and TiviMate are the most popular Fire Stick players in the UK",
      "M3U and Xtream Codes support is required for most british iptv providers",
      "Stable servers matter more than app design for Premier League and live sports",
      "Use a wired connection or 5 GHz Wi‑Fi for 4K streams on Fire TV Stick 4K",
      "Always pair your player with a reliable iptv subscription from a trusted provider",
    ],
  },
  {
    id: "fs-h3",
    type: "heading",
    level: 4,
    en: "What is an IPTV player on Fire Stick?",
  },
  {
    id: "fs-p2",
    type: "paragraph",
    en: `An IPTV player is an app that reads live TV streams from an [iptv subscription](${LINK}) using M3U playlists or Xtream Codes login details. On Amazon Fire Stick, the player handles channel lists, EPG guides, favourites, and playback quality — it does not include channels by itself.`,
  },
  {
    id: "fs-h4",
    type: "heading",
    level: 5,
    en: "IPTV Smarters Pro — best all-round for UK households",
  },
  {
    id: "fs-p3",
    type: "paragraph",
    en: `[IPTV Smarters Pro](${LINK}) is the most widely used iptv smarters player on Fire Stick in the United Kingdom. It supports M3U URLs, Xtream login, multiple profiles, parental controls, and works well on Fire TV Stick Lite, 4K, and 4K Max. Setup takes a few minutes once you have login details from your iptv providers.`,
  },
  {
    id: "fs-h5",
    type: "heading",
    level: 5,
    en: "TiviMate — best for power users",
  },
  {
    id: "fs-p4",
    type: "paragraph",
    en: "TiviMate offers advanced EPG layout, recording options, and fast channel zapping. It suits experienced users who want a TV-style interface. You still need a valid united kingdom iptv subscription — the app only plays the streams your provider supplies.",
  },
  {
    id: "fs-h6",
    type: "heading",
    level: 4,
    en: "How to install IPTV on Fire Stick UK",
  },
  {
    id: "fs-l2",
    type: "list",
    listItems: [
      "Enable Apps from Unknown Sources in Fire Stick settings (for sideloaded players)",
      "Install Downloader or use the Amazon Appstore when available",
      "Download IPTV Smarters Pro or your chosen iptv smarters player",
      "Enter M3U link or Xtream username, password, and server URL from your provider",
      "Restart the app and test a UK live channel before buying a long plan",
    ],
  },
  {
    id: "fs-p5",
    type: "paragraph",
    en: `For step-by-step photos, see our [Fire Stick installation guide](${UK}iptv-installation-firestick/). Most best iptv uk plans activate instantly and work on multiple devices under one iptv with subscription.`,
  },
];

const FOOTBALL_BLOCKS = [
  {
    id: "fb-h1",
    type: "heading",
    level: 2,
    en: "Premier League IPTV UK 2026: Watch Football in 4K Without Buffering",
  },
  {
    id: "fb-p1",
    type: "paragraph",
    en: `The 2025/26 season brings Premier League, FA Cup, Champions League, and Europa League action to millions of UK fans. If you want live football in HD or 4K without expensive satellite bundles, a quality [iptv subscription](${LINK}) on Fire Stick, Smart TV, or mag box iptv is the flexible option British viewers use most.`,
  },
  {
    id: "fb-h2",
    type: "heading",
    level: 3,
    en: "Why UK fans choose IPTV for football",
  },
  {
    id: "fb-l1",
    type: "list",
    listItems: [
      "Premier League, Championship, and European matches in one place",
      "Sports channels in HD and 4K with stable EPG",
      "Works on Fire Stick, Android TV, Smart TV, phones, and tablets",
      "GBP plans with instant activation — no long Sky-style contracts",
      "24/7 support when you use a trusted british iptv provider",
    ],
  },
  {
    id: "fb-h3",
    type: "heading",
    level: 3,
    en: "Best setup for match day",
  },
  {
    id: "fb-p2",
    type: "paragraph",
    en: `Install [IPTV Smarters Pro](${LINK}) or your preferred player, add your login from a verified iptv providers account, and pin sports categories to favourites. Use Ethernet or 5 GHz Wi‑Fi for 4K kick-offs. A 12-month best iptv uk plan usually offers the best value for football fans who watch every week.`,
  },
  {
    id: "fb-h4",
    type: "heading",
    level: 3,
    en: "Compatible devices in the United Kingdom",
  },
  {
    id: "fb-l2",
    type: "list",
    listItems: [
      "Amazon Fire TV Stick (all generations)",
      "Samsung & LG Smart TV apps",
      "Android TV and Google TV boxes",
      "Windows PC and Mac via IPTV players",
      "iPhone and iPad with supported apps",
    ],
  },
  {
    id: "fb-p3",
    type: "paragraph",
    en: `Compare [GBP plans and free trial options](${LINK}) before kick-off. united kingdom iptv services with 99.9% uptime and anti-freeze servers make the biggest difference during live Premier League matches.`,
  },
];

const FOURK_BLOCKS = [
  {
    id: "4k-h1",
    type: "heading",
    level: 3,
    en: "IPTV 4K UK 2026: Ultra HD Streaming Without Buffering",
  },
  { id: "4k-img", type: "image" },
  {
    id: "4k-p1",
    type: "paragraph",
    en: `4K IPTV delivers sharper sports, films, and live channels when your provider, player, and internet connection work together. In 2026, British viewers expect stable Ultra HD streams — not just a 4K label in the channel list. This guide explains how to get real iptv 4K quality in the UK.`,
  },
  {
    id: "4k-h2",
    type: "heading",
    level: 4,
    en: "What you need for 4K IPTV in the UK",
  },
  {
    id: "4k-l1",
    type: "list",
    listItems: [
      "Minimum 25 Mbps stable download speed (40+ Mbps recommended for 4K)",
      "Fire TV Stick 4K, Android TV box, or Smart TV with HEVC support",
      "Premium iptv subscription with 4K sports and movie channels",
      "Wired Ethernet or 5 GHz Wi‑Fi to reduce buffering",
      "Updated iptv smarters player or TiviMate app",
    ],
  },
  {
    id: "4k-h3",
    type: "heading",
    level: 4,
    en: "Tips to avoid buffering on 4K streams",
  },
  {
    id: "4k-p2",
    type: "paragraph",
    en: `Choose a [best iptv uk](${LINK}) plan with anti-freeze servers and UK/EU peering. Close background downloads during live events. If a channel stutters, switch to the HD backup feed — most iptv providers offer duplicate bitrates.`,
  },
  {
    id: "4k-h4",
    type: "heading",
    level: 4,
    en: "Recommended players for 4K",
  },
  {
    id: "4k-p3",
    type: "paragraph",
    en: `IPTV Smarters Pro and TiviMate both handle 4K HEVC on supported Fire Stick and Android TV devices. Pair them with a legitimate united kingdom iptv login from your subscription email.`,
  },
];

const PREMIUM_BLOCKS = [
  {
    id: "pr-h1",
    type: "heading",
    level: 3,
    en: "Premium IPTV UK 2026: How to Choose the Best Service",
  },
  { id: "pr-img", type: "image" },
  {
    id: "pr-p1",
    type: "paragraph",
    en: `The british iptv market grows every year, and more UK viewers want a premium iptv experience: stable live TV, 4K sports, huge VOD libraries, and fast support. With so many iptv providers advertising online, here is a practical checklist before you buy an iptv with subscription.`,
  },
  {
    id: "pr-h2",
    type: "heading",
    level: 4,
    en: "What premium IPTV should include",
  },
  {
    id: "pr-l1",
    type: "list",
    listItems: [
      "25,000+ live channels including UK, US, and international packages",
      "HD and 4K sports with reliable match-day uptime",
      "VOD library with films and series updated weekly",
      "M3U and Xtream Codes for IPTV Smarters, TiviMate, and Smart TV",
      "Instant activation and GBP checkout",
      "Free trial or short plan to test before committing",
    ],
  },
  {
    id: "pr-h3",
    type: "heading",
    level: 4,
    en: "Red flags to avoid",
  },
  {
    id: "pr-l2",
    type: "list",
    listItems: [
      "No trial and no support contact",
      "Prices far below market with “lifetime” promises",
      "Constant buffering on popular UK channels during peak hours",
      "Login details that stop working after a few days",
      "Apps that ask for unrelated permissions or card details",
    ],
  },
  {
    id: "pr-p2",
    type: "paragraph",
    en: `StreamPro IPTV UK offers transparent [GBP plans](${LINK}), iptv smarters player setup/backend login, and 24/7 WhatsApp support. Compare standard and premium tiers, start with a trial, and scale to multi-device best iptv uk packages when you are satisfied.`,
  },
];

const POST_CONFIG = {
  "5gqx1dw3uvg": { mode: "fromEn" },
  "97yqs2im1nm": {
    mode: "englishUk",
    imageAlt: "Best IPTV player for Fire Stick UK",
    en: {
      title: "Best IPTV Player for Fire Stick UK 2026: Comparison & Setup Guide",
      excerpt:
        "Compare IPTV Smarters Pro, TiviMate, and other Fire Stick players for UK streaming. Installation tips, M3U/Xtream setup, and how to pick the best iptv uk plan.",
      metaDescription:
        "Best IPTV player for Fire Stick UK 2026. Compare Smarters Pro vs TiviMate, setup M3U/Xtream, and pair with a reliable british iptv subscription.",
      keywords:
        "iptv fire stick uk, iptv smarters player, best iptv uk, fire stick iptv, iptv providers, iptv subscription",
      slug: "best-iptv-player-fire-stick-uk",
    },
    uk: {
      title: "Best IPTV Player for Fire Stick UK 2026: Comparison & Setup Guide | IPTV UK",
      excerpt:
        "Compare IPTV Smarters Pro, TiviMate, and Fire Stick players for united kingdom iptv. Setup guide, M3U/Xtream tips, and best iptv uk plans in GBP.",
      metaDescription:
        "Best IPTV player for Fire Stick UK. iptv smarters player vs TiviMate, british iptv setup, and iptv with subscription plans in GBP.",
      keywords:
        "iptv fire stick uk, iptv smarters player, best iptv uk, british iptv, iptv providers, united kingdom iptv",
      slug: "best-iptv-player-fire-stick-uk",
    },
    blocks: FIRESTICK_BLOCKS,
  },
  ykvd0xjlbp: {
    mode: "englishUk",
    imageAlt: "Premier League IPTV UK",
    en: {
      title: "Premier League IPTV UK 2026: Watch Football in 4K",
      excerpt:
        "Watch Premier League, Champions League, and UK football in 4K with IPTV. Device guide, best subscriptions, and tips for stable match-day streaming.",
      metaDescription:
        "Premier League IPTV UK 2026 guide. Stream football in 4K on Fire Stick and Smart TV with a trusted iptv subscription.",
      keywords:
        "premier league iptv, iptv uk, iptv subscription, iptv fire stick uk, best iptv uk, football streaming uk",
      slug: "premier-league-iptv-uk-2026",
    },
    uk: {
      title: "Premier League IPTV UK 2026: Watch Football in 4K | IPTV UK",
      excerpt:
        "Stream Premier League and European football in 4K with united kingdom iptv. Fire Stick, Smart TV setup, and best iptv uk GBP plans.",
      metaDescription:
        "Premier League IPTV UK — british iptv football guide for 2026. 4K streams, iptv smarters player setup, iptv with subscription in GBP.",
      keywords:
        "premier league iptv uk, british iptv, iptv uk, best iptv uk, iptv providers, united kingdom iptv",
      slug: "premier-league-iptv-uk-2026",
    },
    blocks: FOOTBALL_BLOCKS,
  },
  rsq02eo1t1n: {
    mode: "englishUk",
    imageAlt: "IPTV 4K UK streaming",
    en: {
      title: "IPTV 4K UK 2026: Ultra HD Streaming Guide Without Buffering",
      excerpt:
        "Get true 4K IPTV quality in the UK. Internet speed tips, best players, anti-buffer settings, and how to choose a premium iptv subscription.",
      metaDescription:
        "IPTV 4K UK 2026 guide — Ultra HD streaming on Fire Stick and Smart TV with stable british iptv servers.",
      keywords: "4k iptv uk, iptv uk, best iptv uk, iptv subscription, iptv smarters player, hd iptv",
      slug: "iptv-4k-uk-ultra-hd-guide",
    },
    uk: {
      title: "IPTV 4K UK 2026: Ultra HD Streaming Without Buffering | IPTV UK",
      excerpt:
        "True 4K united kingdom iptv — speeds, players, and iptv providers that deliver stable Ultra HD in the UK.",
      metaDescription:
        "IPTV 4K UK guide for british iptv viewers. best iptv uk plans, iptv smarters player tips, iptv with subscription in GBP.",
      keywords: "4k iptv uk, united kingdom iptv, best iptv uk, iptv providers, iptv subscription, british iptv",
      slug: "iptv-4k-uk-ultra-hd-guide",
    },
    blocks: FOURK_BLOCKS,
  },
  m1b89vqyj9i: {
    mode: "englishUk",
    imageAlt: "Premium IPTV UK service",
    en: {
      title: "Premium IPTV UK 2026: Ultimate Guide to Choosing the Best Service",
      excerpt:
        "How to pick a premium IPTV service in the UK. Compare channels, 4K sports, VOD, pricing in GBP, and avoid unreliable providers.",
      metaDescription:
        "Premium IPTV UK 2026 — choose the best british iptv service with stable servers, 4K sports, and instant GBP activation.",
      keywords:
        "premium iptv uk, best iptv uk, iptv providers, iptv subscription, british iptv, united kingdom iptv",
      slug: "premium-iptv-uk-guide",
    },
    uk: {
      title: "Premium IPTV UK 2026: Ultimate Guide to Choosing the Best Service | IPTV UK",
      excerpt:
        "Choose premium united kingdom iptv with confidence — channels, 4K, VOD, GBP pricing, and trusted iptv providers.",
      metaDescription:
        "Premium IPTV UK guide — best iptv uk, iptv with subscription, iptv smarters player ready, british iptv checklist.",
      keywords:
        "premium iptv uk, best iptv uk, iptv providers, british iptv, iptv subscription, united kingdom iptv",
      slug: "premium-iptv-uk-guide",
    },
    blocks: PREMIUM_BLOCKS,
  },
};

let legacyBlogs = [];
try {
  legacyBlogs = JSON.parse(
    execSync("git show HEAD:data/blogs.json", {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    })
  );
} catch {
  console.warn("Could not read HEAD blogs.json — FR/ES legacy blocks will not be merged.");
}

const blogs = JSON.parse(readFileSync(BLOGS_PATH, "utf8"));
let updated = 0;

for (const blog of blogs) {
  const config = POST_CONFIG[blog.id];
  if (!config) continue;

  if (config.mode === "fromEn") {
    addUkFromEn(blog);
    blog.updatedAt = new Date().toISOString();
  } else if (config.mode === "englishUk") {
    const legacy = legacyBlogs.find((b) => b.id === blog.id);
    applyEnglishAndUk(blog, config, legacy?.blocks || []);
  }

  updated++;
  console.log(
    `Updated: ${blog.id} — ${blog.title.en?.slice(0, 55)}… (${blog.blocks.length} blocks, +${legacyBlocks.length} legacy)`
  );
}

writeFileSync(BLOGS_PATH, JSON.stringify(blogs, null, 2) + "\n", "utf8");
console.log(`\nDone. ${updated} posts now have English body copy and UK locale.`);
