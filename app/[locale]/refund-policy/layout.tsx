import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalRefundSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildLegalHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { getLegalUrl } from "@/lib/utils/installation-slugs";

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
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
    en: "Refund Policy | StreamPro IPTV",
    ca: "Refund Policy | StreamPro IPTV",
    uk: "Refund Policy | StreamPro IPTV UK",
    es: "Política de Reembolso | StreamPro IPTV",
    fr: "Politique de Remboursement | StreamPro IPTV",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Read StreamPro IPTV’s refund policy, including eligibility, timelines, and how to request a refund for your IPTV subscription.",
    ca: "Read StreamPro IPTV’s refund policy, including eligibility, timelines, and how to request a refund for your IPTV subscription.",
    uk: "Read StreamPro IPTV UK’s refund policy, including eligibility, timelines, and how to request a refund for your GBP IPTV subscription.",
    es: "Consulta la política de reembolso de StreamPro IPTV, incluyendo elegibilidad, plazos y cómo solicitar un reembolso de tu suscripción IPTV.",
    fr: "Consultez la politique de remboursement de StreamPro IPTV, y découvrez l’éligibilité, les délais et comment demander un remboursement pour votre abonnement IPTV.",
  };

  const keywords = getRouteMetaKeywords(locale, "legal", legalRefundSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("refund-policy", locale)}`;
  const languageAlternates = buildLegalHreflangAlternates(
    baseUrl,
    "refund-policy",
    getLegalUrl
  );

  return buildSocialMetadata({
    title: titleMap[locale],
    description: descriptionMap[locale],
    locale,
    canonicalUrl,
    keywords,
    type: "website",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function RefundPolicyLayout({
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
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
    en: "Refund Policy | StreamPro IPTV",
    ca: "Refund Policy | StreamPro IPTV",
    uk: "Refund Policy | StreamPro IPTV UK",
    es: "Política de Reembolso | StreamPro IPTV",
    fr: "Politique de Remboursement | StreamPro IPTV",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Read StreamPro IPTV’s refund policy, including eligibility, timelines, and how to request a refund for your IPTV subscription.",
    ca: "Read StreamPro IPTV’s refund policy, including eligibility, timelines, and how to request a refund for your IPTV subscription.",
    uk: "Read StreamPro IPTV UK’s refund policy, including eligibility, timelines, and how to request a refund for your GBP IPTV subscription.",
    es: "Consulta la política de reembolso de StreamPro IPTV, incluyendo elegibilidad, plazos y cómo solicitar un reembolso de tu suscripción IPTV.",
    fr: "Consultez la politique de remboursement de StreamPro IPTV, y découvrez l’éligibilité, les délais et comment demander un remboursement pour votre abonnement IPTV.",
  };

  const keywords = getRouteMetaKeywords(locale, "legal", legalRefundSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("refund-policy", locale)}`;

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={titleMap[locale]}
        description={descriptionMap[locale]}
        locale={locale}
        keywords={keywords}
        siteUrl={`${baseUrl}/${locale}/`}
      />
      {children}
    </>
  );
}
