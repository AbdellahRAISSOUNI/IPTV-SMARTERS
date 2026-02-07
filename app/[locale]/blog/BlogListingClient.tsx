"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/admin/blog";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n";

interface BlogListingClientProps {
  initialBlogs: BlogPost[];
  locale: Locale;
}

export default function BlogListingClient({ initialBlogs, locale }: BlogListingClientProps) {
  const { t } = useLanguage();
  const blogs = initialBlogs;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 sm:pt-20 pb-10 sm:pb-14" role="main">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Hero Section */}
          <section className="relative mb-12 sm:mb-16 md:mb-20" aria-labelledby="blog-heading">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 sm:h-64 bg-gradient-to-b from-[#2563eb]/8 via-[#2563eb]/4 to-transparent blur-3xl" />
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
              <h1 id="blog-heading" className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] mb-4 sm:mb-6 leading-tight tracking-tight font-heading">
                {t("blog.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#1a1a1a]/70 max-w-2xl mx-auto leading-relaxed">
                {t("blog.description")}
              </p>
            </motion.div>
          </section>

          {/* Blog Grid - server-rendered links for SEO */}
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t("blog.noPosts")}</p>
            </div>
          ) : (
            <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" aria-label="Blog articles">
              {blogs.map((blog, index) => {
                const displayTitle = blog.title[locale] || blog.title[blog.locale] || "Untitled";
                const displayExcerpt =
                  blog.excerpt[locale] || blog.excerpt[blog.locale] || "No excerpt available";
                const publishedDate = new Date(blog.publishedAt);
                const formattedDate = publishedDate.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const postUrl = getBlogUrl(blog, locale);

                return (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={postUrl}
                      className="group block h-full bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-[#2563eb]/30 hover:shadow-xl transition-all duration-300"
                      aria-label={`Read article: ${displayTitle}`}
                    >
                      {blog.featuredImage && !blog.featuredImage.startsWith("blob:") && (
                        <div className="relative w-full h-32 sm:h-40 md:h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <Image
                            src={blog.featuredImage}
                            alt={displayTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden />
                            <time dateTime={blog.publishedAt}>{formattedDate}</time>
                          </div>
                          {blog.author && (
                            <>
                              <span className="text-gray-400 hidden sm:inline">•</span>
                              <span className="font-medium text-xs">{blog.author}</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] mb-2 sm:mb-3 group-hover:text-[#2563eb] transition-colors duration-300 line-clamp-2 leading-tight font-heading">
                          {displayTitle}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 mb-4 sm:mb-5 leading-relaxed">
                          {displayExcerpt}
                        </p>
                        <div className="flex items-center gap-2 text-[#2563eb] font-medium text-xs sm:text-sm group-hover:gap-3 transition-all duration-300">
                          <span>{t("blog.readMore")}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
