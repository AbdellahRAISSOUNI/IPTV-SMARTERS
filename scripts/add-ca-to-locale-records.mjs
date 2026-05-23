import fs from "node:fs";

function addCaAfterEnInObjectBlocks(content) {
  return content.replace(
    /(en: (?:'[^']*'|"[^"]*"),)\n(\s+)(es:)/g,
    (_, enLine, indent, esKey) => {
      const caLine = enLine.replace(/^(\s*)en: /, "$1ca: ");
      return `${enLine}\n${indent}${caLine.trimStart()}\n${indent}${esKey}`;
    }
  );
}

const targets = [
  "app/[locale]/[slug]/layout.tsx",
  "app/[locale]/refund-policy/layout.tsx",
];

for (const file of targets) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, "utf8");
  s = addCaAfterEnInObjectBlocks(s);
  if (file.includes("refund-policy")) {
    s = s.replace(
      /languageAlternates: Record<string, string> = \{\n    en:/,
      'languageAlternates: Record<string, string> = {\n    ca: `${baseUrl}/ca/refund-policy/`,\n    en:'
    );
  }
  fs.writeFileSync(file, s);
  console.log("updated", file);
}
