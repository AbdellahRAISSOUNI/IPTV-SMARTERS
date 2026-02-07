import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import BlogPostContent from "./BlogPostContent";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

// Ensure dynamic rendering for blog posts (they're created dynamically)
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

interface BlogPostPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  try {
    // Fetch blog data server-side - this ensures Googlebot sees the content
    const blog = await getBlogBySlug(slug, locale);

    // If blog not found, return 404
    if (!blog) {
      notFound();
    }

    const title = blog.title[locale] || blog.title[blog.locale] || "Blog Post";
    const imageUrl = blog.featuredImage
      ? blog.featuredImage.startsWith("http")
        ? blog.featuredImage
        : `${baseUrl}${blog.featuredImage}`
      : `${baseUrl}/images/hero.png`;
    const articleUrl = `${baseUrl}${getBlogUrl(blog, locale)}`;

    // Article schema for rich results in search (FAQ, how-to, article snippets)
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: blog.excerpt[locale] || blog.excerpt[blog.locale] || "",
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
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}

