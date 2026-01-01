import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

  const titleMap: Record<Locale, string> = {
    en: "How to Install IPTV Smarters Pro on Windows | Step-by-Step Guide 2026",
    es: "Cómo Instalar IPTV Smarters Pro en Windows | Guía Paso a Paso 2026",
    fr: "Comment Installer IPTV Smarters Pro sur Windows | Guide Étape par Étape 2026",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Complete step-by-step guide to install IPTV Smarters Pro on Windows PC. Download, install, and configure IPTV Smarters Pro on Windows. Free installation support available.",
    es: "Guía completa paso a paso para instalar IPTV Smarters Pro en PC con Windows. Descarga, instala y configura IPTV Smarters Pro en Windows. Soporte de instalación gratuito disponible.",
    fr: "Guide complet étape par étape pour installer IPTV Smarters Pro sur PC Windows. Téléchargez, installez et configurez IPTV Smarters Pro sur Windows. Support d'installation gratuit disponible.",
  };

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
    title: titleMap[locale],
    description: descriptionMap[locale],
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
      title: titleMap[locale],
      description: descriptionMap[locale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: titleMap[locale],
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleMap[locale],
      description: descriptionMap[locale],
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
      "og:image:alt": titleMap[locale],
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
