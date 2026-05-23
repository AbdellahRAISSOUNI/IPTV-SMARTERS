import { describe, expect, it } from "vitest";
import { CORE_SITE_KEYWORDS, getHomepageKeywordList } from "@/lib/seo/site-keywords";

describe("site keywords locale focus", () => {
  it("keeps a large EN core with USA-oriented terms", () => {
    const enCore = CORE_SITE_KEYWORDS.en.join(" ").toLowerCase();
    expect(enCore).toContain("iptv usa");
    expect(enCore).toContain("usd");
    expect(enCore).toContain("united states");
    expect(CORE_SITE_KEYWORDS.en.length).toBeGreaterThan(100);
  });

  it("prioritizes USA phrases in EN homepage meta extras", () => {
    const list = getHomepageKeywordList("en");
    const joined = list.join(" ").toLowerCase();
    expect(joined).toMatch(/united states|usa|american|usd/);
    expect(list.length).toBeGreaterThan(CORE_SITE_KEYWORDS.en.length);
  });

  it("prioritizes Canada phrases in CA homepage meta extras", () => {
    const list = getHomepageKeywordList("ca");
    const joined = list.join(" ").toLowerCase();
    expect(joined).toMatch(/canada|quebec|toronto|cad/);
  });
});
