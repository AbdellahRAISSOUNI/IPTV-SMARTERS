import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { localeToUrlSegment } from "@/lib/i18n/locale-url-slugs";
import { getHomepageKeywordList } from "@/lib/seo/site-keywords";
import { getHomepageMetadata } from "@/lib/utils/metadata-loader";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

export async function buildLocaleHomepageMetadata(locale: Locale): Promise<Metadata> {
  const baseUrl = getSiteBaseUrl();
  const homepageMetadata = await getHomepageMetadata(locale);
  const title = homepageMetadata.title;
  const description = homepageMetadata.description;
  // Homepage-specific hreflang: only `en` uses its URL-slug alias, every other
  // locale keeps its plain locale-code homepage URL.
  const hreflangAlternates = buildHreflangAlternates(
    Object.fromEntries(
      locales.map((loc) => [loc, `${baseUrl}/${localeToUrlSegment(loc)}/`])
    ) as Record<Locale, string>,
    `${baseUrl}/${localeToUrlSegment("en")}/`
  );

  return {
    ...buildSocialMetadata({
      title,
      description,
      locale,
      canonicalUrl: `${baseUrl}/${localeToUrlSegment(locale)}/`,
      keywords: getHomepageKeywordList(locale),
      type: "website",
      languageAlternates: hreflangAlternates,
      useGeneratedOgImage: true,
    }),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    verification: {},
  };
}
