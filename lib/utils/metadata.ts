import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://iptv-smarters.vercel.app";

// Helper to get default OG image
export function getDefaultOGImage(): string {
  return `${baseUrl}/images/hero.png`;
}

export interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  locale?: Locale;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const localeMap: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
};

const siteNameMap: Record<Locale, string> = {
  en: "StreamPro - Premium IPTV Service",
  es: "StreamPro - Servicio IPTV Premium",
  fr: "StreamPro - Service IPTV Premium",
};

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = getDefaultOGImage(),
    url,
    type = "website",
    locale = "en",
    publishedTime,
    modifiedTime,
    author = "StreamPro",
    section,
    tags = [],
  } = options;

  const fullTitle = `${title} | StreamPro`;
  const ogImage = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const pageUrl = url || `${baseUrl}/${locale}`;

  // Enhanced Open Graph metadata
  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type: type === "article" ? "article" : "website",
    locale: localeMap[locale],
    url: pageUrl,
    siteName: siteNameMap[locale],
    title: fullTitle,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
        type: "image/jpeg",
      },
    ],
    ...(type === "article" && {
      article: {
        publishedTime,
        modifiedTime,
        authors: [author],
        section,
        tags,
      },
    }),
  };

  // Enhanced Twitter Card metadata
  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: fullTitle,
    description,
    images: [ogImage],
    creator: "@streampro",
    site: "@streampro",
  };

  // Enhanced metadata
  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: author }],
    creator: author,
    publisher: "StreamPro",
    applicationName: "StreamPro IPTV",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl.replace(`/${locale}`, "/en").replace(`/${locale}/`, "/en/"),
        es: pageUrl.replace(`/${locale}`, "/es").replace(`/${locale}/`, "/es/"),
        fr: pageUrl.replace(`/${locale}`, "/fr").replace(`/${locale}/`, "/fr/"),
        "x-default": pageUrl.replace(`/${locale}`, "/en").replace(`/${locale}/`, "/en/"),
      },
    },
    openGraph,
    twitter,
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
      // Add verification codes when available
    },
    other: {
      // Additional meta tags for better social sharing
      "og:image:secure_url": ogImage,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      // WhatsApp specific
      "og:image:alt": title,
      // LinkedIn specific
      "article:author": author,
      // Additional platforms
      "fb:app_id": "", // Add Facebook App ID if available
    },
  };
}

// Helper to generate page-specific OG images
export function getPageOGImage(page: string, locale: Locale = "en"): string {
  // For now, use default image. Can be extended to generate dynamic images
  return getDefaultOGImage();
}
