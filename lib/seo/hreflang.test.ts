import { describe, expect, it } from "vitest";
import {
  buildHreflangAlternates,
  buildHomepageHreflangAlternates,
  buildLegalHreflangAlternates,
  hreflangByLocale,
} from "@/lib/seo/hreflang";

describe("hreflang", () => {
  it("maps internal ca route to en-CA (not Catalan ca)", () => {
    expect(hreflangByLocale.ca).toBe("en-CA");
    expect(hreflangByLocale.uk).toBe("en-GB");
    expect(hreflangByLocale.en).toBe("en-US");
  });

  it("builds homepage alternates with BCP 47 keys", () => {
    const alt = buildHomepageHreflangAlternates("https://example.com", "/");
    expect(alt["en-US"]).toBe("https://example.com/en/");
    expect(alt["en-CA"]).toBe("https://example.com/ca/");
    expect(alt["en-GB"]).toBe("https://example.com/uk/");
    expect(alt["es-ES"]).toBe("https://example.com/es/");
    expect(alt["fr-FR"]).toBe("https://example.com/fr/");
    expect(alt["x-default"]).toBe("https://example.com/en/");
    expect(alt.ca).toBeUndefined();
  });

  it("supports partial locale maps for blog posts", () => {
    const alt = buildHreflangAlternates(
      {
        ca: "https://example.com/ca/blog/post/",
      },
      "https://example.com/ca/blog/post/"
    );
    expect(alt["en-CA"]).toContain("/ca/blog/");
    expect(alt["x-default"]).toContain("/ca/blog/");
    expect(Object.keys(alt)).toEqual(["en-CA", "x-default"]);
  });

  it("builds legal hreflang with localized slugs for es and fr", () => {
    const getLegalUrl = (slug: string, loc: string) =>
      `/${loc}/${slug === "privacy-policy" && loc === "es" ? "politica-de-privacidad" : slug}/`;
    const alt = buildLegalHreflangAlternates(
      "https://example.com",
      "privacy-policy",
      getLegalUrl as (englishSlug: string, locale: import("@/lib/i18n").Locale) => string
    );
    expect(alt["en-CA"]).toBe("https://example.com/ca/privacy-policy/");
    expect(alt["es-ES"]).toBe("https://example.com/es/politica-de-privacidad/");
  });
});
