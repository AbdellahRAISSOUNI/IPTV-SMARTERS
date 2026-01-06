import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getResellerMetadata } from "@/lib/utils/metadata-loader";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { locales } from "@/lib/i18n";

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

  const keywordsMap: Record<Locale, string[]> = {
    en: [
      "iptv reseller program",
      "become iptv reseller",
      "iptv reseller",
      "white label iptv",
      "iptv reseller panel",
      "iptv business",
      "start iptv business",
      "iptv reseller account",
      "iptv reseller pricing",
      "iptv reseller support",
      "iptv reseller platform",
      "iptv reseller credits",
      "iptv reseller program benefits",
      "iptv reseller opportunity",
      "iptv reseller white label",
    ],
    es: [
      "programa revendedor iptv",
      "convertirse revendedor iptv",
      "revendedor iptv",
      "iptv white label",
      "panel revendedor iptv",
      "negocio iptv",
      "iniciar negocio iptv",
      "cuenta revendedor iptv",
      "precios revendedor iptv",
      "soporte revendedor iptv",
      "plataforma revendedor iptv",
      "créditos revendedor iptv",
      "beneficios programa revendedor iptv",
      "oportunidad revendedor iptv",
      "revendedor iptv white label",
    ],
    fr: [
      "programme revendeur iptv",
      "devenir revendeur iptv",
      "revendeur iptv",
      "iptv white label",
      "panneau revendeur iptv",
      "business iptv",
      "démarrer business iptv",
      "compte revendeur iptv",
      "tarifs revendeur iptv",
      "support revendeur iptv",
      "plateforme revendeur iptv",
      "crédits revendeur iptv",
      "avantages programme revendeur iptv",
      "opportunité revendeur iptv",
      "revendeur iptv white label",
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
  const currentUrl = getInstallationUrl('iptv-reseller-program', locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  
  // Generate alternates with language-specific URLs
  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const altUrl = getInstallationUrl('iptv-reseller-program', loc);
    languageAlternates[loc] = `${baseUrl}${altUrl}`;
  });
  languageAlternates['x-default'] = `${baseUrl}${getInstallationUrl('iptv-reseller-program', 'en')}`;

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

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
