// Re-encodes every raster image in /public (lossy palette PNG / mozjpeg / webp),
// stripping EXIF/ICC/XMP metadata. Filenames and formats are preserved.
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "public";
const OPTS = {
  ".png": (s) => s.png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 }),
  ".jpg": (s) => s.jpeg({ quality: 78, mozjpeg: true }),
  ".jpeg": (s) => s.jpeg({ quality: 78, mozjpeg: true }),
  ".webp": (s) => s.webp({ quality: 78, effort: 6 }),
};

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let before = 0, after = 0, n = 0;
for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!OPTS[ext] || file.endsWith("favicon.ico")) continue;
  const input = await readFile(file);
  let out;
  try {
    out = await OPTS[ext](sharp(input, { animated: ext === ".webp" }).rotate()).toBuffer();
  } catch (err) {
    console.warn(`skipped ${file}: ${err.message}`);
    continue;
  }
  before += input.length;
  if (out.length < input.length) { await writeFile(file, out); after += out.length; }
  else after += input.length;
  n++;
}
console.log(`${n} images, ${(before/1e6).toFixed(1)}MB -> ${(after/1e6).toFixed(1)}MB`);
