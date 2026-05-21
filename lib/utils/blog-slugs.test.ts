import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";
import {
  findBlogByAnySlug,
  getAllBlogSlugs,
  getBlogSlug,
  getBlogUrl,
  isBlogAvailableInLocale,
} from "@/lib/utils/blog-slugs";

function makePost(overrides: Partial<BlogPost> & Pick<BlogPost, "slug">): BlogPost {
  const now = new Date().toISOString();
  return {
    id: "test-id",
    slug: overrides.slug,
    title: { en: "T", es: "T", fr: "T", ...overrides.title },
    excerpt: { en: "E", es: "E", fr: "E", ...overrides.excerpt },
    publishedAt: now,
    updatedAt: now,
    locale: "en",
    blocks: [],
    ...overrides,
  };
}

describe("blog-slugs", () => {
  it("getBlogSlug returns only that locale segment (no cross-language fallback)", () => {
    const blog = makePost({
      slug: { en: "english-slug", es: "spanish-slug", fr: "french-slug" },
    });
    expect(getBlogSlug(blog, "en" as Locale)).toBe("english-slug");
    expect(getBlogSlug(blog, "es" as Locale)).toBe("spanish-slug");
    expect(getBlogSlug(blog, "fr" as Locale)).toBe("french-slug");
  });

  it("getBlogSlug returns empty string when locale segment missing", () => {
    const blog = makePost({
      slug: { en: "a", es: "", fr: "c" },
    });
    expect(getBlogSlug(blog, "es" as Locale)).toBe("");
  });

  it("legacy string slug is reused for every locale", () => {
    const blog = makePost({ slug: "legacy-one" });
    expect(getBlogSlug(blog, "en" as Locale)).toBe("legacy-one");
    expect(getBlogSlug(blog, "fr" as Locale)).toBe("legacy-one");
  });

  it("getBlogUrl encodes slug and uses trailing slash path shape", () => {
    const blog = makePost({
      slug: { en: "a b", es: "x", fr: "y" },
      translations: ["en"],
    });
    expect(getBlogUrl(blog, "en" as Locale)).toMatch(/\/en\/blog\/a%20b\/$/);
  });

  it("getAllBlogSlugs returns independent values per locale", () => {
    const blog = makePost({
      slug: { en: "en-s", es: "es-s", fr: "fr-s" },
    });
    expect(getAllBlogSlugs(blog)).toEqual({
      en: "en-s",
      es: "es-s",
      fr: "fr-s",
    });
  });

  it("findBlogByAnySlug matches any locale column", () => {
    const a = makePost({
      id: "1",
      slug: { en: "foo", es: "bar", fr: "baz" },
    });
    const b = makePost({
      id: "2",
      slug: { en: "other", es: "x", fr: "y" },
    });
    const blogs = [a, b];
    expect(findBlogByAnySlug(blogs, "bar")?.id).toBe("1");
    expect(findBlogByAnySlug(blogs, "other")?.id).toBe("2");
    expect(findBlogByAnySlug(blogs, "missing")).toBeNull();
  });

  it("findBlogByAnySlug accepts URL-encoded slug segments", () => {
    const blog = makePost({
      slug: { en: "hello world", es: "x", fr: "y" },
    });
    expect(findBlogByAnySlug([blog], "hello%20world")?.id).toBe(blog.id);
  });

  it("isBlogAvailableInLocale is false when locale not published", () => {
    const blog = makePost({
      slug: { en: "only-en", es: "", fr: "" },
      translations: ["en"],
    });
    expect(isBlogAvailableInLocale(blog, "en")).toBe(true);
    expect(isBlogAvailableInLocale(blog, "fr")).toBe(false);
  });

  it("isBlogAvailableInLocale uses inferred publish list for legacy posts", () => {
    const blog = makePost({
      translations: ["fr"],
      locale: "fr",
      slug: { en: "", es: "", fr: "fr-post" },
      title: { en: "", es: "", fr: "T" },
      excerpt: { en: "", es: "", fr: "E" },
      meta: { description: { en: "", es: "", fr: "D" } },
      blocks: [{ id: "1", type: "paragraph", content: { fr: "body" } }],
    });
    expect(isBlogAvailableInLocale(blog, "fr")).toBe(true);
    expect(isBlogAvailableInLocale(blog, "en")).toBe(false);
  });
});
