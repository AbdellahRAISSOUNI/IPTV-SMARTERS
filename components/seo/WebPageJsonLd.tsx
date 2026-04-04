type WebPageJsonLdProps = {
  url: string;
  name: string;
  description: string;
  locale: string;
  keywords?: string[];
  siteUrl: string;
};

/**
 * WebPage + WebSite linkage for crawlers; `keywords` maps CreativeWork.keywords in schema.org.
 */
export function WebPageJsonLd({ url, name, description, locale, keywords, siteUrl }: WebPageJsonLdProps) {
  const inLanguage =
    locale === "en" ? "en-US" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : locale;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name,
    description,
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: "StreamPro",
      url: siteUrl,
    },
  };

  if (keywords?.length) {
    data.keywords = keywords.join(", ");
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
