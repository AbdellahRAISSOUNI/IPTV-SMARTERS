import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!locales.includes(localeParam as Locale)) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const locale = localeParam as Locale;

  const titleMap: Record<Locale, string> = {
    en: "Refund Policy | StreamPro IPTV",
    es: "Política de Reembolso | StreamPro IPTV",
    fr: "Politique de Remboursement | StreamPro IPTV",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Read StreamPro IPTV’s refund policy, including eligibility, timelines, and how to request a refund for your IPTV subscription.",
    es: "Consulta la política de reembolso de StreamPro IPTV, incluyendo elegibilidad, plazos y cómo solicitar un reembolso de tu suscripción IPTV.",
    fr: "Consultez la politique de remboursement de StreamPro IPTV, y découvrez l’éligibilité, les délais et comment demander un remboursement pour votre abonnement IPTV.",
  };

  const keywordsMap: Record<Locale, string[]> = {
    en: ["iptv refund policy", "iptv subscription refund", "money back iptv", "refund iptv"],
    es: ["política de reembolso iptv", "reembolso suscripción iptv", "garantía reembolso iptv", "reembolso iptv"],
    fr: ["politique de remboursement iptv", "remboursement abonnement iptv", "garantie remboursement iptv", "remboursement iptv"],
  };

  const canonicalUrl = `${baseUrl}/${locale}/refund-policy/`;
  const languageAlternates: Record<string, string> = {
    en: `${baseUrl}/en/refund-policy/`,
    es: `${baseUrl}/es/refund-policy/`,
    fr: `${baseUrl}/fr/refund-policy/`,
    "x-default": `${baseUrl}/en/refund-policy/`,
  };

  const title = titleMap[locale];
  const description = descriptionMap[locale];

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
      locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "fr_FR",
      url: canonicalUrl,
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
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

