import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { locales } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

  const titleMap: Record<Locale, string> = {
    en: "IPTV Installation Guide | How to Install IPTV Smarters Pro on All Devices | Step-by-Step Tutorial",
    es: "Guía de Instalación IPTV | Cómo Instalar IPTV Smarters Pro en Todos los Dispositivos | Tutorial Paso a Paso",
    fr: "Guide d'Installation IPTV | Comment Installer IPTV Smarters Pro sur Tous les Appareils | Tutoriel Étape par Étape",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Complete IPTV installation guide for IPTV Smarters Pro. Learn how to install IPTV on Windows, Android, iOS, Mac, Smart TV, and Firestick. Step-by-step instructions with screenshots. Free installation support available.",
    es: "Guía completa de instalación IPTV para IPTV Smarters Pro. Aprende cómo instalar IPTV en Windows, Android, iOS, Mac, Smart TV y Firestick. Instrucciones paso a paso con capturas de pantalla. Soporte de instalación gratuito disponible.",
    fr: "Guide complet d'installation IPTV pour IPTV Smarters Pro. Apprenez comment installer IPTV sur Windows, Android, iOS, Mac, Smart TV et Firestick. Instructions étape par étape avec captures d'écran. Support d'installation gratuit disponible.",
  };

  const keywordsMap: Record<Locale, string[]> = {
    en: [
      "iptv installation guide",
      "how to install iptv",
      "iptv smarters pro installation",
      "iptv installation windows",
      "iptv installation android",
      "iptv installation ios",
      "iptv installation smart tv",
      "iptv installation firestick",
      "iptv setup guide",
      "iptv installation tutorial",
      "install iptv smarters pro",
      "iptv installation steps",
      "iptv installation instructions",
      "iptv installation help",
      "iptv installation support",
    ],
    es: [
      "guía instalación iptv",
      "cómo instalar iptv",
      "instalación iptv smarters pro",
      "instalación iptv windows",
      "instalación iptv android",
      "instalación iptv ios",
      "instalación iptv smart tv",
      "instalación iptv firestick",
      "guía configuración iptv",
      "tutorial instalación iptv",
      "instalar iptv smarters pro",
      "pasos instalación iptv",
      "instrucciones instalación iptv",
      "ayuda instalación iptv",
      "soporte instalación iptv",
    ],
    fr: [
      "guide installation iptv",
      "comment installer iptv",
      "installation iptv smarters pro",
      "installation iptv windows",
      "installation iptv android",
      "installation iptv ios",
      "installation iptv smart tv",
      "installation iptv firestick",
      "guide configuration iptv",
      "tutoriel installation iptv",
      "installer iptv smarters pro",
      "étapes installation iptv",
      "instructions installation iptv",
      "aide installation iptv",
      "support installation iptv",
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
  
  // Get language-specific URL for this page
  const currentUrl = getInstallationUrl('iptv-installation-guide', locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  
  // Generate alternates with language-specific URLs
  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const altUrl = getInstallationUrl('iptv-installation-guide', loc);
    languageAlternates[loc] = `${baseUrl}${altUrl}`;
  });
  languageAlternates['x-default'] = `${baseUrl}${getInstallationUrl('iptv-installation-guide', 'en')}`;

  return {
    title: titleMap[locale],
    description: descriptionMap[locale],
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

export default function InstallationGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
