import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";

const localeMap: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
};

const siteNameMap: Record<Locale, string> = {
  en: "StreamPro - Premium IPTV Service",
  es: "StreamPro - Servicio IPTV Premium",
  fr: "StreamPro - Service IPTV Premium",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    const blog = await getBlogBySlug(slug);
    
    if (!blog) {
      return getDefaultMetadata(locale, slug);
    }

    const title = blog.title[locale] || blog.title[blog.locale] || "Blog Post";
    const description = blog.excerpt[locale] || blog.excerpt[blog.locale] || "Read our latest blog post about IPTV services.";
    const image = blog.featuredImage 
      ? (blog.featuredImage.startsWith("http") ? blog.featuredImage : `${baseUrl}${blog.featuredImage}`)
      : `${baseUrl}/images/hero.png`;
    
    const publishedTime = blog.publishedAt;
    const modifiedTime = blog.updatedAt;

    return {
      title: `${title} | StreamPro`,
      description,
      keywords: blog.meta?.keywords?.[locale] || blog.meta?.keywords?.[blog.locale] || [],
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: `${baseUrl}/${locale}/blog/${slug}/`, // Include trailing slash for consistency
        languages: {
          en: `${baseUrl}/en/blog/${slug}/`,
          es: `${baseUrl}/es/blog/${slug}/`,
          fr: `${baseUrl}/fr/blog/${slug}/`,
          "x-default": `${baseUrl}/en/blog/${slug}/`,
        },
      },
      openGraph: {
        type: "article",
        locale: localeMap[locale],
        url: `${baseUrl}/${locale}/blog/${slug}/`, // Include trailing slash for consistency
        siteName: siteNameMap[locale],
        title: `${title} | StreamPro`,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/jpeg",
          },
        ],
        publishedTime,
        modifiedTime,
        authors: ["StreamPro"],
        section: "IPTV Blog",
        tags: blog.meta?.keywords?.[locale] || [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | StreamPro`,
        description,
        images: [image],
        creator: "@streampro",
        site: "@streampro",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      other: {
        "og:image:secure_url": image,
        "og:image:type": "image/jpeg",
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:image:alt": title,
        "article:author": "StreamPro",
        "article:published_time": publishedTime,
        "article:modified_time": modifiedTime,
      },
    };
  } catch (error) {
    return getDefaultMetadata(locale, slug);
  }
}

function getDefaultMetadata(locale: Locale, slug: string): Metadata {
  const title = "Blog Post | StreamPro";
  const description = "Read our latest blog post about IPTV services.";
  
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}/`, // Include trailing slash for consistency
    },
    openGraph: {
      type: "article",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/blog/${slug}`,
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/hero.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/hero.png`],
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
