"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { EDITION } from "@/content/site";
import { liteReason, resolveQuality } from "@/lib/quality";
import type { StageHandle } from "./Stage";

/** Never referenced in the business edition, so its build has no path to three.js. */
const loadStage =
  EDITION === "business"
    ? null
    : async () => {
        // three evaluates in its own task, the stage modules in the next one: two shorter tasks instead of one long one
        await import("./three");
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        return import("./Stage");
      };

/** After `load`, then idle (timeout 2 s): the WebGL work never competes with first paint or hydration. */
function whenIdle(cb: () => void) {
  let cancelled = false;
  let idleId = 0;
  let timer = 0;
  const run = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(() => !cancelled && cb(), { timeout: 2000 });
    else timer = window.setTimeout(() => !cancelled && cb(), 1200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId) window.cancelIdleCallback?.(idleId);
    if (timer) window.clearTimeout(timer);
  };
}

/**
 * Mount point of the WebGL layer (57 §6). Publishes the quality on <html> (`data-quality`, `data-quality-reason`),
 * drives `data-active-scene` from the `[data-scene]` sections and, on the home page with a WebGL-capable tier,
 * loads the three.js stage on idle. The LITE paint stays the first paint and the fallback; the canvas is aria-hidden.
 */
export function WebGLStage() {
  const pathname = usePathname();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const host = hostRef.current;
    const setQuality = (quality: string, reason: string) => {
      root.dataset.quality = quality;
      root.dataset.qualityReason = reason;
    };
    const hard = liteReason();
    if (hard || !loadStage || !host) {
      setQuality("lite", hard ?? "edition");
      return;
    }
    // only the home hero hosts the WebGL scene; inner pages reuse data-scene="0" for their CSS hero and stay LITE
    if (!document.querySelector('.tp-hero[data-scene="0"]')) {
      setQuality("lite", "no-webgl-scene");
      return;
    }

    let stage: StageHandle | null = null;
    let cancelled = false;
    const cancelIdle = whenIdle(async () => {
      const { quality, reason } = await resolveQuality();
      if (cancelled) return;
      setQuality(String(quality), reason);
      if (quality === "lite") return;
      try {
        const { createStage } = await loadStage();
        if (cancelled) return;
        stage = await createStage(host, { tier: quality, onFallback: (why) => setQuality("lite", why) });
        if (cancelled) stage?.destroy();
      } catch {
        setQuality("lite", "load-failed");
      }
    });
    return () => {
      cancelled = true;
      cancelIdle();
      stage?.destroy();
    };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (!scenes.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) root.dataset.activeScene = (e.target as HTMLElement).dataset.scene;
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    scenes.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      delete root.dataset.activeScene;
    };
  }, [pathname]);

  if (EDITION === "business") return null;
  return <div id="tp-stage" ref={hostRef} className="tp-stage" aria-hidden="true" />;
}
