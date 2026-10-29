"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { EDITION } from "@/content/site";
import { resolveQuality } from "@/lib/quality";

/**
 * Mount point of the WebGL layer (57 §6). P1: resolves the quality (always LITE), publishes it on <html>
 * (`data-quality`, `data-quality-reason`) and drives `data-active-scene` from the `[data-scene]` sections.
 * P2 dynamic-imports the renderer here when `quality !== "lite"`; the canvas stays aria-hidden decoration.
 * The business edition renders nothing and never imports WebGL code.
 */
export function WebGLStage() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const { quality, reason } = resolveQuality();
    root.dataset.quality = String(quality);
    root.dataset.qualityReason = reason;
  }, []);

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
  return <div id="tp-stage" className="tp-stage" aria-hidden="true" />;
}
