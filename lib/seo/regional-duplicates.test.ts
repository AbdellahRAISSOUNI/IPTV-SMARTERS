import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { BlogPost } from "@/lib/admin/blog-shared";
import {
  consolidateRegionalUrl,
  isRegionalBlogDuplicate,
  withoutRegionalAlternates,
} from "@/lib/seo/regional-duplicates";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";

const baseUrl = "https://www.pro-iptvsmarter.com";
const blogs = JSON.parse(readFileSync(join(process.cwd(), "data/blogs.json"), "utf8")) as BlogPost[];

describe("regional duplicates", () => {
  it("points ca/uk URLs at /en/ and leaves other locales alone", () => {
    expect(consolidateRegionalUrl("ca", `${baseUrl}/ca/privacy-policy/`)).toBe(`${baseUrl}/en/privacy-policy/`);
    expect(consolidateRegionalUrl("uk", "/uk/iptv-installation-ios/")).toBe("/en/iptv-installation-ios/");
    expect(consolidateRegionalUrl("en", "/en/x/")).toBe("/en/x/");
    expect(consolidateRegionalUrl("fr", "/fr/x/")).toBe("/fr/x/");
  });

  it("removes en-CA / en-GB from hreflang maps", () => {
    const out = withoutRegionalAlternates({
      "en-US": "a", "en-CA": "b", "en-GB": "c", "fr-FR": "d", "x-default": "a",
    });
    expect(Object.keys(out!)).toEqual(["en-US", "fr-FR", "x-default"]);
  });

  it("flags regional posts that repeat the English text", () => {
    const post = blogs.find((b) => (b.slug as Record<string, string>).en === "iptv-smarters-pro-vs-other-iptv-players")!;
    expect(isRegionalBlogDuplicate(post, "ca")).toBe(true);
    expect(isRegionalBlogDuplicate(post, "uk")).toBe(true);
    expect(isRegionalBlogDuplicate(post, "en")).toBe(false);
    expect(isRegionalBlogDuplicate(post, "fr")).toBe(false);
  });

  it("keeps duplicate regional URLs out of the sitemap and hreflang", () => {
    const entries = buildSitemapEntries(baseUrl, blogs);
    const urls = entries.map((e) => e.url);
    for (const slug of ["privacy-policy", "terms-of-service", "refund-policy", "iptv-installation-ios", "iptv-reseller-program"]) {
      expect(urls).toContain(`${baseUrl}/en/${slug}/`);
      expect(urls).not.toContain(`${baseUrl}/ca/${slug}/`);
      expect(urls).not.toContain(`${baseUrl}/uk/${slug}/`);
    }
    expect(urls).toContain(`${baseUrl}/ca/blog/`);
    expect(urls).toContain(`${baseUrl}/uk/blog/`);
    expect(urls).not.toContain(`${baseUrl}/uk/blog/iptv-smarters-pro-vs-other-iptv-players/`);
    for (const e of entries) {
      const langs = Object.keys(e.alternates?.languages ?? {});
      if (/\/(privacy-policy|terms-of-service|refund-policy|iptv-installation-[a-z-]+)\//.test(e.url)) {
        expect(langs).not.toContain("en-CA");
        expect(langs).not.toContain("en-GB");
      }
    }
  });
});
