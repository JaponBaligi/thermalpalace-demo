// next export on Windows writes segment prefetch files as `__next.a\b.txt` (nested folders)
// while the client router requests `__next.a.b.txt`. Flatten them; no-op on Linux builds.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)])));
  return nested.flat();
}

async function walk(dir) {
  let moved = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      for (const file of await files(full)) {
        const flat = `${e.name}.${relative(full, file).split(sep).join(".")}`;
        await rename(file, join(dir, flat));
        moved++;
      }
      await rm(full, { recursive: true });
    } else if (e.name !== "_next") {
      moved += await walk(full);
    }
  }
  return moved;
}

await stat(out);
console.log(`flatten-segments: ${await walk(out)} file(s) moved`);
