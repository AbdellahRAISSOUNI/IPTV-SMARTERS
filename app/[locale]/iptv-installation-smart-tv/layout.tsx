import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getInstallationMetadata } from "@/lib/utils/metadata-loader";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

  if (!locales.includes(locale)) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const pageMetadata = await getInstallationMetadata(locale, "smartTv");
  const title = pageMetadata.title;
  const description = pageMetadata.description;

  const keywordsMap: Record<Locale, string[]> = {
    en: [
      "iptv smarters pro smart tv",
      "install iptv smart tv",
      "iptv smart tv setup",
      "iptv on samsung smart tv",
      "iptv on lg smart tv",
      "smart tv iptv app",
      "iptv smarters smart tv guide",
    ],
    es: [
      "iptv smarters pro smart tv",
      "instalar iptv smart tv",
      "configurar iptv smart tv",
      "iptv en smart tv samsung",
      "iptv en smart tv lg",
      "app iptv smart tv",
      "guía iptv smarters smart tv",
    ],
    fr: [
      "iptv smarters pro smart tv",
      "installer iptv smart tv",
      "configuration iptv smart tv",
      "iptv sur smart tv samsung",
      "iptv sur smart tv lg",
      "application iptv smart tv",
      "guide iptv smarters smart tv",
    ],
  };

  const localeMap: Record<Locale, string> = { en: "en_US", es: "es_ES", fr: "fr_FR" };
  const siteNameMap: Record<Locale, string> = {
    en: "StreamPro - Premium IPTV Service",
    es: "StreamPro - Servicio IPTV Premium",
    fr: "StreamPro - Service IPTV Premium",
  };

  const ogImage = `${baseUrl}/images/hero.png`;

  const currentUrl = getInstallationUrl("iptv-installation-smart-tv", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${baseUrl}${getInstallationUrl("iptv-installation-smart-tv", loc)}`;
  });
  languageAlternates["x-default"] = `${baseUrl}${getInstallationUrl("iptv-installation-smart-tv", "en")}`;

  return {
    title,
    description,
    keywords: keywordsMap[locale],
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

export default function SmartTvInstallationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

