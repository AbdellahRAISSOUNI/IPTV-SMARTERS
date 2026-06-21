import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { blogUrlsInSitemap, buildSitemapEntries } from "@/lib/seo/sitemap-entries";

const baseUrl = "https://www.pro-iptvsmarters.com";

describe("buildSitemapEntries", () => {
  it("includes Canada blog posts that are live on the site", () => {
    const blogs = JSON.parse(
      readFileSync(join(process.cwd(), "data/blogs.json"), "utf8")
    ) as BlogPost[];

    const entries = buildSitemapEntries(baseUrl, blogs);
    const matches = blogUrlsInSitemap(entries, "best-iptv-subscription-canada");

    expect(matches).toContain(
      "https://www.pro-iptvsmarters.com/ca/blog/best-iptv-subscription-canada/"
    );
  });

  it("does not emit duplicate URLs", () => {
    const blogs = JSON.parse(
      readFileSync(join(process.cwd(), "data/blogs.json"), "utf8")
    ) as BlogPost[];

    const entries = buildSitemapEntries(baseUrl, blogs);
    const urls = entries.map((entry) => entry.url).filter(Boolean);

    expect(new Set(urls).size).toBe(urls.length);
  });
});
