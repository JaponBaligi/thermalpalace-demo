// Self-hosted detect-gpu benchmarks (56 §3): copies node_modules/detect-gpu/dist/benchmarks to public/gpu-benchmarks.
// Re-run after upgrading detect-gpu so the data matches the library version.
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules/detect-gpu/dist/benchmarks");
const dest = path.join(root, "public/gpu-benchmarks");

await mkdir(dest, { recursive: true });
const files = (await readdir(src)).filter((f) => f.endsWith(".json"));
await Promise.all(files.map((f) => copyFile(path.join(src, f), path.join(dest, f))));
await copyFile(path.join(root, "node_modules/detect-gpu/LICENSE"), path.join(dest, "LICENSE.txt"));
console.log(`copied ${files.length} benchmark files to public/gpu-benchmarks`);
