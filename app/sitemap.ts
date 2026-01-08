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
      const localizedPath = getInstallationUrl(englishSlug, locale).replace(`/${locale}`, '');
      const url = `${baseUrl}${localizedPath}/`; // Add trailing slash for consistency with next.config trailingSlash: true
      
      // Generate alternates with language-specific URLs
      const alternates: Record<string, string> = {};
      locales.forEach((loc) => {
        const altPath = getInstallationUrl(englishSlug, loc).replace(`/${loc}`, '');
        alternates[loc] = `${baseUrl}${altPath}/`; // Add trailing slash
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
      // Add blog post for each available translation
      const blogLocales = blog.translations && blog.translations.length > 0 
        ? blog.translations 
        : [blog.locale];
      
      // Get all slugs for this blog
      const allSlugs = getAllBlogSlugs(blog);
      
      blogLocales.forEach((blogLocale) => {
        if (locales.includes(blogLocale as any)) {
          const blogUrl = getBlogUrl(blog, blogLocale as Locale);
          const url = `${baseUrl}${blogUrl}`; // getBlogUrl now includes trailing slash
          
          // Generate alternates with language-specific slugs
          const alternates: Record<string, string> = {};
          blogLocales.forEach((loc) => {
            if (locales.includes(loc as any)) {
              const altBlogUrl = getBlogUrl(blog, loc as Locale);
              alternates[loc] = `${baseUrl}${altBlogUrl}`; // getBlogUrl now includes trailing slash
            }
          });
          
          sitemapEntries.push({
            url,
            lastModified: new Date(blog.updatedAt || blog.publishedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: alternates,
            },
          });
        }
      });
    });
  } catch (error) {
    // If blog fetching fails, just continue without blog posts
    console.error('Error fetching blogs for sitemap:', error);
  }

  return sitemapEntries;
}

