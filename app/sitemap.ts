import { MetadataRoute } from 'next';
import { locales, type Locale } from '@/lib/i18n';
import { getAllBlogs } from '@/lib/admin/blog';
import {
  getInstallationUrl,
  getResellerUrl,
  getLegalUrl,
} from '@/lib/utils/installation-slugs';
import { getAllBlogSlugs } from '@/lib/utils/blog-slugs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour for fresh blog posts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';
  const toAbsoluteUrl = (pathOrUrl: string): string | null => {
    try {
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return new URL(pathOrUrl).toString();
      }
      return new URL(pathOrUrl, baseUrl).toString();
    } catch {
      return null;
    }
  };
  const getSafeBlogPath = (blog: Awaited<ReturnType<typeof getAllBlogs>>[number], locale: Locale): string | null => {
    const slugMap = getAllBlogSlugs(blog);
    const rawSlug = (slugMap[locale] || '').trim();
    if (!rawSlug) return null;
    return `/${locale}/blog/${encodeURIComponent(rawSlug)}/`;
  };

  // Installation guides (use getInstallationUrl for localized slugs)
  const installationEnglishSlugs = [
    'iptv-installation-guide',
    'iptv-installation-ios',
    'iptv-installation-smart-tv',
    'iptv-installation-windows',
    'iptv-installation-firestick',
  ];

  const resellerEnglishSlugs = ['iptv-reseller-program'] as const;
  const legalEnglishSlugs = [
    'refund-policy',
    'privacy-policy',
    'terms-of-service',
  ] as const;

  // Other static routes
  const otherRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Homepage
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  ];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const pushLocalizedGroup = (opts: {
    englishSlugs: readonly string[];
    pathForLocale: (englishSlug: string, locale: Locale) => string;
    priority: (englishSlug: string) => number;
  }) => {
    opts.englishSlugs.forEach((englishSlug) => {
      locales.forEach((locale) => {
        const localizedPath = opts.pathForLocale(englishSlug, locale);
        const url = toAbsoluteUrl(localizedPath);
        if (!url) return;

        const alternates: Record<string, string> = {};
        locales.forEach((loc) => {
          const alt = toAbsoluteUrl(opts.pathForLocale(englishSlug, loc));
          if (alt) alternates[loc] = alt;
        });

        sitemapEntries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: opts.priority(englishSlug),
          alternates: {
            languages: alternates,
          },
        });
      });
    });
  };

  pushLocalizedGroup({
    englishSlugs: installationEnglishSlugs,
    pathForLocale: getInstallationUrl,
    priority: (slug) => (slug === 'iptv-installation-guide' ? 0.9 : 0.85),
  });

  pushLocalizedGroup({
    englishSlugs: resellerEnglishSlugs,
    pathForLocale: getResellerUrl,
    priority: () => 0.9,
  });

  pushLocalizedGroup({
    englishSlugs: legalEnglishSlugs,
    pathForLocale: getLegalUrl,
    priority: () => 0.55,
  });

  // Add other static routes
  locales.forEach((locale) => {
    otherRoutes.forEach((route) => {
      // Ensure trailing slash for consistency with next.config trailingSlash: true
      const pathWithSlash = route.path === '' ? '/' : route.path.endsWith('/') ? route.path : `${route.path}/`;
      const url = toAbsoluteUrl(`/${locale}${pathWithSlash}`);
      if (!url) return;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => {
              const altPathWithSlash = route.path === '' ? '/' : route.path.endsWith('/') ? route.path : `${route.path}/`;
              return [loc, toAbsoluteUrl(`/${loc}${altPathWithSlash}`)];
            })
            .filter(([, v]) => Boolean(v)) as [string, string][]
          ),
        },
      });
    });
  });

  // Add blog posts dynamically
  try {
    const blogs = await getAllBlogs();
    blogs.forEach((blog) => {
      // Get all slugs for this blog to determine which locales have valid slugs
      const allSlugs = getAllBlogSlugs(blog);
      
      // Determine which locales should be included in sitemap
      // Include all locales that have non-empty slugs (not just those in translations array)
      const blogLocales: Locale[] = [];
      locales.forEach((locale) => {
        const slug = allSlugs[locale];
        // Include locale if it has a slug (even if empty content - slug means it's a valid URL)
        if (slug && slug.trim() !== '') {
          blogLocales.push(locale);
        }
      });
      
      // Fallback: if no valid slugs found, use translations array or primary locale
      const finalLocales = blogLocales.length > 0 
        ? blogLocales 
        : (blog.translations && blog.translations.length > 0 
          ? blog.translations.filter((loc): loc is Locale => locales.includes(loc as Locale))
          : [blog.locale as Locale].filter((loc): loc is Locale => locales.includes(loc)));
      
      // Generate alternates map for all valid locales
      const alternates: Record<string, string> = {};
      blogLocales.forEach((loc) => {
        const altBlogUrl = getSafeBlogPath(blog, loc);
        if (!altBlogUrl) return;
        const absoluteAlt = toAbsoluteUrl(altBlogUrl);
        if (absoluteAlt) alternates[loc] = absoluteAlt;
      });
      
      // Add sitemap entry for each valid locale
      finalLocales.forEach((blogLocale) => {
        const blogUrl = getSafeBlogPath(blog, blogLocale);
        if (!blogUrl) return;
        const url = toAbsoluteUrl(blogUrl); // getBlogUrl now includes trailing slash
        if (!url) return;
        
        sitemapEntries.push({
          url,
          lastModified: new Date(blog.updatedAt || blog.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: alternates,
          },
        });
      });
    });
  } catch (error) {
    // If blog fetching fails, just continue without blog posts
    console.error('Error fetching blogs for sitemap:', error);
  }

  return sitemapEntries;
}

