import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://iptv-smarters.vercel.app";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titleMap: Record<Locale, string> = {
    en: "IPTV Blog - Latest News, Guides & Tips | StreamPro",
    es: "Blog IPTV - Últimas Noticias, Guías y Consejos | StreamPro",
    fr: "Blog IPTV - Dernières Nouvelles, Guides et Conseils | StreamPro",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Read the latest IPTV news, installation guides, tips, and tutorials. Learn how to get the most out of your IPTV Smarters Pro subscription. Expert advice and step-by-step guides.",
    es: "Lee las últimas noticias de IPTV, guías de instalación, consejos y tutoriales. Aprende cómo aprovechar al máximo tu suscripción IPTV Smarters Pro. Consejos de expertos y guías paso a paso.",
    fr: "Lisez les dernières actualités IPTV, guides d'installation, conseils et tutoriels. Apprenez à tirer le meilleur parti de votre abonnement IPTV Smarters Pro. Conseils d'experts et guides étape par étape.",
  };

  const title = titleMap[locale];
  const description = descriptionMap[locale];

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        es: `${baseUrl}/es/blog`,
        fr: `${baseUrl}/fr/blog`,
        "x-default": `${baseUrl}/en/blog`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/blog`,
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
