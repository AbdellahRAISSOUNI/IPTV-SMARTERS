import { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/admin/blog";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";

export const dynamic = "force-static";
export const revalidate = 3600;

// TEMP: blog listing and posts are noindex, so keep them out of the sitemap.
// Flip to true (and remove noindex in the blog layouts) when blogs should be indexed again.
const INCLUDE_BLOGS_IN_SITEMAP = false;

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
