import { MetadataRoute } from 'next';
import { locales, type Locale } from '@/lib/i18n';
import { getAllBlogs } from '@/lib/admin/blog';
import { getInstallationUrl } from '@/lib/utils/installation-slugs';
import { getBlogUrl, getAllBlogSlugs } from '@/lib/utils/blog-slugs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour for fresh blog posts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';

  // Pages with language-specific slugs (installation + reseller)
  const localizedPages = [
    'iptv-installation-guide',
    'iptv-installation-ios',
    'iptv-installation-smart-tv',
    'iptv-installation-windows',
    'iptv-installation-firestick',
    'iptv-reseller-program',
  ];

  // Other static routes
  const otherRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Homepage
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  ];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add pages with language-specific URLs (installation + reseller)
  localizedPages.forEach((englishSlug) => {
    locales.forEach((locale) => {
      // getInstallationUrl returns full path with locale and trailing slash (e.g., /en/iptv-installation-guide/)
      const localizedPath = getInstallationUrl(englishSlug, locale);
      const url = `${baseUrl}${localizedPath}`;
      
      // Generate alternates with language-specific URLs (canonical localized slugs)
      const alternates: Record<string, string> = {};
      locales.forEach((loc) => {
        const altPath = getInstallationUrl(englishSlug, loc);
        alternates[loc] = `${baseUrl}${altPath}`;
      });
      
      // Set priority based on page type
      let priority = 0.85;
      if (englishSlug === 'iptv-installation-guide' || englishSlug === 'iptv-reseller-program') {
        priority = 0.9;
      }
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
        alternates: {
          languages: alternates,
        },
      });
    });
  });

  // Add other static routes
  locales.forEach((locale) => {
    otherRoutes.forEach((route) => {
      // Ensure trailing slash for consistency with next.config trailingSlash: true
      const pathWithSlash = route.path === '' ? '/' : route.path.endsWith('/') ? route.path : `${route.path}/`;
      const url = `${baseUrl}/${locale}${pathWithSlash}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => {
              const altPathWithSlash = route.path === '' ? '/' : route.path.endsWith('/') ? route.path : `${route.path}/`;
              return [loc, `${baseUrl}/${loc}${altPathWithSlash}`];
            })
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
        const altBlogUrl = getBlogUrl(blog, loc);
        alternates[loc] = `${baseUrl}${altBlogUrl}`;
      });
      
      // Add sitemap entry for each valid locale
      finalLocales.forEach((blogLocale) => {
        const blogUrl = getBlogUrl(blog, blogLocale);
        const url = `${baseUrl}${blogUrl}`; // getBlogUrl now includes trailing slash
        
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

