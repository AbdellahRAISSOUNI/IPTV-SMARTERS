import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';

  // English slugs that redirect in non-English locales - prevent Google from discovering them
  const englishSlugPatterns = [
    '/es/iptv-installation-guide',
    '/es/iptv-installation-ios',
    '/es/iptv-installation-windows',
    '/es/iptv-installation-smart-tv',
    '/es/iptv-installation-firestick',
    '/es/iptv-reseller-program',
    '/es/refund-policy',
    '/es/privacy-policy',
    '/es/terms-of-service',
    '/fr/iptv-installation-guide',
    '/fr/iptv-installation-ios',
    '/fr/iptv-installation-windows',
    '/fr/iptv-installation-smart-tv',
    '/fr/iptv-installation-firestick',
    '/fr/iptv-reseller-program',
    '/fr/refund-policy',
    '/fr/privacy-policy',
    '/fr/terms-of-service',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', ...englishSlugPatterns],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', ...englishSlugPatterns],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', ...englishSlugPatterns],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

