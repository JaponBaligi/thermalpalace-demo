// Business / lite edition (57 U2): same build with NEXT_PUBLIC_EDITION=business. Output in out/ like the default build.
import { execSync } from "node:child_process";

execSync("npx next build", { stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_EDITION: "business" } });
execSync("node scripts/flatten-segments.mjs", { stdio: "inherit" });
