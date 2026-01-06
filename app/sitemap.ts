import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getAllBlogs } from '@/lib/admin/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour for fresh blog posts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';

  // Generate sitemap entries for each locale
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Homepage
    { path: '/iptv-installation-guide', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/iptv-installation-ios', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/iptv-installation-smart-tv', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/iptv-installation-windows', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/iptv-installation-firestick', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/iptv-reseller-program', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  ];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${locale}${route.path}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}${route.path}`])
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
      
      blogLocales.forEach((blogLocale) => {
        if (locales.includes(blogLocale as any)) {
          const url = `${baseUrl}/${blogLocale}/blog/${blog.slug}`;
          sitemapEntries.push({
            url,
            lastModified: new Date(blog.updatedAt || blog.publishedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                blogLocales.map((loc) => [loc, `${baseUrl}/${loc}/blog/${blog.slug}`])
              ),
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

