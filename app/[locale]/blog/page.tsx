import type { Locale } from "@/lib/i18n";
import { getAllBlogs } from "@/lib/admin/blog";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { hreflangByLocale } from "@/lib/seo/hreflang";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import BlogListingClient from "./BlogListingClient";

export const revalidate = 3600; // Revalidate every hour so new posts appear

const baseUrl = getSiteBaseUrl();

const itemListMeta: Record<Locale, { name: string; description: string }> = {
  en: {
    name: "IPTV Blog - Latest Articles & Guides",
    description: "Latest articles, guides, and updates about IPTV and streaming in the USA.",
  },
  ca: {
    name: "IPTV Canada Blog - Guides & Setup Articles",
    description:
      "Latest IPTV Canada articles: Smarters Pro setup, Firestick guides, M3U playlists, and CAD subscription tips for Canadian viewers.",
  },
  es: {
    name: "Blog IPTV - Artículos y Guías",
    description: "Últimos artículos, guías y novedades sobre IPTV y streaming.",
  },
  fr: {
    name: "Blog IPTV - Articles et Guides",
    description: "Derniers articles, guides et actualités sur l'IPTV et le streaming.",
  },
};

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  let blogs = await getAllBlogs();
  blogs = blogs.filter((blog) => isBlogAvailableInLocale(blog, locale));
  blogs = [...blogs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const listingMeta = itemListMeta[locale];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listingMeta.name,
    description: listingMeta.description,
    url: `${baseUrl}/${locale}/blog/`,
    inLanguage: hreflangByLocale[locale],
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, index) => {
      const title = (blog.title[locale] || "").trim() || "Untitled";
      const url = `${baseUrl}${getBlogUrl(blog, locale)}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          name: title,
          url,
          inLanguage: hreflangByLocale[locale],
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
