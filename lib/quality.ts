import { EDITION } from "@/content/site";

/**
 * Render quality for the WebGL layer (56 §6.2, 57 §6).
 * `lite` = no WebGL: CSS gradients + SVG only. Tiers 1–3 scale the shaders in P2/P3.
 */
export type Quality = "lite" | 1 | 2 | 3;

export const QUALITY_STORAGE_KEY = "thermalpalace-quality";

/** `?lite=1` or `?tier=1|2|3`; `null` when no override is given. */
export function parseQualityOverride(search: string): Quality | null {
  const q = new URLSearchParams(search);
  if (q.get("lite") === "1") return "lite";
  const tier = Number(q.get("tier"));
  if (tier === 1 || tier === 2 || tier === 3) return tier;
  return null;
}

type Conn = { saveData?: boolean; effectiveType?: string };

/** Hard reasons to stay LITE, checked before any GPU detection. */
export function liteReason(): string | null {
  if (EDITION === "business") return "edition";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced-motion";
  const conn = (navigator as Navigator & { connection?: Conn }).connection;
  if (conn?.saveData) return "save-data";
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return "slow-network";
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if ((mem !== undefined && mem <= 2) || (navigator.hardwareConcurrency || 4) <= 2) return "low-end-device";
  if (!hasWebGL2()) return "no-webgl2";
  return null;
}

function hasWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Decision flow. P1: always `lite` (the WebGL layer does not exist yet), but overrides and hard
 * reasons are already evaluated so P2 only has to replace `detectTier()` with `detect-gpu`.
 */
export function resolveQuality(): { quality: Quality; reason: string } {
  const hard = liteReason();
  if (hard) return { quality: "lite", reason: hard };
  const override = parseQualityOverride(window.location.search);
  if (override !== null) return { quality: clampToPhase(override), reason: "override" };
  try {
    const stored = localStorage.getItem(QUALITY_STORAGE_KEY);
    if (stored === "lite") return { quality: "lite", reason: "user" };
  } catch {
    /* storage blocked */
  }
  return { quality: clampToPhase(detectTier()), reason: "phase-p1" };
}

/** P2: replace with detect-gpu (benchmarks self-hosted under /gpu-benchmarks/); tier 0 → lite. */
function detectTier(): Quality {
  return 2;
}

/** No WebGL layer exists in P1, so every request resolves to LITE. Remove in P2. */
function clampToPhase(_q: Quality): Quality {
  void _q;
  return "lite";
}
