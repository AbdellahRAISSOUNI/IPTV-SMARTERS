/**
 * Copy English blog content to Canada (ca) for selected posts.
 * Skips ES-only, FR-only, and France/Spain–focused articles.
 *
 * Usage: node scripts/migrate-blogs-to-ca.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_PATH = join(__dirname, "../data/blogs.json");

/** Posts with real English copy worth showing on /ca/ (excludes FR/ES-market titles). */
const INCLUDE_BLOG_IDS = new Set([
  "ymhtymv24u", // M3U List Explained (English)
  "kr6i8ax5yol", // VLC M3U guide (English)
  "3q2vg4ltwr", // Top OTT Player 2026 (English)
  "6gyp2fra1v8", // Smarters vs other players (English)
  "rikp3jx9gt", // IPTV Smarters Pro ultimate guide (English)
  "juy47i611gi", // IPTV Code / choose provider (English)
  "b40wqijyjnl", // Everything about Smarters Player (English)
  "34izr6ai49j", // Essential benefits IPTV player (English)
]);

const LOCALES = ["en", "ca", "es", "fr"];

function emptyMap() {
  return { en: "", ca: "", es: "", fr: "" };
}

function getText(map, locale) {
  if (!map) return "";
  return String(map[locale] || "").trim();
}

function localizeForCanada(text) {
  if (!text || typeof text !== "string") return text;
  return (
    text
      .replace(/https:\/\/www\.pro-iptvsmarters\.com\/en\//gi, "https://www.pro-iptvsmarters.com/ca/")
      .replace(/www\.pro-iptvsmarters\.com\/en\//gi, "www.pro-iptvsmarters.com/ca/")
      .replace(/\/en\/#/g, "/ca/#")
      .replace(/\bIPTV subscription\b/gi, "IPTV subscription in Canada")
      .replace(/\bBest IPTV\b/g, "Best IPTV Canada")
      .replace(/\bIPTV service\b/gi, "IPTV Canada service")
      // Avoid double "Canada Canada"
      .replace(/IPTV Canada service in Canada/gi, "IPTV Canada service")
      .replace(/Best IPTV Canada Canada/g, "Best IPTV Canada")
  );
}

function canadaTitle(titleEn) {
  const t = localizeForCanada(titleEn);
  if (/\bcanada\b/i.test(t)) return t;
  if (/^IPTV /i.test(t)) return t.replace(/^IPTV /i, "IPTV Canada: ");
  return `${t} | IPTV Canada`;
}

function canadaExcerpt(excerptEn) {
  return localizeForCanada(excerptEn);
}

function copyBlockToCa(block, from = "en") {
  const next = { ...block };

  if (typeof block.content === "string") {
    const v = localizeForCanada(block.content);
    next.content = { en: block.content, ca: v, es: block.content, fr: block.content };
  } else if (block.content && typeof block.content === "object") {
    const source = String(block.content[from] || "").trim();
    next.content = {
      ...block.content,
      ca: localizeForCanada(source),
    };
  }

  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      const items = block.listItems.map((i) => localizeForCanada(String(i)));
      next.listItems = {
        en: [...block.listItems],
        ca: items,
        es: [...block.listItems],
        fr: [...block.listItems],
      };
    } else {
      const source = block.listItems[from] || [];
      next.listItems = {
        ...block.listItems,
        ca: source.map((i) => localizeForCanada(String(i))),
      };
    }
  }

  if (block.imageAlt) {
    if (typeof block.imageAlt === "string") {
      next.imageAlt = {
        en: block.imageAlt,
        ca: block.imageAlt,
        es: block.imageAlt,
        fr: block.imageAlt,
      };
    } else {
      const source = String(block.imageAlt[from] || "").trim();
      next.imageAlt = { ...block.imageAlt, ca: source || block.imageAlt.ca || "" };
    }
  }

  return next;
}

function migrateBlog(blog) {
  const enSlug = getText(
    typeof blog.slug === "string" ? { en: blog.slug } : blog.slug,
    "en"
  );
  if (!enSlug || !getText(blog.title, "en")) {
    return { blog, skipped: true, reason: "no English slug/title" };
  }

  const title = { ...emptyMap(), ...blog.title };
  const excerpt = { ...emptyMap(), ...blog.excerpt };
  const description = { ...emptyMap(), ...(blog.meta?.description || {}) };
  const keywords = { ...emptyMap(), ...(blog.meta?.keywords || {}) };

  title.ca = canadaTitle(title.en);
  excerpt.ca = canadaExcerpt(excerpt.en);
  description.ca = canadaExcerpt(description.en || excerpt.en);
  keywords.ca = keywords.en || "";

  let slug =
    typeof blog.slug === "string"
      ? { en: blog.slug, ca: blog.slug, es: blog.slug, fr: blog.slug }
      : { ...emptyMap(), ...blog.slug };
  slug.ca = slug.en || enSlug;

  const blocks = (blog.blocks || []).map((block) => copyBlockToCa(block, "en"));

  const translations = Array.from(
    new Set([...(blog.translations || []).filter((l) => LOCALES.includes(l)), "ca"])
  );

  return {
    blog: {
      ...blog,
      slug,
      title,
      excerpt,
      blocks,
      meta: {
        ...blog.meta,
        description,
        keywords,
      },
      translations,
      updatedAt: new Date().toISOString(),
    },
    skipped: false,
  };
}

function main() {
  const blogs = JSON.parse(readFileSync(BLOGS_PATH, "utf8"));
  let updated = 0;
  const report = [];

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    if (!INCLUDE_BLOG_IDS.has(blog.id)) continue;

    const result = migrateBlog(blog);
    if (result.skipped) {
      report.push({ id: blog.id, status: "skipped", reason: result.reason });
      continue;
    }
    blogs[i] = result.blog;
    updated++;
    report.push({
      id: blog.id,
      status: "ok",
      caTitle: result.blog.title.ca?.slice(0, 60),
      caSlug: result.blog.slug.ca,
    });
  }

  writeFileSync(BLOGS_PATH, `${JSON.stringify(blogs, null, 2)}\n`, "utf8");

  console.log(`Updated ${updated} blog(s) with Canada (ca) locale.\n`);
  for (const row of report) {
    console.log(row);
  }
}

main();
