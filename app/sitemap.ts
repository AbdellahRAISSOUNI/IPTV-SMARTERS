import { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/admin/blog";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";

export const dynamic = "force-static";
export const revalidate = 3600;

// Blog listing and posts are indexable and included in the sitemap.
// To pause blog indexing again: set to false and pass noindex: true to buildSocialMetadata in the blog layouts.
const INCLUDE_BLOGS_IN_SITEMAP = true;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();

  try {
    const blogs = INCLUDE_BLOGS_IN_SITEMAP ? await getAllBlogs() : [];
    const entries = buildSitemapEntries(baseUrl, blogs);
    return INCLUDE_BLOGS_IN_SITEMAP
      ? entries
      : entries.filter((entry) => !/\/blog\//.test(entry.url));
  } catch (error) {
    console.error("Error building sitemap (blogs omitted):", error);
    return buildSitemapEntries(baseUrl, []).filter((entry) => !/\/blog\//.test(entry.url));
  }
}
