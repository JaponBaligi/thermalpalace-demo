"use client";

import { useEffect, useRef } from "react";
import { getLitePreference, liteReason } from "@/lib/quality";

const CELL = 6; // css px per simulation cell; the canvas is upscaled with smoothing
const DAMP = 0.965;

/**
 * Spa scene water: a low-resolution height-field ripple that answers the pointer inside its section.
 * Draws only light (slope highlights) over the section's own gradient, so the background stays seamless.
 * LITE preference, reduced motion and weak devices keep the static gradient. Sleeps when calm or off-screen.
 */
export function SpaWater() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;
    if (liteReason() || getLitePreference() || new URLSearchParams(location.search).has("lite")) return;

    let w = 0;
    let h = 0;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);
    let img: ImageData | null = null;
    let raf = 0;
    let visible = false;
    let energy = 0;

    const resize = () => {
      w = Math.max(8, Math.ceil(section.clientWidth / CELL));
      h = Math.max(8, Math.ceil(section.clientHeight / CELL));
      canvas.width = w;
      canvas.height = h;
      cur = new Float32Array(w * h);
      prev = new Float32Array(w * h);
      img = ctx.createImageData(w, h);
    };

    const step = () => {
      let e = 0;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const v = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i]) * DAMP;
          prev[i] = v;
          e += v < 0 ? -v : v;
        }
      }
      [cur, prev] = [prev, cur];
      energy = e / (w * h);
      const d = img!.data;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const s = cur[i - 1] - cur[i + 1] + cur[i - w] - cur[i + w];
          const a = s > 0 ? Math.min(255, s * 9) : 0;
          const o = i * 4;
          d[o] = 236;
          d[o + 1] = 214;
          d[o + 2] = 176;
          d[o + 3] = a;
        }
      }
      ctx.putImageData(img!, 0, 0);
    };

    const loop = () => {
      step();
      raf = visible && energy > 0.002 ? requestAnimationFrame(loop) : 0;
      if (!raf) ctx.clearRect(0, 0, w, h);
    };

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (ev: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const cx = Math.floor((ev.clientX - r.left) / CELL);
      const cy = Math.floor((ev.clientY - r.top) / CELL);
      if (cx < 2 || cy < 2 || cx >= w - 2 || cy >= h - 2) return;
      const f = ev.type === "pointerdown" ? 60 : 22;
      for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) cur[(cy + y) * w + cx + x] += f * (x || y ? 0.5 : 1);
      energy = 1;
      wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) wake();
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return <canvas ref={ref} className="tp-spa-water" aria-hidden="true" />;
}
