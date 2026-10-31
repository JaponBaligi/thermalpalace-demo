"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getLitePreference, liteReason } from "@/lib/quality";

/** Full motion only with a fine pointer and no LITE reason; otherwise both halves keep their static backgrounds. */
function motionOk() {
  return !liteReason() && !getLitePreference() && !new URLSearchParams(location.search).has("lite") && matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Runs `frame` on rAF only while `el` is on screen. `frame` returns false to sleep until `wake()`. */
function onScreenLoop(el: Element, frame: (dt: number) => boolean) {
  let raf = 0;
  let last = 0;
  let visible = false;
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    raf = visible && frame(dt) ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => {
    if (!raf && visible) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) wake();
  });
  io.observe(el);
  return { wake, stop: () => (cancelAnimationFrame(raf), io.disconnect()) };
}

const CELL = 6; // css px per water cell
const FOG_CELL = 8; // css px per fog cell
const FOG_MAX = 0.62;

/**
 * Left half, "thermal water": an always-running ripple height field with falling droplets.
 * On hover a condensation layer builds up over a few seconds, like a mirror after a shower; once it has
 * gathered, the pointer wipes a soft trail that slowly fogs over again. Leaving the half lets the fog lift.
 */
function WaterHalf({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const water = useRef<HTMLCanvasElement>(null);
  const fog = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const wc = water.current;
    const fc = fog.current;
    const wx = wc?.getContext("2d");
    const fx = fc?.getContext("2d");
    if (!el || !wc || !fc || !wx || !fx || !motionOk()) return;
    el.dataset.live = "";

    let w = 0, h = 0, fw = 0, fh = 0;
    let cur = new Float32Array(0), prev = new Float32Array(0), f = new Float32Array(0);
    let wimg: ImageData, fimg: ImageData;
    let hover = false;
    let px = -1, py = -1;
    let dropIn = 0.3;

    const resize = () => {
      w = Math.max(8, Math.ceil(el.clientWidth / CELL));
      h = Math.max(8, Math.ceil(el.clientHeight / CELL));
      fw = Math.max(4, Math.ceil(el.clientWidth / FOG_CELL));
      fh = Math.max(4, Math.ceil(el.clientHeight / FOG_CELL));
      wc.width = w; wc.height = h; fc.width = fw; fc.height = fh;
      cur = new Float32Array(w * h); prev = new Float32Array(w * h); f = new Float32Array(fw * fh);
      wimg = wx.createImageData(w, h); fimg = fx.createImageData(fw, fh);
    };

    const drop = (cx: number, cy: number, force: number) => {
      if (cx < 2 || cy < 2 || cx >= w - 2 || cy >= h - 2) return;
      for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) cur[(cy + y) * w + cx + x] += force * (x || y ? 0.5 : 1);
    };

    const wipe = (x0: number, y0: number, x1: number, y1: number) => {
      const R = 3.2; // brush radius in fog cells
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 1.5));
      for (let s = 0; s <= steps; s++) {
        const cx = x0 + ((x1 - x0) * s) / steps, cy = y0 + ((y1 - y0) * s) / steps;
        for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(fh - 1, Math.ceil(cy + R)); y++)
          for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(fw - 1, Math.ceil(cx + R)); x++) {
            const d = Math.hypot(x - cx, y - cy) / R;
            if (d < 1) f[y * fw + x] *= d * d;
          }
      }
    };

    const frame = (dt: number) => {
      dropIn -= dt;
      if (dropIn <= 0) {
        drop(2 + Math.floor(Math.random() * (w - 4)), 2 + Math.floor(Math.random() * (h - 4)), 14 + Math.random() * 20);
        dropIn = 0.35 + Math.random() * 0.7;
      }
      for (let y = 1; y < h - 1; y++)
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i]) * 0.965;
        }
      [cur, prev] = [prev, cur];
      const d = wimg.data;
      for (let i = w; i < w * (h - 1); i++) {
        const s = cur[i - 1] - cur[i + 1] + cur[i - w] - cur[i + w];
        const o = i * 4;
        d[o] = 236; d[o + 1] = 214; d[o + 2] = 176; d[o + 3] = s > 0 ? Math.min(255, s * 9) : 0;
      }
      wx.putImageData(wimg, 0, 0);

      // fog: builds to FOG_MAX in ~5 s while hovered (wiped trails re-form in ~8 s), lifts in ~3 s otherwise
      const fd = fimg.data;
      for (let i = 0; i < f.length; i++) {
        const v = hover ? Math.min(FOG_MAX, f[i] + dt * (FOG_MAX / 5) * (0.85 + 0.3 * ((i * 7919) % 13) / 13)) : Math.max(0, f[i] - dt * (FOG_MAX / 3));
        f[i] = v;
        const o = i * 4;
        fd[o] = 96; fd[o + 1] = 106; fd[o + 2] = 108; fd[o + 3] = v * 255;
      }
      fx.putImageData(fimg, 0, 0);
      return true;
    };

    const toCell = (ev: PointerEvent, c: number) => {
      const r = el.getBoundingClientRect();
      return [(ev.clientX - r.left) / c, (ev.clientY - r.top) / c] as const;
    };
    const onMove = (ev: PointerEvent) => {
      const [x, y] = toCell(ev, FOG_CELL);
      if (px >= 0) wipe(px, py, x, y);
      px = x; py = y;
      const [cx, cy] = toCell(ev, CELL);
      if (Math.random() < 0.25) drop(Math.floor(cx), Math.floor(cy), 10);
    };
    const onEnter = () => { hover = true; px = -1; };
    const onLeave = () => { hover = false; px = -1; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const loop = onScreenLoop(el, frame);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      loop.stop();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      delete el.dataset.live;
    };
  }, []);

  return (
    <div ref={host} className="tp-duo-half tp-duo-water">
      <canvas ref={water} className="tp-duo-canvas tp-duo-ripple" aria-hidden="true" />
      <canvas ref={fog} className="tp-duo-canvas tp-duo-fog" aria-hidden="true" />
      <div className="tp-duo-body">{children}</div>
    </div>
  );
}

