"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";
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
      <main className="pt-16 sm:pt-20 pb-10 sm:pb-14">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Hero Section */}
          <section className="relative mb-12 sm:mb-16 md:mb-20">
            {/* Subtle background accent */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 sm:h-64 bg-gradient-to-b from-[#2563eb]/8 via-[#2563eb]/4 to-transparent blur-3xl"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2563eb]/10 rounded-full mb-6">
                <span className="text-[#2563eb] text-sm font-medium">Latest Insights</span>
              </div>
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] mb-4 sm:mb-6 leading-tight tracking-tight font-heading">
                {t("blog.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#1a1a1a]/70 max-w-2xl mx-auto leading-relaxed">
                {t("blog.description")}
              </p>
            </motion.div>
          </section>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm mt-4">Loading articles...</p>
            </div>
          ) : availableBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t("blog.noPosts")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {availableBlogs.map((blog, index) => {
                const displayTitle = blog.title[locale] || blog.title[blog.locale] || "Untitled";
                const displayExcerpt =
                  blog.excerpt[locale] || blog.excerpt[blog.locale] || "No excerpt available";
                const displayLocale = blog.title[locale] ? locale : blog.locale;
                const publishedDate = new Date(blog.publishedAt);
                const formattedDate = publishedDate.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${displayLocale}/blog/${blog.slug}`}
                      className="group block h-full bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-[#2563eb]/30 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      {blog.featuredImage && !blog.featuredImage.startsWith('blob:') && (
                        <div className="relative w-full h-32 sm:h-40 md:h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <Image
                            src={blog.featuredImage}
                            alt={displayTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4 sm:p-5 md:p-6">
                        {/* Date & Author */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-xs">{formattedDate}</span>
                          </div>
                          {blog.author && (
                            <>
                              <span className="text-gray-400 hidden sm:inline">•</span>
                              <span className="font-medium text-xs">{blog.author}</span>
                            </>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] mb-2 sm:mb-3 group-hover:text-[#2563eb] transition-colors duration-300 line-clamp-2 leading-tight font-heading">
                          {displayTitle}
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 mb-4 sm:mb-5 leading-relaxed">
                          {displayExcerpt}
                        </p>
                        
                        {/* Read More */}
                        <div className="flex items-center gap-2 text-[#2563eb] font-medium text-xs sm:text-sm group-hover:gap-3 transition-all duration-300">
                          <span>{t("blog.readMore")}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
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

