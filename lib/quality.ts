import { EDITION } from "@/content/site";

/**
 * Render quality for the WebGL layer (56 §6.2–6.3, 57 §6).
 * `lite` = no WebGL: CSS gradients + SVG only. Tiers 1–3 scale the shaders.
 */
export type Tier = 1 | 2 | 3;
export type Quality = "lite" | Tier;

export const QUALITY_STORAGE_KEY = "thermalpalace-quality";
const GPU_CACHE_KEY = "thermalpalace-gpu";
/** detect-gpu benchmark files, copied from node_modules/detect-gpu/dist/benchmarks by scripts/gpu-benchmarks.mjs. */
const BENCHMARKS_URL = "/gpu-benchmarks";

export type TierSettings = {
  /** Upper bound for the canvas device pixel ratio. */
  dprMax: number;
  /** Steam buffer size relative to the CSS pixel size of the canvas. */
  renderScale: number;
  octaves: number;
  waves: number;
  ripple: "none" | "analytic" | "sim";
  /** Under-water particles (P3). */
  particles: number;
  post: "none" | "grain" | "full";
  /** Lit (two-sample) steam and the light pattern on the pool floor. */
  lighting: boolean;
  /** Chromatic dispersion in the caustics (P3). */
  dispersion: boolean;
  fpsCap: 30 | 60;
};

/** 56 §6.3. Tier 3 DPR = min(devicePixelRatio, 2). */
export const TIERS: Record<Tier, TierSettings> = {
  1: { dprMax: 1, renderScale: 0.5, octaves: 2, waves: 3, ripple: "none", particles: 300, post: "none", lighting: false, dispersion: false, fpsCap: 30 },
  2: { dprMax: 1.5, renderScale: 0.66, octaves: 3, waves: 4, ripple: "analytic", particles: 1500, post: "grain", lighting: false, dispersion: false, fpsCap: 60 },
  3: { dprMax: 2, renderScale: 1, octaves: 5, waves: 6, ripple: "sim", particles: 4000, post: "full", lighting: true, dispersion: true, fpsCap: 60 },
};

/** `?lite=1` or `?tier=1|2|3`; `null` when no override is given. */
export function parseQualityOverride(search: string): Quality | null {
  const q = new URLSearchParams(search);
  if (q.get("lite") === "1") return "lite";
  const tier = Number(q.get("tier"));
  if (tier === 1 || tier === 2 || tier === 3) return tier;
  return null;
}

type Conn = { saveData?: boolean; effectiveType?: string };

/** Cheap, synchronous reasons to stay LITE. Nothing here creates a GL context. */
export function liteReason(): string | null {
  if (EDITION === "business") return "edition";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced-motion";
  const conn = (navigator as Navigator & { connection?: Conn }).connection;
  if (conn?.saveData) return "save-data";
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return "slow-network";
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if ((mem !== undefined && mem <= 2) || (navigator.hardwareConcurrency || 4) <= 2) return "low-end-device";
  return null;
}

export function getLitePreference(): boolean {
  try {
    return localStorage.getItem(QUALITY_STORAGE_KEY) === "lite";
  } catch {
    return false;
  }
}

export function setLitePreference(on: boolean) {
  try {
    if (on) localStorage.setItem(QUALITY_STORAGE_KEY, "lite");
    else localStorage.removeItem(QUALITY_STORAGE_KEY);
  } catch {
    /* storage blocked */
  }
}

/**
 * Decision flow (56 §6.2): hard reasons → `?lite` / `?tier` → stored lite preference → WebGL2 → detect-gpu.
 * Async because detect-gpu loads its benchmark file; call it from idle time, never during hydration.
 */
export async function resolveQuality(): Promise<{ quality: Quality; reason: string }> {
  const hard = liteReason();
  if (hard) return { quality: "lite", reason: hard };
  const override = parseQualityOverride(window.location.search);
  if (override === "lite") return { quality: "lite", reason: "override" };
  if (override === null && getLitePreference()) return { quality: "lite", reason: "user" };

  const canvas = document.createElement("canvas");
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2");
  } catch {
    gl = null;
  }
  if (!gl) return { quality: "lite", reason: "no-webgl2" };
  try {
    if (override !== null) return { quality: override, reason: "override" };
    return await detectTier(gl);
  } finally {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

async function detectTier(gl: WebGL2RenderingContext): Promise<{ quality: Quality; reason: string }> {
  try {
    const cached = sessionStorage.getItem(GPU_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    /* storage blocked */
  }
  let result: { quality: Quality; reason: string };
  try {
    const { getGPUTier } = await import("detect-gpu");
    const r = await getGPUTier({ benchmarksURL: BENCHMARKS_URL, glContext: gl });
    const tier = Math.max(0, Math.min(3, r.tier));
    result = tier === 0 ? { quality: "lite", reason: `gpu-${r.type.toLowerCase()}` } : { quality: tier as Tier, reason: `gpu-${r.type.toLowerCase()}` };
  } catch {
    result = { quality: 1, reason: "gpu-unknown" };
  }
  try {
    sessionStorage.setItem(GPU_CACHE_KEY, JSON.stringify(result));
  } catch {
    /* storage blocked */
  }
  return result;
}
