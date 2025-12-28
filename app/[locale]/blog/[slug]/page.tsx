"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/admin/blog";

export default function BlogPostPage() {
  const { t, locale } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        // Use public API endpoint
        const response = await fetch(`/api/blogs?slug=${slug}&locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    loadBlog();
  }, [slug, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  const displayTitle = blog.title[locale] || blog.title[blog.locale] || "Untitled";
  const displayExcerpt =
    blog.excerpt[locale] || blog.excerpt[blog.locale] || "";

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "heading":
        const level = block.level || 2;
        const headingClassName = `font-bold text-[#1a1a1a] mb-4 mt-8 first:mt-0 ${
          level === 1
            ? "text-4xl sm:text-5xl"
            : level === 2
            ? "text-3xl sm:text-4xl"
            : level === 3
            ? "text-2xl sm:text-3xl"
            : "text-xl sm:text-2xl"
        }`;
        const headingStyle = { textAlign: block.style?.textAlign || "left" } as React.CSSProperties;
        
        if (level === 1) return <h1 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h1>;
        if (level === 2) return <h2 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h2>;
        if (level === 3) return <h3 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h3>;
        if (level === 4) return <h4 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h4>;
        if (level === 5) return <h5 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h5>;
        return <h6 key={block.id} className={headingClassName} style={headingStyle}>{block.content}</h6>;

      case "paragraph":
        return (
          <p
            key={block.id}
            className="text-base sm:text-lg text-[#1a1a1a]/80 leading-relaxed mb-6"
            style={{ textAlign: block.style?.textAlign || "left" }}
          >
            {block.content}
          </p>
        );

      case "image":
        if (!block.imageUrl || block.imageUrl.startsWith('blob:')) return null; // Don't render blob URLs in public pages
        
        return (
          <div
            key={block.id}
            className={`mb-8 ${
              block.imageAlign === "center"
                ? "flex justify-center"
                : block.imageAlign === "right"
                ? "flex justify-end"
                : ""
            }`}
          >
            <div
              className={`relative ${
                block.imageWidth === "full"
                  ? "w-full"
                  : block.imageWidth === "half"
                  ? "w-full md:w-1/2"
                  : block.imageWidth === "third"
                  ? "w-full md:w-1/3"
                  : block.imageWidth === "quarter"
                  ? "w-full md:w-1/4"
                  : "w-full"
              }`}
            >
              <Image
                src={block.imageUrl}
                alt={block.imageAlt || displayTitle}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                unoptimized={false}
              />
            </div>
          </div>
        );

      case "quote":
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-[#2563eb] pl-6 py-4 my-8 italic text-lg text-[#1a1a1a]/70 bg-gray-50 rounded-r-lg"
          >
            {block.content}
          </blockquote>
        );

      case "list":
        return (
          <ul key={block.id} className="list-disc list-inside mb-6 space-y-2 text-[#1a1a1a]/80">
            {block.listItems?.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="text-base sm:text-lg">
                {item}
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#1d4ed8] mb-8 font-medium"
          >
            ← {t("blog.backToBlog")}
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4">
              {displayTitle}
            </h1>
            {displayExcerpt && (
              <p className="text-xl sm:text-2xl text-[#1a1a1a]/70 mb-6">{displayExcerpt}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {blog.author && <span>By {blog.author}</span>}
              <span>
                {new Date(blog.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {blog.featuredImage && !blog.featuredImage.startsWith('blob:') && (
            <div className="relative w-full h-64 sm:h-96 mb-12 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={blog.featuredImage}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
                unoptimized={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 896px"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {blog.blocks.map((block, index) => renderBlock(block, index))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

