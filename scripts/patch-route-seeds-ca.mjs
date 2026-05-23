import fs from "node:fs";

const path = "lib/seo/route-seed-keywords.ts";
let s = fs.readFileSync(path, "utf8");
s = s.replace(/  en: (\[[\s\S]*?\]),\r?\n  es:/g, (m, arr) => {
  return `  en: ${arr},\n  ca: ${arr},\n  es:`;
});
fs.writeFileSync(path, s);
console.log("ca blocks", (s.match(/ca: \[/g) || []).length);
