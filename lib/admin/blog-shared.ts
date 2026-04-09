export const BLOG_CONTENT_LOCALES = ["en", "es", "fr"] as const;
export type BlogContentLocale = (typeof BLOG_CONTENT_LOCALES)[number];

export interface BlogBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "list";
  content: string | Record<string, string>;
  level?: number;
  imageUrl?: string;
  imageAlt?: string | Record<string, string>;
  imageWidth?: "full" | "half" | "third" | "quarter";
  imageAlign?: "left" | "center" | "right";
  listItems?: string[] | Record<string, string[]>;
  style?: {
    textAlign?: "left" | "center" | "right";
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string | Record<string, string>;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  locale: string;
  translations?: string[];
  htmlBody?: Record<string, string>;
  blocks: BlogBlock[];
  meta?: {
    description?: Record<string, string>;
    keywords?: Record<string, string>;
  };
}

export function normalizeHtmlBody(
  htmlBody?: Record<string, string> | null
): Record<BlogContentLocale, string> {
  if (!htmlBody || typeof htmlBody !== "object") {
    return { en: "", es: "", fr: "" };
  }
  return {
    en: typeof htmlBody.en === "string" ? htmlBody.en : "",
    es: typeof htmlBody.es === "string" ? htmlBody.es : "",
    fr: typeof htmlBody.fr === "string" ? htmlBody.fr : "",
  };
}
