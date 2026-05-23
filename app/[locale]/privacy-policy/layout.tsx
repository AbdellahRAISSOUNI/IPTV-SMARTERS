import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalPrivacySeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildHreflangAlternatesForPaths } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

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
    en: "Privacy Policy | StreamPro IPTV Smarters Pro",
    ca: "Privacy Policy | StreamPro IPTV Canada",
    es: "Política de Privacidad | StreamPro IPTV Smarters Pro",
    fr: "Politique de Confidentialité | StreamPro IPTV Smarters Pro",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Learn how StreamPro IPTV Smarters Pro collects, uses, and protects your personal data when you use our IPTV service and website.",
    ca: "Learn how StreamPro IPTV Canada collects, uses, and protects your personal data when you use our IPTV service and website.",
    es: "Descubre cómo StreamPro IPTV Smarters Pro recopila, utiliza y protege tus datos personales al usar nuestro servicio IPTV y el sitio web.",
    fr: "Découvrez comment StreamPro IPTV Smarters Pro collecte, utilise et protège vos données personnelles lorsque vous utilisez notre service IPTV et notre site web.",
  };

  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);
  const canonicalUrl = `${baseUrl}/${locale}/privacy-policy/`;
  const languageAlternates = buildHreflangAlternatesForPaths(
    baseUrl,
    (loc) => `/${loc}/privacy-policy/`
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

export default async function PrivacyPolicyLayout({
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
    en: "Privacy Policy | StreamPro IPTV Smarters Pro",
    ca: "Privacy Policy | StreamPro IPTV Canada",
    es: "Política de Privacidad | StreamPro IPTV Smarters Pro",
    fr: "Politique de Confidentialité | StreamPro IPTV Smarters Pro",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Learn how StreamPro IPTV Smarters Pro collects, uses, and protects your personal data when you use our IPTV service and website.",
    ca: "Learn how StreamPro IPTV Canada collects, uses, and protects your personal data when you use our IPTV service and website.",
    es: "Descubre cómo StreamPro IPTV Smarters Pro recopila, utiliza y protege tus datos personales al usar nuestro servicio IPTV y el sitio web.",
    fr: "Découvrez comment StreamPro IPTV Smarters Pro collecte, utilise et protège vos données personnelles lorsque vous utilisez notre service IPTV et notre site web.",
  };

  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);
  const canonicalUrl = `${baseUrl}/${locale}/privacy-policy/`;

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
