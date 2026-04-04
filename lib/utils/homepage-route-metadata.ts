import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getHomepageKeywordList } from "@/lib/seo/site-keywords";
import { getHomepageMetadata } from "@/lib/utils/metadata-loader";

export async function buildLocaleHomepageMetadata(locale: Locale): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

  const localeMap: Record<Locale, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
  };

  // Load metadata from file
  const homepageMetadata = await getHomepageMetadata(locale);
  const title = homepageMetadata.title;
  const description = homepageMetadata.description;

  // Generate hreflang alternates
  const alternates: Record<string, string> = {};
  locales.forEach((loc) => {
    alternates[loc] = `${baseUrl}/${loc}/`;
  });
  // Add x-default pointing to English (default locale)
  alternates['x-default'] = `${baseUrl}/en/`;

  // Site name translations
  const siteNameMap: Record<Locale, string> = {
    en: "StreamPro - Premium IPTV Service",
    es: "StreamPro - Servicio IPTV Premium",
    fr: "StreamPro - Service IPTV Premium",
  };

  return {
    title,
    description,
    keywords: getHomepageKeywordList(locale),
    authors: [{ name: "StreamPro" }],
    creator: "StreamPro",
    publisher: "StreamPro",
    applicationName: "StreamPro IPTV",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/`, // Include trailing slash to match next.config trailingSlash: true
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/`, // Include trailing slash for consistency
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/hero.png`,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/hero.png`],
      creator: "@streampro",
      site: "@streampro",
    },
    other: {
      "og:image:secure_url": `${baseUrl}/images/hero.png`,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
      "article:author": "StreamPro",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add your verification codes here when available
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
  };
}
