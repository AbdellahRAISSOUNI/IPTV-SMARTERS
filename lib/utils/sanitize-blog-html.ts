import DOMPurify from "isomorphic-dompurify";

export function sanitizeBlogHtml(html: string): string {
  if (!html?.trim()) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: [
      "target",
      "rel",
      "class",
      "style",
      "src",
      "alt",
      "href",
      "width",
      "height",
      "loading",
      "decoding",
    ],
    ADD_URI_SAFE_ATTR: ["width", "height"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
  });
}
