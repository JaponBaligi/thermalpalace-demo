import { WebGLRenderer, Vector2 } from "./three";
import { gsap } from "gsap/gsap-core";
import { TIERS, type Tier, type TierSettings } from "@/lib/quality";
import { SurfaceScene, type Frame } from "./SurfaceScene";

export type StageHandle = { destroy(): void };

type Options = {
  tier: Tier;
  /** Called once when the stage gives up (context lost, compile failure); the page returns to LITE. */
  onFallback: (reason: string) => void;
};

type SchedulerYield = { scheduler?: { yield?: () => Promise<void> } };
/** Each setup step runs in its own task so none of them becomes a long task (TBT). */
const yieldToMain = () => {
  const s = (globalThis as SchedulerYield).scheduler;
  return s?.yield ? s.yield() : new Promise<void>((resolve) => setTimeout(resolve, 0));
};

/**
 * The single WebGL renderer and canvas (56 §6.6). Drives S0 steam and the S1 water surface behind the DOM.
 * RAF = gsap.ticker; renders only while the hero or the surface section is on screen, the tab is visible and
 * no menu covers the page. Returns null if WebGL2 setup fails; the LITE paint then simply stays.
 */
export async function createStage(host: HTMLElement, { tier, onFallback }: Options): Promise<StageHandle | null> {
  const hero = document.querySelector<HTMLElement>('[data-scene="0"]');
  const surface = document.querySelector<HTMLElement>('[data-scene="1"]');
  if (!hero || !surface) return null;
  await yieldToMain();

  const root = document.documentElement;
  const canvas = document.createElement("canvas");
  canvas.className = "tp-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: tier === 3 ? "high-performance" : "default",
    });
  } catch {
    onFallback("renderer-failed");
    return null;
  }
  renderer.setClearColor(0xf6f1e8, 1);
  await yieldToMain();

  let settings: TierSettings = TIERS[tier];
  let activeTier = tier;
  const scene = new SurfaceScene(renderer, tier, settings);
  host.appendChild(canvas);
  await yieldToMain();

  let destroyed = false;
  let width = 0;
  let height = 0;
  const resize = () => {
    width = host.clientWidth || window.innerWidth;
    height = host.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, settings.dprMax);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    scene.setSize(width, height, dpr, settings.renderScale);
    measure();
  };

  // Section sizes in document coordinates and the scroll offset are cached outside the frame loop:
  // reading layout (scrollY included) every frame forces a style/layout flush while CSS animations run.
  let heroH = 1;
  let surfaceBottom = 1;
  let scrollY = window.scrollY;
  const measure = () => {
    scrollY = window.scrollY;
    heroH = Math.max(1, hero.offsetHeight);
    surfaceBottom = surface.getBoundingClientRect().bottom + scrollY;
  };
  const onScroll = () => {
    scrollY = window.scrollY;
  };

  try {
    resize();
    await yieldToMain();
    await scene.compile(yieldToMain);
  } catch {
    scene.dispose();
    renderer.dispose();
    canvas.remove();
    onFallback("compile-failed");
    return null;
  }
  if (!document.body.contains(canvas)) {
    scene.dispose();
    renderer.dispose();
    return null;
  }

  let clock = 0;

  // Pointer: target in viewport uv, smoothed with an exponential follow in the loop.
  const target = new Vector2(0.5, 0.42);
  const mouse = target.clone();
  const mouseVel = new Vector2();
  const prevMouse = mouse.clone();
  const rawVel = new Vector2();
  let lastPointer = -10;
  let pointerSpeed = 0;
  let lastMoveAt = -10;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  const onPointer = (e: PointerEvent) => {
    const now = performance.now() / 1000;
    const x = e.clientX / width;
    const y = 1 - e.clientY / height;
    const dtp = Math.max(1 / 240, now - lastT);
    if (now - lastT < 0.25) pointerSpeed = Math.min(4, Math.hypot(x - lastX, y - lastY) / dtp);
    else pointerSpeed = e.type === "pointerdown" ? 1 : 0;
    lastX = x;
    lastY = y;
    lastT = now;
    target.set(x, y);
    lastPointer = clock;
    lastMoveAt = clock;
  };

  let visible = !document.hidden;
  const onVisibility = () => {
    visible = !document.hidden;
  };

  const onContextLost = () => {
    teardown();
    onFallback("context-lost");
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onReduce = () => {
    if (!reduce.matches) return;
    teardown();
    onFallback("reduced-motion");
  };

  const ro = new ResizeObserver(() => resize());
  ro.observe(host);
  const sectionRo = new ResizeObserver(() => measure());
  sectionRo.observe(hero);
  sectionRo.observe(surface);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  reduce.addEventListener("change", onReduce);

  const frame: Frame = {
    time: 0,
    dt: 0,
    scroll: 0,
    descent: 0,
    mouse,
    mouseVel,
    mouseAmt: 0,
    pointerSpeed: 0,
    pointerActive: false,
  };

  let lastRender = -1;
  let lastScroll = -1;
  let lastScrollAt = 0;
  let shown = false;
  let onScreen = true;
  // Adaptive step-down (56 §6.4): if the first 2 s average more than 22 ms per frame, use the next tier's resolution.
  let probeTime = 0;
  let probeFrames = 0;
  let probed = false;

  const tick = (_time: number, deltaMs: number) => {
    if (destroyed) return;
    const dt = Math.min(0.1, deltaMs / 1000);
    clock += dt;
    if (!visible || root.classList.contains("tp-menu-open")) return;

    const y = scrollY;
    if (y !== lastScroll) {
      lastScroll = y;
      lastScrollAt = clock;
    }
    // the top of S2 is translucent in GL mode (globals.css), so keep drawing until it has left the viewport
    const nowOnScreen = y < surfaceBottom + 200;
    if (nowOnScreen !== onScreen) {
      onScreen = nowOnScreen;
      canvas.style.visibility = onScreen ? "" : "hidden";
    }
    if (!onScreen) return;

    // 30 fps on tier 1, and on every tier after 3 s without scrolling or pointer movement.
    const idle = clock - lastScrollAt > 3 && clock - lastMoveAt > 3;
    const minStep = settings.fpsCap === 30 || idle ? 1 / 30 - 0.004 : 0;
    if (lastRender >= 0 && clock - lastRender < minStep) return;
    const step = lastRender < 0 ? dt : clock - lastRender;
    lastRender = clock;

    const k = 1 - Math.exp(-step * 5);
    prevMouse.copy(mouse);
    mouse.lerp(target, k);
    rawVel.subVectors(mouse, prevMouse).divideScalar(Math.max(step, 1e-3));
    mouseVel.lerp(rawVel, 1 - Math.exp(-step * 8));
    const active = clock - lastPointer < 1.2;
    frame.mouseAmt += ((active ? 1 : 0.35) - frame.mouseAmt) * (1 - Math.exp(-step * 2.5));
    pointerSpeed *= Math.exp(-step * 6);

    frame.time = clock;
    frame.dt = step;
    frame.scroll = y / height;
    frame.descent = Math.min(1, Math.max(0, y / heroH));
    frame.pointerSpeed = pointerSpeed;
    frame.pointerActive = active;

    scene.render(frame);

    if (!shown) {
      shown = true;
      requestAnimationFrame(() => {
        canvas.classList.add("is-on");
        root.dataset.gl = "on";
      });
    }

    if (!probed && settings.fpsCap === 60 && !idle) {
      probeTime += dt;
      probeFrames++;
      if (probeTime > 2) {
        probed = true;
        if ((probeTime / probeFrames) * 1000 > 22 && activeTier > 1) {
          activeTier = (activeTier - 1) as Tier;
          settings = { ...settings, dprMax: TIERS[activeTier].dprMax, renderScale: TIERS[activeTier].renderScale };
          root.dataset.qualityStep = String(activeTier);
          resize();
        }
      }
    }
  };

  function teardown() {
    if (destroyed) return;
    destroyed = true;
    gsap.ticker.remove(tick);
    ro.disconnect();
    sectionRo.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("pointerdown", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    reduce.removeEventListener("change", onReduce);
    delete root.dataset.gl;
    delete root.dataset.qualityStep;
    scene.dispose();
    renderer.dispose();
    canvas.remove();
  }

  gsap.ticker.add(tick);

  if (new URLSearchParams(window.location.search).has("debug")) {
    import("./debug").then(({ attachDebug }) => {
      if (!destroyed) attachDebug(scene, () => ({ tier: activeTier, ripple: scene.rippleKind, dpr: renderer.getPixelRatio() }));
    });
  }

  return { destroy: teardown };
}
