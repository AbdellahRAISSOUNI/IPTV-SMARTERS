"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/admin/blog";

export default function BlogPage() {
  const { t, locale } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        // Fetch blogs from the public API endpoint (no auth required for viewing)
        const response = await fetch("/api/blogs");
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          console.error("Failed to fetch blogs:", response.status);
        }
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);
  
  // Show all blogs - display in current locale if available, otherwise fallback to primary locale
  // This ensures blogs are visible in all languages, even if not fully translated
  const availableBlogs = blogs;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-lg sm:text-xl text-[#1a1a1a]/70 max-w-2xl mx-auto">
              {t("blog.description")}
            </p>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Loading...</p>
            </div>
          ) : availableBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t("blog.noPosts")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableBlogs.map((blog) => {
                const displayTitle = blog.title[locale] || blog.title[blog.locale] || "Untitled";
                const displayExcerpt =
                  blog.excerpt[locale] || blog.excerpt[blog.locale] || "No excerpt available";
                const displayLocale = blog.title[locale] ? locale : blog.locale;

                return (
                  <Link
                    key={blog.id}
                    href={`/${displayLocale}/blog/${blog.slug}`}
                    className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    {blog.featuredImage && !blog.featuredImage.startsWith('blob:') && (
                      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100">
                        <Image
                          src={blog.featuredImage}
                          alt={displayTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={false}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {blog.author && <span>{blog.author}</span>}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#2563eb] transition-colors line-clamp-2">
                        {displayTitle}
                      </h2>
                      <p className="text-gray-600 line-clamp-3 mb-4">{displayExcerpt}</p>
                      <span className="text-[#2563eb] font-medium text-sm group-hover:underline">
                        {t("blog.readMore")} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

