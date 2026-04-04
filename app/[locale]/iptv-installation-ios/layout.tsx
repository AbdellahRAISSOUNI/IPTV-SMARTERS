import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getInstallationMetadata } from "@/lib/utils/metadata-loader";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { iosInstallationSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const pageMetadata = await getInstallationMetadata(locale, "ios");
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const keywords = getRouteMetaKeywords(locale, "ios", iosInstallationSeeds[locale]);

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
  const currentUrl = getInstallationUrl("iptv-installation-ios", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${baseUrl}${getInstallationUrl("iptv-installation-ios", loc)}`;
  });
  languageAlternates["x-default"] = `${baseUrl}${getInstallationUrl("iptv-installation-ios", "en")}`;

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
      type: "article",
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
      "article:author": "StreamPro",
    },
  };
}

export default async function IosInstallationLayout({
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
  const pageMetadata = await getInstallationMetadata(locale, "ios");
  const currentUrl = getInstallationUrl("iptv-installation-ios", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  const siteUrl = `${baseUrl}/${locale}/`;
  const keywords = getRouteMetaKeywords(locale, "ios", iosInstallationSeeds[locale]);

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={siteUrl}
      />
      {children}
    </>
  );
}