type Print = { x: number; y: number; a: number; left: boolean; t: number };
const LIFE = 3.2; // s

/** Right half, "walking in nature": forest photo under a dark veil; the pointer leaves alternating left/right running-shoe prints that fade. */
function ForestHalf({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!el || !c || !ctx || !motionOk()) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const prints: Print[] = [];
    let lx = -1, ly = -1, acc = 0, left = true, size = 34;

    const resize = () => {
      c.width = Math.ceil(el.clientWidth * dpr);
      c.height = Math.ceil(el.clientHeight * dpr);
      // print length scales with the viewport; one step is ~2.6 print lengths
      size = Math.min(44, Math.max(26, Math.min(innerWidth, innerHeight) * 0.05));
    };

    /** Original running-shoe sole in units of its length (toe at -0.5), drawn as the right shoe; the left one is mirrored. */
    const sole = () => {
      ctx.beginPath();
      ctx.moveTo(0.02, -0.5);
      ctx.bezierCurveTo(0.15, -0.5, 0.2, -0.34, 0.19, -0.18); // lateral forefoot
      ctx.bezierCurveTo(0.18, -0.02, 0.13, 0.08, 0.14, 0.2); // lateral waist
      ctx.bezierCurveTo(0.15, 0.38, 0.1, 0.5, 0, 0.5); // heel
      ctx.bezierCurveTo(-0.12, 0.5, -0.15, 0.36, -0.13, 0.2);
      ctx.bezierCurveTo(-0.11, 0.08, -0.06, 0.02, -0.1, -0.1); // medial arch
      ctx.bezierCurveTo(-0.18, -0.24, -0.19, -0.42, -0.1, -0.48); // medial forefoot
      ctx.bezierCurveTo(-0.06, -0.5, -0.02, -0.5, 0.02, -0.5);
      ctx.closePath();
    };

    const foot = (p: Print, alpha: number) => {
      const n = p.a + Math.PI / 2;
      const side = (p.left ? -1 : 1) * size * 0.3; // half hip width from the path centreline
      ctx.save();
      ctx.translate(p.x + Math.cos(n) * side, p.y + Math.sin(n) * side);
      ctx.rotate(n + (p.left ? -0.07 : 0.07)); // slight toe-out
      ctx.scale(p.left ? -size : size, size);
      sole();
      ctx.fillStyle = `rgba(168,139,87,${alpha})`;
      ctx.fill();
      ctx.clip();
      // tread: zigzag lugs on the forefoot, chevrons on the heel, a flex groove at the waist
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 0.022;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      for (let y = -0.44; y < -0.04; y += 0.065) {
        ctx.moveTo(-0.22, y);
        for (let x = -0.22, k = 0; x < 0.24; x += 0.055, k++) ctx.lineTo(x, y + (k % 2 ? 0.025 : 0));
      }
      for (let y = 0.2; y < 0.5; y += 0.06) {
        ctx.moveTo(-0.2, y + 0.04);
        ctx.lineTo(0, y);
        ctx.lineTo(0.2, y + 0.04);
      }
      ctx.moveTo(-0.22, 0.06);
      ctx.lineTo(0.22, 0.02);
      ctx.stroke();
      ctx.restore();
    };

    let now = 0;
    const frame = (dt: number) => {
      now += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      while (prints.length && now - prints[0].t > LIFE) prints.shift();
      for (const p of prints) {
        const age = (now - p.t) / LIFE;
        foot(p, 0.5 * Math.min(1, age * 8) * (1 - age) ** 1.4);
      }
      return prints.length > 0;
    };
    const loop = onScreenLoop(el, frame);

    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      if (lx < 0) { lx = x; ly = y; return; }
      const d = Math.hypot(x - lx, y - ly);
      acc += d;
      if (acc >= size * 2.6 && d > 0) {
        acc = 0;
        prints.push({ x, y, a: Math.atan2(y - ly, x - lx), left, t: now });
        left = !left;
        loop.wake();
      }
      if (d > 6) { lx = x; ly = y; }
    };
    const onLeave = () => { lx = -1; acc = 0; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      loop.stop();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={host} className="tp-duo-half tp-duo-forest">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img className="tp-duo-photo" src="/images/termal-orman-1000.webp" alt="" width={1000} height={882} loading="lazy" decoding="async" />
      <canvas ref={cv} className="tp-duo-canvas" aria-hidden="true" />
      <div className="tp-duo-body">{children}</div>
    </div>
  );
}

/** "Thermal water | walking in nature": full-bleed, one viewport tall; the title straddles the matte gold rule and rosette. */
export function SpaDuo({ title, water, forest }: { title: readonly [string, string]; water: ReactNode; forest: ReactNode }) {
  return (
    <div className="tp-duo">
      <h2 id="tp-duo-h" className="tp-duo-title">
        <span>{title[0]}</span> <span>{title[1]}</span>
      </h2>
      <WaterHalf>{water}</WaterHalf>
      <div className="tp-duo-rule" aria-hidden="true" />
      <ForestHalf>{forest}</ForestHalf>
    </div>
  );
}
