import GUI from "lil-gui";
import type { SurfaceScene } from "./SurfaceScene";

/** `?debug` only: loaded through a dynamic import from Stage.ts, so lil-gui never ships in the default path. */
export function attachDebug(scene: SurfaceScene, info: () => { tier: number; ripple: string; dpr: number }) {
  const gui = new GUI({ title: "thermalpalace · P2" });
  const stats = { tier: "", ripple: "", dpr: 0, fps: 0 };
  const readout = gui.addFolder("Stage");
  readout.add(stats, "tier").disable().listen();
  readout.add(stats, "ripple").disable().listen();
  readout.add(stats, "dpr").disable().listen();
  readout.add(stats, "fps").disable().listen();

  const p = scene.params;
  const look = gui.addFolder("Surface");
  look.add(p, "descentOverride", -1, 1, 0.01).name("descent (-1 = scroll)");
  look.add(p, "density", 0, 2, 0.01).name("steam density");
  look.add(p, "waveAmp", 0, 3, 0.01).name("wave amplitude");
  look.add(p, "rippleGain", 0, 2, 0.01).name("ripple gain (sim)");
  look.add(p, "damping", 0.95, 0.999, 0.001).name("ripple damping (sim)");
  look.add(p, "grain", 0, 0.08, 0.001).name("grain (tier 3)");
  look.add(p, "bloom", 0, 2, 0.01).name("bloom (tier 3)");

  let frames = 0;
  let last = performance.now();
  const loop = () => {
    frames++;
    const now = performance.now();
    if (now - last > 500) {
      const i = info();
      stats.tier = String(i.tier);
      stats.ripple = i.ripple;
      stats.dpr = i.dpr;
      stats.fps = Math.round((frames * 1000) / (now - last));
      frames = 0;
      last = now;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
