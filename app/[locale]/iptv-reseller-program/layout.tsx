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
    en: "IPTV Reseller Program | Become an IPTV Reseller | White Label IPTV Business | Start Your IPTV Business",
    es: "Programa Revendedor IPTV | Conviértete en Revendedor IPTV | Negocio IPTV White Label | Inicia tu Negocio IPTV",
    fr: "Programme Revendeur IPTV | Devenir Revendeur IPTV | Business IPTV White Label | Démarrer votre Business IPTV",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Become an IPTV reseller and start your own streaming business. White label IPTV reseller program with competitive pricing, dedicated support, and instant activation. Join our IPTV reseller program today and earn profits selling premium IPTV services.",
    es: "Conviértete en revendedor IPTV y comienza tu propio negocio de streaming. Programa revendedor IPTV white label con precios competitivos, soporte dedicado y activación instantánea. Únete a nuestro programa revendedor IPTV hoy y gana beneficios vendiendo servicios IPTV premium.",
    fr: "Devenez revendeur IPTV et démarrez votre propre business de streaming. Programme revendeur IPTV white label avec tarifs compétitifs, support dédié et activation instantanée. Rejoignez notre programme revendeur IPTV aujourd'hui et gagnez des profits en vendant des services IPTV premium.",
  };

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

  return {
    title: titleMap[locale],
    description: descriptionMap[locale],
    keywords: keywordsMap[locale],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/iptv-reseller-program`,
      languages: {
        en: `${baseUrl}/en/iptv-reseller-program`,
        es: `${baseUrl}/es/iptv-reseller-program`,
        fr: `${baseUrl}/fr/iptv-reseller-program`,
        "x-default": `${baseUrl}/en/iptv-reseller-program`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/iptv-reseller-program`,
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
