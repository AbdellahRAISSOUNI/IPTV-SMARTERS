"use client";

import { useEffect, useState, useRef } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    async function loadBlog() {
      try {
        // Use public API endpoint
        const response = await fetch(`/api/blogs?slug=${slug}&locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          if (isMountedRef.current) {
            setBlog(data);
          }
        } else {
          if (isMountedRef.current) {
            notFound();
          }
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        if (isMountedRef.current) {
          notFound();
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }
    loadBlog();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [slug, locale]);

  // Update meta tags for SEO when blog loads - simplified to avoid navigation issues
  useEffect(() => {
    if (!blog || !isMountedRef.current) return;
    if (typeof document === 'undefined') return;

    const displayTitle = blog.title[locale] || blog.title[blog.locale] || "Untitled";
    const displayExcerpt = blog.excerpt[locale] || blog.excerpt[blog.locale] || "";

    // Only update title - minimal DOM manipulation
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current && document) {
        try {
          document.title = `${displayTitle} | StreamPro`;
        } catch (e) {
          // Ignore errors
        }
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      // No cleanup needed - Next.js will handle metadata on navigation
    };
  }, [blog, locale]);

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

  // Helper to get content for current locale
  const getBlockContent = (block: any): string => {
    if (typeof block.content === 'string') {
      return block.content;
    }
    if (block.content && typeof block.content === 'object') {
      return block.content[locale] || block.content[blog.locale] || block.content['en'] || '';
    }
    return '';
  };

  // Helper to parse markdown-like formatting (bold, italic, links)
  const parseMarkdown = (text: string) => {
    if (!text) return text;
    
    // Parse links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#2563eb] hover:underline">$1</a>');
    
    // Parse bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Parse italic: *text*
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    return text;
  };

  const renderBlock = (block: any, index: number) => {
    const blockContent = getBlockContent(block);
    
    switch (block.type) {
      case "heading":
        const level = block.level || 2;
        const headingClassName = `font-bold text-[#1a1a1a] mb-3 sm:mb-4 mt-6 sm:mt-8 first:mt-0 ${
          level === 1
            ? "text-2xl sm:text-3xl md:text-4xl"
            : level === 2
            ? "text-xl sm:text-2xl md:text-3xl"
            : level === 3
            ? "text-lg sm:text-xl md:text-2xl"
            : "text-base sm:text-lg md:text-xl"
        }`;
        const headingStyle = { textAlign: block.style?.textAlign || "left" } as React.CSSProperties;
        
        if (level === 1) return <h1 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h1>;
        if (level === 2) return <h2 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h2>;
        if (level === 3) return <h3 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h3>;
        if (level === 4) return <h4 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h4>;
        if (level === 5) return <h5 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h5>;
        return <h6 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h6>;

      case "paragraph":
        const parsedContent = parseMarkdown(blockContent);
        return (
          <p
            key={block.id}
            className="text-sm sm:text-base md:text-lg text-[#1a1a1a]/80 leading-relaxed mb-4 sm:mb-6"
            style={{ textAlign: block.style?.textAlign || "left" }}
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        );

      case "image":
        if (!block.imageUrl || block.imageUrl.startsWith('blob:')) return null; // Don't render blob URLs in public pages
        
        // Determine max width based on imageWidth setting
        const getImageMaxWidth = () => {
          switch (block.imageWidth) {
            case "full":
              return "w-full max-w-full";
            case "half":
              return "w-full sm:w-full md:w-1/2 max-w-md";
            case "third":
              return "w-full sm:w-2/3 md:w-1/3 max-w-xs";
            case "quarter":
              return "w-full sm:w-1/2 md:w-1/4 max-w-[200px]";
            default:
              return "w-full max-w-md";
          }
        };
        
        return (
          <div
            key={block.id}
            className={`mb-4 sm:mb-6 md:mb-8 ${
              block.imageAlign === "center"
                ? "flex justify-center"
                : block.imageAlign === "right"
                ? "flex justify-end sm:justify-end"
                : "flex justify-start"
            }`}
          >
            <div className={`relative ${getImageMaxWidth()}`}>
              <Image
                src={block.imageUrl}
                alt={typeof block.imageAlt === 'string' ? block.imageAlt : (block.imageAlt?.[locale] || block.imageAlt?.[blog.locale] || displayTitle)}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
                unoptimized={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        );

      case "quote":
        const quoteContent = getBlockContent(block);
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-[#2563eb] pl-3 sm:pl-4 md:pl-6 py-3 sm:py-4 my-4 sm:my-6 md:my-8 italic text-sm sm:text-base md:text-lg text-[#1a1a1a]/70 bg-gray-50 rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(quoteContent) }}
          />
        );

      case "list":
        // Handle both old format (string[]) and new format (Record<string, string[]>)
        let listItems: string[] = [];
        if (Array.isArray(block.listItems)) {
          listItems = block.listItems;
        } else if (block.listItems && typeof block.listItems === 'object') {
          listItems = block.listItems[locale] || block.listItems[blog.locale] || block.listItems['en'] || [];
        }
        
        return (
          <ul key={block.id} className="list-disc list-inside mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 text-[#1a1a1a]/80">
            {listItems.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="text-sm sm:text-base md:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }} />
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
      <main className="pt-16 sm:pt-20 pb-10 sm:pb-14 md:pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              isMountedRef.current = false;
              // Use window.location for a full page reload to avoid navigation issues
              window.location.href = `/${locale}/blog`;
            }}
            className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#1d4ed8] mb-4 sm:mb-6 md:mb-8 font-medium transition-colors cursor-pointer text-sm sm:text-base"
          >
            ← {t("blog.backToBlog")}
          </button>

          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3 sm:mb-4 leading-tight">
              {displayTitle}
            </h1>
            {displayExcerpt && (
              <p className="text-base sm:text-lg md:text-xl text-[#1a1a1a]/70 mb-4 sm:mb-6 leading-relaxed">{displayExcerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              {blog.author && <span>By {blog.author}</span>}
              {blog.author && <span className="hidden sm:inline">•</span>}
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
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 mb-6 sm:mb-8 md:mb-10 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={blog.featuredImage}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
                unoptimized={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px"
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

