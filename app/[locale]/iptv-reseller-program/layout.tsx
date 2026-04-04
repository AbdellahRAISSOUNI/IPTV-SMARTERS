import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getResellerMetadata } from "@/lib/utils/metadata-loader";
import { getResellerUrl } from "@/lib/utils/installation-slugs";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { resellerSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

  // Load metadata from file
  const pageMetadata = await getResellerMetadata(locale);
  const title = pageMetadata.title;
  const description = pageMetadata.description;

  const keywords = getRouteMetaKeywords(locale, "reseller", resellerSeeds[locale]);

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

  const ogImage = `${baseUrl}/images/hero.png`;
  
  // Get language-specific URL for this page
  const currentUrl = getResellerUrl("iptv-reseller-program", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const altUrl = getResellerUrl("iptv-reseller-program", loc);
    languageAlternates[loc] = `${baseUrl}${altUrl}`;
  });
  languageAlternates["x-default"] = `${baseUrl}${getResellerUrl("iptv-reseller-program", "en")}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: canonicalUrl,
      siteName: siteNameMap[locale],
      title,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
      "og:image:secure_url": ogImage,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
    },
  };
}

export default async function ResellerLayout({
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
  const pageMetadata = await getResellerMetadata(locale);
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";
  const canonicalUrl = `${base}${getResellerUrl("iptv-reseller-program", locale)}`;
  const keywords = getRouteMetaKeywords(locale, "reseller", resellerSeeds[locale]);

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={`${base}/${locale}/`}
      />
      {children}
    </>
  );
}
