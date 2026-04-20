import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import BlogPostContent from "./BlogPostContent";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

function getSafeImageUrl(value: string | undefined): string {
  if (!value || value.startsWith("blob:")) return `${baseUrl}/images/hero.png`;
  if (value.startsWith("/")) return `${baseUrl}${value}`;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return value;
    }
  } catch {
    // Ignore and fallback below.
  }
  return `${baseUrl}/images/hero.png`;
}

// Ensure dynamic rendering for blog posts (they're created dynamically)
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

interface BlogPostPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  let blog = null;

  try {
    // Fetch blog data server-side - this ensures Googlebot sees the content
    blog = await getBlogBySlug(slug, locale);
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }

  // If blog not found, return 404
  if (!blog) {
    notFound();
  }

  const title = (blog.title[locale] || "").trim() || "Blog Post";
  const metaDesc = (blog.meta?.description?.[locale] || "").trim();
  const excerptLocale = (blog.excerpt[locale] || "").trim();
  const schemaDescription = metaDesc || excerptLocale;
  const imageUrl = getSafeImageUrl(blog.featuredImage);
  const localizedPath = getBlogUrl(blog, locale);
  const articleUrl =
    localizedPath && !localizedPath.includes("/blog//")
      ? `${baseUrl}${localizedPath}`
      : `${baseUrl}/${locale}/blog/${slug}/`;

  // Article schema for rich results in search (FAQ, how-to, article snippets)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: schemaDescription,
    image: imageUrl,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: blog.author
      ? { "@type": "Person", name: blog.author }
      : { "@type": "Organization", name: "StreamPro", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "StreamPro - Premium IPTV Service",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/IPTVSMARTERSNL-LOGO.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostContent blog={blog} locale={locale} />
    </>
  );
}

