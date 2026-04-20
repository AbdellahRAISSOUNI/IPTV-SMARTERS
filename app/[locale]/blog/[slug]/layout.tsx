import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import { getBlogUrl } from "@/lib/utils/blog-slugs";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

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

function toKeywordArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function toValidIsoOrUndefined(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function getSafeMetadataBase(): URL | undefined {
  try {
    return new URL(baseUrl);
  } catch {
    return undefined;
  }
}

function getSafeImageUrl(value: string | undefined): string {
  if (!value || value.startsWith("blob:")) return `${baseUrl}/images/hero.png`;
  if (value.startsWith("/")) return `${baseUrl}${value}`;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return value;
    }
  } catch {
    // Ignore and fallback below.
  }
  return `${baseUrl}/images/hero.png`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    // Pass locale to getBlogBySlug to ensure correct blog is found
    const blog = await getBlogBySlug(slug, locale);
    
    if (!blog) {
      return getDefaultMetadata(locale, slug);
    }

    const title = (blog.title[locale] || "").trim() || "Blog Post";
    const metaDesc = (blog.meta?.description?.[locale] || "").trim();
    const excerptLocale = (blog.excerpt[locale] || "").trim();
    const description =
      metaDesc || excerptLocale || "Read our latest blog post about IPTV services.";
    const image = getSafeImageUrl(blog.featuredImage);

    const publishedTime = toValidIsoOrUndefined(blog.publishedAt);
    const modifiedTime = toValidIsoOrUndefined(blog.updatedAt);
    const keywordList = toKeywordArray(blog.meta?.keywords?.[locale]);

    // Build correct hreflang URLs using each locale's slug (slugs can differ per language)
    const languageAlternates: Record<string, string> = {};
    locales.forEach((loc) => {
      const localizedUrl = getBlogUrl(blog, loc);
      if (localizedUrl !== `/${loc}/blog//`) {
        languageAlternates[loc] = `${baseUrl}${localizedUrl}`;
      }
    });
    const xDefaultUrl = getBlogUrl(blog, "en");
    languageAlternates["x-default"] =
      xDefaultUrl !== "/en/blog//"
        ? `${baseUrl}${xDefaultUrl}`
        : `${baseUrl}${getBlogUrl(blog, locale)}`;

    const canonicalPath = getBlogUrl(blog, locale);
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    return {
      title: `${title} | StreamPro`,
      description,
      keywords: keywordList,
      metadataBase: getSafeMetadataBase(),
      alternates: {
        canonical: canonicalUrl,
        languages: languageAlternates,
      },
      openGraph: {
        type: "article",
        locale: localeMap[locale],
        url: canonicalUrl,
        siteName: siteNameMap[locale],
        title: `${title} | StreamPro`,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/jpeg",
          },
        ],
        publishedTime,
        modifiedTime,
        authors: ["StreamPro"],
        section: "IPTV Blog",
        tags: keywordList,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | StreamPro`,
        description,
        images: [image],
        creator: "@streampro",
        site: "@streampro",
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
      other: {
        "og:image:secure_url": image,
        "og:image:type": "image/jpeg",
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:image:alt": title,
        "article:author": "StreamPro",
        ...(publishedTime ? { "article:published_time": publishedTime } : {}),
        ...(modifiedTime ? { "article:modified_time": modifiedTime } : {}),
      },
    };
  } catch {
    return getDefaultMetadata(locale, slug);
  }
}

function getDefaultMetadata(locale: Locale, slug: string): Metadata {
  const title = "Blog Post | StreamPro";
  const description = "Read our latest blog post about IPTV services.";
  
  return {
    title,
    description,
    metadataBase: getSafeMetadataBase(),
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}/`, // Include trailing slash for consistency
    },
    openGraph: {
      type: "article",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/blog/${slug}/`, // Include trailing slash for consistency
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/hero.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/hero.png`],
    },
    robots: {
      index: true, // Ensure blog pages are always indexable
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
