// Generates ORIGINAL, brand-free artwork (gradients + geometric shapes + generic category labels)
// used by the homepage carousels in place of third-party posters and channel logos.
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";

const palettes = [
  ["#6d28d9", "#2563eb"], ["#be185d", "#f97316"], ["#047857", "#0ea5e9"], ["#b91c1c", "#7c3aed"],
  ["#0f766e", "#84cc16"], ["#1d4ed8", "#06b6d4"], ["#9333ea", "#ec4899"], ["#c2410c", "#facc15"],
];

const shapes = (i) => {
  const k = i % 4;
  if (k === 0) return `<circle cx="300" cy="170" r="150" fill="#fff" fill-opacity=".14"/><circle cx="90" cy="470" r="110" fill="#fff" fill-opacity=".10"/>`;
  if (k === 1) return `<polygon points="0,420 400,200 400,600 0,600" fill="#fff" fill-opacity=".14"/><polygon points="0,0 260,0 0,260" fill="#fff" fill-opacity=".10"/>`;
  if (k === 2) return `<rect x="-60" y="90" width="360" height="360" rx="60" transform="rotate(18 120 270)" fill="#fff" fill-opacity=".13"/><circle cx="330" cy="500" r="90" fill="#fff" fill-opacity=".12"/>`;
  return `<path d="M0 380 Q200 240 400 380 L400 600 L0 600Z" fill="#fff" fill-opacity=".15"/><circle cx="110" cy="130" r="80" fill="#fff" fill-opacity=".12"/>`;
};

const font = `font-family="Arial, Helvetica, sans-serif" font-weight="700"`;

const posterSvg = (label, i) => {
  const [a, b] = palettes[i % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="400" height="600" fill="url(#g)"/>${shapes(i)}
<polygon points="170,250 170,350 255,300" fill="#fff" fill-opacity=".92"/>
<text x="200" y="500" text-anchor="middle" fill="#fff" ${font} font-size="38" letter-spacing="2">${label}</text></svg>`;
};

const badgeSvg = (label, i) => {
  const [a, b] = palettes[i % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="170" viewBox="0 0 300 170">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect x="6" y="6" width="288" height="158" rx="22" fill="url(#g)"/>
<circle cx="250" cy="40" r="46" fill="#fff" fill-opacity=".14"/><circle cx="40" cy="150" r="40" fill="#fff" fill-opacity=".10"/>
<text x="150" y="98" text-anchor="middle" fill="#fff" ${font} font-size="${label.length > 12 ? 26 : 32}">${label}</text></svg>`;
};

const posters = ["Movies", "Series", "Live Sports", "Kids", "Documentaries", "Comedy", "Drama", "Action", "Music", "News", "Family", "Adventure", "Reality", "Cooking", "Travel", "Lifestyle"];
const channels = ["Sports", "News", "Movies", "Series", "Kids", "Documentary", "Music", "Lifestyle", "Comedy", "Drama", "Cooking", "Travel"];
const streaming = ["Live Events", "Catch-Up TV", "HD and 4K", "Replay", "Multi-Screen", "On Demand"];

async function build(dir, items, svg, fmt) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  for (const [i, label] of items.entries()) {
    const name = `${String(i + 1).padStart(2, "0")}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;
    await sharp(Buffer.from(svg(label, i))).webp({ quality: fmt }).toFile(`${dir}/${name}`);
  }
}

await build("public/carousel-content", posters, posterSvg, 82);
await build("public/carousel-categories", channels, badgeSvg, 85);
await build("public/carousel-features", streaming, badgeSvg, 85);
console.log("done");
