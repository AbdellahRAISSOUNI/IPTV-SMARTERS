import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { locales } from "@/lib/i18n";
import { getInstallationMetadata } from "@/lib/utils/metadata-loader";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { installationGuideSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildHreflangAlternatesForPaths } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getSiteBaseUrl();

  const pageMetadata = await getInstallationMetadata(locale, "guide");
  const title = pageMetadata.title;
  const description = pageMetadata.description;

  const keywords = getRouteMetaKeywords(locale, "guide", installationGuideSeeds[locale]);

  const currentUrl = getInstallationUrl("iptv-installation-guide", locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates = buildHreflangAlternatesForPaths(baseUrl, (loc) =>
    getInstallationUrl("iptv-installation-guide", loc)
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

export default async function InstallationGuideLayout({
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
  const pageMetadata = await getInstallationMetadata(locale, "guide");
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";
  const canonicalUrl = `${base}${getInstallationUrl("iptv-installation-guide", locale)}`;
  const keywords = getRouteMetaKeywords(locale, "guide", installationGuideSeeds[locale]);

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={`${base}/${locale}/`}
      />
      {children}
    </>
  );
}
