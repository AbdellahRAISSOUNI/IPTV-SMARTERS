import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';

  // English slugs that should be disallowed in non-English locales
  // These will redirect, but we don't want Google to crawl/index them
  const englishSlugs = [
    'iptv-installation-guide',
    'iptv-installation-ios',
    'iptv-installation-windows',
    'iptv-installation-smart-tv',
    'iptv-installation-firestick',
    'iptv-reseller-program',
    'refund-policy',
    'privacy-policy',
    'terms-of-service',
  ];

  // Build disallow patterns for English slugs in Spanish and French
  const disallowPatterns = [
    '/api/',
    '/admin/',
    // Disallow English slugs in Spanish locale
    ...englishSlugs.map(slug => `/es/${slug}`),
    ...englishSlugs.map(slug => `/es/${slug}/`),
    // Disallow English slugs in French locale
    ...englishSlugs.map(slug => `/fr/${slug}`),
    ...englishSlugs.map(slug => `/fr/${slug}/`),
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPatterns,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowPatterns,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowPatterns,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

