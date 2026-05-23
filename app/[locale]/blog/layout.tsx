import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getBlogMetadata } from "@/lib/utils/metadata-loader";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { blogListingSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { openGraphLocaleMap, siteNameMap } from "@/lib/i18n/locale-maps";
import { buildHomepageHreflangAlternates } from "@/lib/seo/hreflang";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

const localeMap = openGraphLocaleMap;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  // Load metadata from file
  // Use the "blog" metadata for the /blog route itself.
  // The listing component uses separate "blogListing" metadata for listing context and schema.
  const pageMetadata = await getBlogMetadata(locale);
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const keywords = getRouteMetaKeywords(locale, "blog", blogListingSeeds[locale]);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/`, // Include trailing slash for consistency
      languages: buildHomepageHreflangAlternates(baseUrl, "/blog/"),
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/blog/`, // Include trailing slash for consistency
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
      "og:image:secure_url": `${baseUrl}/images/hero.png`,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
    },
  };
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locale)) {
    return <>{children}</>;
  }
  const locale = localeParam as Locale;
  const pageMetadata = await getBlogMetadata(locale);
  const canonicalUrl = `${baseUrl}/${locale}/blog/`;
  const keywords = getRouteMetaKeywords(locale, "blog", blogListingSeeds[locale]);

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={`${baseUrl}/${locale}/`}
      />
      {children}
    </>
  );
}
