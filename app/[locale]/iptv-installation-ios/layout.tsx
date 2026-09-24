import { buildHreflangAlternatesForPaths } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getInstallationMetadata } from "@/lib/utils/metadata-loader";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { iosInstallationSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getSiteBaseUrl();

  const pageMetadata = await getInstallationMetadata(locale, "ios");
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const keywords = getRouteMetaKeywords(locale, "ios", iosInstallationSeeds[locale]);

  const currentUrl = getInstallationUrl("iptv-installation-ios", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates = buildHreflangAlternatesForPaths(baseUrl, (loc) =>
    getInstallationUrl("iptv-installation-ios", loc)
  );

  return buildSocialMetadata({
    title,
    description,
    locale,
    canonicalUrl,
    keywords,
    type: "article",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function IosInstallationLayout({
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
  const pageMetadata = await getInstallationMetadata(locale, "ios");
  const currentUrl = getInstallationUrl("iptv-installation-ios", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  const siteUrl = `${baseUrl}/${locale}/`;
  const keywords = getRouteMetaKeywords(locale, "ios", iosInstallationSeeds[locale]);

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={siteUrl}
      />
      {children}
    </>
  );
}
