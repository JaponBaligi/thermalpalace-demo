// Gzip sizes on out/: first-load JS per page (script tags in the HTML) and the lazy chunks
// (WebGL stage with three.js + gsap core, detect-gpu, lil-gui). Run after `npm run build`.
import { readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const chunkDir = path.join(out, "_next/static/chunks");
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const gz = async (f) => gzipSync(await readFile(f), { level: 9 }).length;

const pages = ["index.html", "odalar/index.html", "en/index.html", "en/rooms/index.html", "404.html"];
const first = new Set();
console.log("First-load JS (gzip):");
for (const p of pages) {
  const html = await readFile(path.join(out, p), "utf8");
  // noModule polyfills are skipped by every browser that runs the site's modules
  const srcs = [...new Set([...html.matchAll(/<script(?![^>]*noModule)[^>]+src="([^"]+\.js)"/gi)].map((m) => m[1]))];
  let sum = 0;
  for (const s of srcs) {
    first.add(path.basename(s));
    sum += await gz(path.join(out, s));
  }
  console.log(`  ${p.padEnd(22)} ${kb(sum)} (${srcs.length} files)`);
}

const markers = {
  "three.js stage": /WebGLRenderer|THREE\.WebGLRenderer/,
  "detect-gpu": /detect-gpu|BLOCKLISTED|WEBGL_debug_renderer_info/,
  "lil-gui": /lil-gui/,
  gsap: /GreenSock|gsap/,
  lenis: /lenis-smooth|lenis/,
  leaflet: /leaflet/i,
};
console.log("Lazy chunks (gzip):");
for (const f of (await readdir(chunkDir)).filter((f) => f.endsWith(".js") && !first.has(f))) {
  const src = await readFile(path.join(chunkDir, f), "utf8");
  const tags = Object.entries(markers)
    .filter(([, re]) => re.test(src))
    .map(([k]) => k);
  const size = await gz(path.join(chunkDir, f));
  if (size > 1500 || tags.length) console.log(`  ${f.padEnd(28)} ${kb(size).padStart(9)}  ${tags.join(", ")}`);
}
