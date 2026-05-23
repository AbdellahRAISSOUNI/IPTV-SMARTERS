import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/admin/blog-shared";
import {
  copyBlogLocaleContent,
  getPublishedLocales,
  hasLocalePublishableContent,
  validateBlogForPublish,
} from "@/lib/admin/blog-locales";

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  const now = new Date().toISOString();
  return {
    id: "test",
    slug: { en: "en-slug", es: "", fr: "" },
    title: { en: "Title EN", es: "", fr: "" },
    excerpt: { en: "Excerpt EN", es: "", fr: "" },
    publishedAt: now,
    updatedAt: now,
    locale: "en",
    translations: ["en"],
    blocks: [
      {
        id: "b1",
        type: "paragraph",
        content: { en: "Body EN", es: "", fr: "" },
      },
    ],
    meta: { description: { en: "Meta EN", es: "", fr: "" } },
    ...overrides,
  };
}

describe("blog-locales", () => {
  it("getPublishedLocales respects explicit translations array", () => {
    const blog = makePost({ translations: ["fr"] });
    expect(getPublishedLocales(blog)).toEqual(["fr"]);
  });

  it("getPublishedLocales infers from content when translations empty", () => {
    const blog = makePost({
      translations: [],
      locale: "fr",
      slug: { en: "", es: "", fr: "fr-only" },
      title: { en: "", es: "", fr: "T" },
      excerpt: { en: "", es: "", fr: "E" },
      meta: { description: { en: "", es: "", fr: "D" } },
      blocks: [{ id: "1", type: "paragraph", content: { en: "", es: "", fr: "Body" } }],
    });
    expect(getPublishedLocales(blog)).toEqual(["fr"]);
  });

  it("validateBlogForPublish allows single locale", () => {
    const blog = makePost();
    const result = validateBlogForPublish(blog, ["en"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.blog.translations).toEqual(["en"]);
    }
  });

  it("validateBlogForPublish rejects empty publish list", () => {
    const blog = makePost();
    const result = validateBlogForPublish(blog, []);
    expect(result.ok).toBe(false);
  });

  it("copyBlogLocaleContent copies text without slug by default", () => {
    const blog = makePost({
      slug: { en: "en-slug", es: "es-old", fr: "" },
      translations: ["en", "es"],
    });
    const copied = copyBlogLocaleContent(blog, "en", { targets: ["es"] });
    expect(copied.title.es).toBe("Title EN");
    expect(copied.slug).toEqual({ en: "en-slug", es: "es-old", fr: "" });
  });

  it("hasLocalePublishableContent requires slug title excerpt meta and body", () => {
    const blog = makePost();
    expect(hasLocalePublishableContent(blog, "en")).toBe(true);
    expect(hasLocalePublishableContent(blog, "es")).toBe(false);
  });

  it("supports ca as a publish locale", () => {
    const blog = makePost({
      translations: ["ca"],
      locale: "ca",
      slug: { en: "", ca: "canada-post", es: "", fr: "" },
      title: { en: "", ca: "Canada Title", es: "", fr: "" },
      excerpt: { en: "", ca: "Canada excerpt", es: "", fr: "" },
      meta: { description: { en: "", ca: "Canada meta", es: "", fr: "" } },
      blocks: [{ id: "1", type: "paragraph", content: { ca: "Body CA" } }],
    });
    expect(getPublishedLocales(blog)).toEqual(["ca"]);
    const result = validateBlogForPublish(blog, ["ca"]);
    expect(result.ok).toBe(true);
  });
});
