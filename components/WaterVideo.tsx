"use client";

import { useEffect, useRef } from "react";

const BASE = "/video/hero-water";

/**
 * S0 background footage. The poster paints first; the clip loads after `load` + idle, only once a non-LITE tier
 * is set and without reduced motion or Save-Data, and plays only while the hero is on screen.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const root = document.documentElement;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    let idle = 0;
    let ready = false;
    // the boot script starts every page as LITE; the tier is known only after GPU detection
    const start = () => {
      if (!ready || io || root.dataset.quality === "lite") return;
      mo.disconnect();
      const h = window.innerWidth * Math.min(window.devicePixelRatio, 2) > 1600 ? 1080 : 720;
      const av1 = v.canPlayType('video/webm; codecs="av01.0.08M.10"') !== "";
      v.muted = true;
      v.src = `${BASE}-${h}.${av1 ? "webm" : "mp4"}`;
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
      io.observe(v);
    };
    const mo = new MutationObserver(start);
    mo.observe(root, { attributes: true, attributeFilter: ["data-quality"] });
    const onIdle = () => {
      ready = true;
      start();
    };
    const kick = () => {
      idle = typeof requestIdleCallback === "function" ? requestIdleCallback(onIdle, { timeout: 2500 }) : window.setTimeout(onIdle, 300);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      window.removeEventListener("load", kick);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
      window.clearTimeout(idle);
      mo.disconnect();
      io?.disconnect();
      v.pause();
    };
  }, []);

  return (
    <div className="tp-hero-video" aria-hidden="true">
      <video ref={ref} poster={`${BASE}-poster.webp`} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} />
    </div>
  );
}
