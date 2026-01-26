import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import BlogPostContent from "./BlogPostContent";

// Ensure dynamic rendering for blog posts (they're created dynamically)
export const dynamic = 'force-dynamic';
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
    
    // Pass blog data to client component for rendering
    return <BlogPostContent blog={blog} locale={locale} />;
  } catch (error) {
    console.error("Error loading blog post:", error);
    // Return 404 on any error to prevent Soft 404
    notFound();
  }
}

