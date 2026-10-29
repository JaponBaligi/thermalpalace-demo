// Procedural 1200×630 Open Graph card (57 U12: no photo): petrol water, steam glow, waterline, name. Writes public/og.webp.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/og.webp");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="0.5" cy="0.62" r="0.85">
      <stop offset="0" stop-color="#1a4f56"/>
      <stop offset="0.55" stop-color="#12393f"/>
      <stop offset="1" stop-color="#0b2a2f"/>
    </radialGradient>
    <radialGradient id="steam" cx="0.3" cy="0.15" r="0.6">
      <stop offset="0" stop-color="#f6f1e8" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#f6f1e8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" x2="1">
      <stop offset="0" stop-color="#d9b98c" stop-opacity="0"/>
      <stop offset="0.2" stop-color="#d9b98c"/>
      <stop offset="0.8" stop-color="#d9b98c"/>
      <stop offset="1" stop-color="#d9b98c" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#steam)"/>
  <g fill="none" stroke="#f6f1e8" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round">
    <path d="M560 250c-12-22 14-34 2-56s12-34 5-50"/>
    <path d="M600 250c-14-24 16-38 2-62s14-36 5-46"/>
    <path d="M640 250c-12-22 14-34 2-56s12-34 5-50"/>
  </g>
  <text x="600" y="352" text-anchor="middle" font-family="Cormorant Garamond, Georgia, 'Times New Roman', serif" font-size="92" fill="#f6f1e8">Yalova Thermal Palace</text>
  <rect x="200" y="384" width="800" height="1.5" fill="url(#line)"/>
  <text x="600" y="436" text-anchor="middle" font-family="Manrope, 'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="7" fill="#d9b98c">AKKÖY · TERMAL · YALOVA</text>
  <g fill="none" stroke="#cfe3e1" stroke-opacity="0.18" stroke-width="1.5">
    <path d="M0 540c100-16 200-16 300 0s200 16 300 0 200-16 300 0 200 16 300 0"/>
    <path d="M0 572c100-12 200-12 300 0s200 12 300 0 200-12 300 0 200 12 300 0"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).webp({ quality: 82, effort: 6 }).toFile(out);
console.log(`og: ${path.relative(root, out)}`);
