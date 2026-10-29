// Post-build checks on out/ (57 §1, §5): banned words, SEO tags on all 8 pages, sitemap/robots/noindex.
// Run after `npm run build`. Exits 1 on any failure.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const SITE = "https://thermalpalace-demo.japonbaligi.com";

const pages = {
  "/": "/en/",
  "/odalar/": "/en/rooms/",
  "/termal-spa/": "/en/thermal-spa/",
  "/iletisim/": "/en/contact/",
};

// Health claims (U5), timeshare and owner group (54 D1), superlatives, prices (U8), ratings (U11), planned figures (U10).
const banned = [
  /şifa/i, /\bsifa/i, /iyi gelir/i, /tedavi/i, /terapi/i, /\bkür\b/i, /iyileş/i, /romatizma/i, /sağlık turizmi/i,
  /\bheal/i, /\bcure/i, /therap/i, /treatment/i, /medical/i,
  /devre ?mülk/i, /\bRCI\b/, /aidat/i, /Karaderili/i, /Terma City/i, /Grand Termal/i, /Mia Thermal/i, /444 ?25 ?47/,
  /en büyük/i, /eşsiz/i, /yıldızlı/i, /\bTL\b/, /₺/, /uygun fiyat/i, /erken rezervasyon/i,
  /aggregateRating/, /ratingValue/, /priceRange/, /starRating/, /numberOfRooms/,
  /\b750\b/, /2\.200/, /56\.673/, /37[–-]223/, /Awwwards/i,
  /wa\.me/,
];

let fail = 0;
const bad = (msg) => {
  fail++;
  console.log(`FAIL ${msg}`);
};

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return nested.flat();
}

// Banned words: rendered HTML without script/style bodies (chunk hashes would give false number hits);
// schema and link patterns also on the raw file, JSON-LD included.
const rawOnly = [/aggregateRating/, /ratingValue/, /priceRange/, /starRating/, /numberOfRooms/, /wa\.me/];
for (const f of (await files(out)).filter((f) => f.endsWith(".html"))) {
  const raw = await readFile(f, "utf8");
  const visible = raw.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  for (const re of banned) if (re.test(visible)) bad(`${path.relative(out, f)} contains ${re}`);
  for (const re of rawOnly) if (re.test(raw)) bad(`${path.relative(out, f)} contains ${re}`);
}

const htmlFor = (route) => path.join(out, route === "/" ? "index.html" : `${route.slice(1)}index.html`);
const attr = (html, re) => (html.match(re) || [])[1];

for (const [trRoute, enRoute] of Object.entries(pages)) {
  for (const [route, lang] of [
    [trRoute, "tr"],
    [enRoute, "en"],
  ]) {
    const html = await readFile(htmlFor(route), "utf8");
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
    const ogUrl = attr(html, /<meta property="og:url" content="([^"]+)"/);
    if (canonical !== `${SITE}${route}`) bad(`${route} canonical ${canonical}`);
    if (ogUrl !== `${SITE}${route}`) bad(`${route} og:url ${ogUrl}`);
    for (const [hl, target] of [
      ["tr", trRoute],
      ["en", enRoute],
      ["x-default", trRoute],
    ]) {
      const re = new RegExp(`<link rel="alternate" hrefLang="${hl}" href="([^"]+)"`);
      const href = attr(html, re);
      if (href !== `${SITE}${target}`) bad(`${route} hreflang ${hl} ${href}`);
    }
    if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) bad(`${route} noindex meta missing`);
    if (!new RegExp(`<html lang="${lang}"`).test(html)) bad(`${route} html lang`);
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) bad(`${route} has ${h1} h1`);
  }
}

const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
const locs = sitemap.match(/<loc>/g)?.length ?? 0;
if (locs !== 8) bad(`sitemap has ${locs} URLs`);
const robots = await readFile(path.join(out, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`) || /Disallow: \/\s*$/m.test(robots)) bad("robots.txt");
const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
if (!JSON.stringify(vercel).includes("noindex, nofollow")) bad("vercel.json X-Robots-Tag");

console.log(fail ? `${fail} check(s) failed` : "all checks passed");
process.exit(fail ? 1 : 0);
