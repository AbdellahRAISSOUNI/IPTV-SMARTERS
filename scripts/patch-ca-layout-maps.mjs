import fs from "node:fs";

const files = [
  "app/[locale]/iptv-installation-firestick/layout.tsx",
  "app/[locale]/iptv-installation-ios/layout.tsx",
  "app/[locale]/iptv-installation-windows/layout.tsx",
  "app/[locale]/iptv-installation-smart-tv/layout.tsx",
  "app/[locale]/iptv-reseller-program/layout.tsx",
  "app/[locale]/[slug]/layout.tsx",
];

const importLine =
  'import { openGraphLocaleMap, siteNameMap } from "@/lib/i18n/locale-maps";\n';

const blockRe =
  /  const localeMap: Record<Locale, string> = \{[\s\S]*?  \};\s*\n\s*const siteNameMap: Record<Locale, string> = \{[\s\S]*?  \};\s*\n/g;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("openGraphLocaleMap")) {
    const anchor = s.includes('WebPageJsonLd')
      ? 'import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";\n'
      : s.includes("installation-slugs")
        ? 'import { locales } from "@/lib/i18n";\n'
        : null;
    if (anchor && s.includes(anchor)) {
      s = s.replace(anchor, anchor + importLine);
    } else if (s.startsWith("import ")) {
      const idx = s.indexOf("\n\n");
      s = s.slice(0, idx + 1) + importLine + s.slice(idx + 1);
    }
  }
  s = s.replace(blockRe, "  const localeMap = openGraphLocaleMap;\n\n");
  s = s.replace(
    /const localeMap: Record<Locale, string> = \{ en: "en_US", es: "es_ES", fr: "fr_FR" \};/,
    "const localeMap = openGraphLocaleMap;"
  );
  fs.writeFileSync(file, s);
  console.log("patched", file);
}
