import { describe, expect, it } from "vitest";
import ca from "@/lib/i18n/translations/ca.json";
import en from "@/lib/i18n/translations/en.json";
import es from "@/lib/i18n/translations/es.json";
import type { BlogPost } from "@/lib/admin/blog-shared";
import {
  copyBlogLocaleContent,
  getPublishedLocales,
  validateBlogForPublish,
} from "@/lib/admin/blog-locales";

/** Mirrors admin dashboard updateValue — mutates one locale JSON root only. */
function applyTranslationEdit(
  localeContent: Record<string, unknown>,
  path: string,
  value: string | boolean
) {
  const keys = path.split(".");
  let current: Record<string, unknown> = localeContent;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

describe("Canada vs other locales — translation files", () => {
  it("homepage pricing in ca.json is independent from en.json", () => {
    expect(ca.pricing.plan12MonthsPrice).toMatch(/\$CA/i);
    expect(ca.pricing.plan12MonthsPrice).toBe("79 $CA");
    expect(en.pricing.plan12MonthsPrice).not.toMatch(/\$CA/i);
    expect(ca.pricing.plan12MonthsPrice).not.toBe(en.pricing.plan12MonthsPrice);
  });

  it("reseller credit prices in ca.json are CAD and differ from en", () => {
    expect(ca.reseller.credit10Price).toMatch(/CAD/i);
    expect(en.reseller.credit10Price).not.toMatch(/CAD/i);
    expect(ca.reseller.credit10Price).not.toBe(en.reseller.credit10Price);
  });

  it("editing CA pricing in memory does not change EN pricing object", () => {
    const enContent = JSON.parse(JSON.stringify(en)) as Record<string, unknown>;
    const caContent = JSON.parse(JSON.stringify(ca)) as Record<string, unknown>;
    const enBefore = (enContent.pricing as { plan3MonthsPrice: string }).plan3MonthsPrice;

    applyTranslationEdit(caContent, "pricing.plan3MonthsPrice", "35 $CA");

    expect((caContent.pricing as { plan3MonthsPrice: string }).plan3MonthsPrice).toBe(
      "35 $CA"
    );
    expect((enContent.pricing as { plan3MonthsPrice: string }).plan3MonthsPrice).toBe(
      enBefore
    );
  });

  it("editing CA reseller price does not change ES reseller price", () => {
    const esContent = JSON.parse(JSON.stringify(es)) as Record<string, unknown>;
    const caContent = JSON.parse(JSON.stringify(ca)) as Record<string, unknown>;
    const esBefore = (esContent.reseller as { credit20Price: string }).credit20Price;

    applyTranslationEdit(caContent, "reseller.credit20Price", "$450 CAD");

    expect((caContent.reseller as { credit20Price: string }).credit20Price).toBe("$450 CAD");
    expect((esContent.reseller as { credit20Price: string }).credit20Price).toBe(esBefore);
  });
});

describe("Canada-only blog publishing", () => {
  const now = new Date().toISOString();

  function canadaOnlyPost(keywords: string): BlogPost {
    return {
      id: "ca-only-test",
      slug: { en: "", ca: "iptv-canada-test-post", es: "", fr: "" },
      title: { en: "", ca: "IPTV Canada Test Post", es: "", fr: "" },
      excerpt: { en: "", ca: "Short excerpt for Canada.", es: "", fr: "" },
      publishedAt: now,
      updatedAt: now,
      locale: "ca",
      translations: ["ca"],
      blocks: [
        {
          id: "b1",
          type: "paragraph",
          content: { ca: "Body for Canadian readers only." },
        },
      ],
      meta: {
        description: { ca: "Meta description for Canada SEO." },
        keywords: { ca: keywords },
      },
    };
  }

  it("allows publishing with Canada as primary locale only", () => {
    const blog = canadaOnlyPost("iptv canada, firestick, m3u, free trial");
    const result = validateBlogForPublish(blog, ["ca"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.blog.translations).toEqual(["ca"]);
      expect(result.blog.meta?.keywords?.ca).toBe(
        "iptv canada, firestick, m3u, free trial"
      );
    }
  });

  it("stores arbitrary comma-separated keywords on ca without requiring en", () => {
    const custom =
      "best iptv canada, iptv quebec, iptv box, custom keyword 123, another-term";
    const blog = canadaOnlyPost(custom);
    const result = validateBlogForPublish(blog, ["ca"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.blog.meta?.keywords?.ca).toBe(custom);
      expect(result.blog.meta?.keywords?.en).toBeFalsy();
    }
  });

  it("copy EN → CA targets only CA and leaves EN unchanged", () => {
    const blog: BlogPost = {
      id: "copy-test",
      slug: { en: "en-slug", ca: "", es: "", fr: "" },
      title: { en: "EN Title", ca: "", es: "", fr: "" },
      excerpt: { en: "EN Excerpt", ca: "", es: "", fr: "" },
      publishedAt: now,
      updatedAt: now,
      locale: "en",
      translations: ["en", "ca"],
      blocks: [{ id: "1", type: "paragraph", content: { en: "EN body", ca: "" } }],
      meta: {
        description: { en: "EN meta", ca: "" },
        keywords: { en: "en,kw", ca: "" },
      },
    };

    const copied = copyBlogLocaleContent(blog, "en", { targets: ["ca"] });

    expect(copied.title.ca).toBe("EN Title");
    expect(copied.title.en).toBe("EN Title");
    expect(copied.meta?.keywords?.ca).toBe("en,kw");
    expect(copied.slug).toEqual({ en: "en-slug", ca: "", es: "", fr: "" });
    expect(getPublishedLocales(copied)).toEqual(expect.arrayContaining(["en", "ca"]));
  });
});
