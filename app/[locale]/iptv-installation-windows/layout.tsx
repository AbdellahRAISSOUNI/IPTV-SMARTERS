import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getInstallationMetadata } from "@/lib/utils/metadata-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

  // Load metadata from file
  const pageMetadata = await getInstallationMetadata(locale, 'windows');
  const title = pageMetadata.title;
  const description = pageMetadata.description;

  const keywordsMap: Record<Locale, string[]> = {
    en: [
      "iptv smarters pro windows",
      "install iptv windows",
      "iptv windows installation",
      "iptv smarters pro windows guide",
      "how to install iptv on windows",
      "iptv windows setup",
      "iptv windows download",
    ],
    es: [
      "iptv smarters pro windows",
      "instalar iptv windows",
      "instalación iptv windows",
      "guía iptv smarters pro windows",
      "cómo instalar iptv en windows",
      "configuración iptv windows",
      "descargar iptv windows",
    ],
    fr: [
      "iptv smarters pro windows",
      "installer iptv windows",
      "installation iptv windows",
      "guide iptv smarters pro windows",
      "comment installer iptv sur windows",
      "configuration iptv windows",
      "télécharger iptv windows",
    ],
  };

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

  return {
    title,
    description,
    keywords: keywordsMap[locale],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/iptv-installation-windows`,
      languages: {
        en: `${baseUrl}/en/iptv-installation-windows`,
        es: `${baseUrl}/es/iptv-installation-windows`,
        fr: `${baseUrl}/fr/iptv-installation-windows`,
        "x-default": `${baseUrl}/en/iptv-installation-windows`,
      },
    },
    openGraph: {
      type: "article",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/iptv-installation-windows`,
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

export default function WindowsInstallationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
