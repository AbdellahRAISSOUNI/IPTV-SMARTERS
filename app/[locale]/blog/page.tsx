import type { Locale } from "@/lib/i18n";
import { getAllBlogs } from "@/lib/admin/blog";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import BlogListingClient from "./BlogListingClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

export const revalidate = 3600; // Revalidate every hour so new posts appear

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  let blogs = await getAllBlogs();
  // Sort newest first
  blogs = [...blogs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // ItemList schema for SEO - helps search engines understand the listing
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IPTV Blog - Latest Articles & Guides",
    description: "Latest articles, guides, and updates about IPTV and streaming.",
    url: `${baseUrl}/${locale}/blog/`,
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, index) => {
      const title = blog.title[locale] || blog.title[blog.locale] || "Untitled";
      const url = `${baseUrl}${getBlogUrl(blog, locale)}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          name: title,
          url,
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt,
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BlogListingClient initialBlogs={blogs} locale={locale} />
    </>
  );
}
