import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalPrivacySeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";

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
    en: "Privacy Policy | StreamPro IPTV Smarters Pro",
    es: "Política de Privacidad | StreamPro IPTV Smarters Pro",
    fr: "Politique de Confidentialité | StreamPro IPTV Smarters Pro",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Learn how StreamPro IPTV Smarters Pro collects, uses, and protects your personal data when you use our IPTV service and website.",
    es: "Descubre cómo StreamPro IPTV Smarters Pro recopila, utiliza y protege tus datos personales al usar nuestro servicio IPTV y el sitio web.",
    fr: "Découvrez comment StreamPro IPTV Smarters Pro collecte, utilise et protège vos données personnelles lorsque vous utilisez notre service IPTV et notre site web.",
  };

  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);

  const currentUrl = `/${locale}/privacy-policy/`;
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${baseUrl}/${loc}/privacy-policy/`;
  });
  languageAlternates["x-default"] = `${baseUrl}/en/privacy-policy/`;

  const title = titleMap[locale];
  const description = descriptionMap[locale];

  return {
    title,
    description,
    keywords,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
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
  const titleMap: Record<Locale, string> = {
    en: "Privacy Policy | StreamPro IPTV Smarters Pro",
    es: "Política de Privacidad | StreamPro IPTV Smarters Pro",
    fr: "Politique de Confidentialité | StreamPro IPTV Smarters Pro",
  };
  const descriptionMap: Record<Locale, string> = {
    en: "Learn how StreamPro IPTV Smarters Pro collects, uses, and protects your personal data when you use our IPTV service and website.",
    es: "Descubre cómo StreamPro IPTV Smarters Pro recopila, utiliza y protege tus datos personales al usar nuestro servicio IPTV y el sitio web.",
    fr: "Découvrez comment StreamPro IPTV Smarters Pro collecte, utilise et protège vos données personnelles lorsque vous utilisez notre service IPTV et notre site web.",
  };
  const canonicalUrl = `${baseUrl}/${locale}/privacy-policy/`;
  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);

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

