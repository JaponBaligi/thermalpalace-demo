// Renders a static map around the hotel from OpenStreetMap standard tiles (a dozen tiles, once, with a proper
// User-Agent per the OSM tile usage policy) into public/images/harita-thermalpalace.webp, copper pin at the centre.
// Attribution is shown in the footer and in the live map.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/images/harita-thermalpalace.webp");

// Google place data via EXA; same value as content/site.ts. OSM node 4354567779 is ~25 m away.
const lat = 40.618673;
const lng = 29.189453;
const zoom = 16;
const W = 1200;
const H = 800;
const T = 256;

const n = 2 ** zoom;
const px = ((lng + 180) / 360) * n * T;
const latRad = (lat * Math.PI) / 180;
const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * T;

const left = px - W / 2;
const top = py - H / 2;
const tx0 = Math.floor(left / T);
const ty0 = Math.floor(top / T);
const tx1 = Math.floor((left + W) / T);
const ty1 = Math.floor((top + H) / T);

const composites = [];
for (let tx = tx0; tx <= tx1; tx++) {
  for (let ty = ty0; ty <= ty1; ty++) {
    const url = `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`;
    const res = await fetch(url, { headers: { "User-Agent": "japonbaligi-demo-static-map/1.0 (one-off render for a demo site)" } });
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    composites.push({ input: Buffer.from(await res.arrayBuffer()), left: (tx - tx0) * T, top: (ty - ty0) * T });
  }
}

const canvasW = (tx1 - tx0 + 1) * T;
const canvasH = (ty1 - ty0 + 1) * T;
const mosaic = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: "#f2efe9" } })
  .composite(composites)
  .png()
  .toBuffer();

const pin = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="63" viewBox="0 0 32 42"><path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 41 16 41s15-14 15-25.2C31 7.6 24.3 1 16 1Z" fill="#9A4E1F" stroke="#fff" stroke-width="2"/><circle cx="16" cy="15.5" r="5.5" fill="#fff"/></svg>`,
);

const base = await sharp(mosaic)
  .extract({ left: Math.round(left - tx0 * T), top: Math.round(top - ty0 * T), width: W, height: H })
  .modulate({ saturation: 0.55 })
  .tint({ r: 236, g: 230, b: 216 })
  .toBuffer();

await mkdir(path.dirname(out), { recursive: true });
await sharp(base)
  .composite([{ input: pin, left: W / 2 - 24, top: H / 2 - 61 }])
  .webp({ quality: 70, effort: 6 })
  .toFile(out);

console.log(`map: ${composites.length} tiles -> ${path.relative(root, out)}`);
