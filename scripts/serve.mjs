// Local static server for out/ with brotli and immutable caching of /_next/static, close to Vercel for Lighthouse runs.
// Usage: node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { brotliCompressSync, constants } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const port = Number(process.argv[2]) || 4173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const cache = new Map();

async function resolve(urlPath) {
  let p = path.join(out, decodeURIComponent(urlPath));
  try {
    if ((await stat(p)).isDirectory()) p = path.join(p, "index.html");
    await stat(p);
    return { file: p, status: 200 };
  } catch {
    return { file: path.join(out, "404.html"), status: 404 };
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const { file, status } = await resolve(url.pathname);
  const ext = path.extname(file);
  let body = await readFile(file);
  const headers = { "Content-Type": types[ext] || "application/octet-stream", "X-Robots-Tag": "noindex, nofollow" };
  headers["Cache-Control"] = url.pathname.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate";
  if (/br/.test(req.headers["accept-encoding"] || "") && /\.(html|js|css|json|txt|xml|svg)$/.test(file)) {
    const key = `${file}:${(await stat(file)).mtimeMs}`;
    if (!cache.has(key)) cache.set(key, brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }));
    body = cache.get(key);
    headers["Content-Encoding"] = "br";
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`serving out/ on http://localhost:${port}`));
