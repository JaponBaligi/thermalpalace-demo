import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  GLSL3,
  HalfFloatType,
  LinearFilter,
  Mesh,
  RawShaderMaterial,
  Scene,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget,
  type IUniform,
  type WebGLRenderer,
} from "./three";
import type { Tier, TierSettings } from "@/lib/quality";
import { fullscreenVert } from "./shaders/fullscreen";
import { steamFrag } from "./shaders/steam";
import { waterFrag } from "./shaders/water";
import { rippleFrag } from "./shaders/ripple";
import { compositeFrag } from "./shaders/composite";

/** Per-frame input from the stage. Positions in viewport uv (0..1, y up). */
export type Frame = {
  time: number;
  dt: number;
  /** scrollY in viewport heights */
  scroll: number;
  /** 0 at the top of the hero, 1 when the surface section reaches the top */
  descent: number;
  mouse: Vector2;
  mouseVel: Vector2;
  mouseAmt: number;
  /** pointer speed in uv/s (unsmoothed), drives ripple strength */
  pointerSpeed: number;
  pointerActive: boolean;
};

type Pass = { scene: Scene; material: RawShaderMaterial };
type Uniforms = Record<string, IUniform>;

const SIM_SIZE = 256;
const FOV_TAN_HALF = Math.tan((50 * Math.PI) / 180 / 2);
const PITCH_TOP = -0.29;
const PITCH_SURFACE = 0.96;
/** Ripple domain on the water plane: centre (x, z) and edge length, sized to the S1 view footprint. */
const RIPPLE_RECT = new Vector3(0, -2.2, 3.2);

/** Tunables exposed in the ?debug panel. */
export type SurfaceParams = {
  density: number;
  waveAmp: number;
  rippleGain: number;
  damping: number;
  grain: number;
  bloom: number;
  descentOverride: number;
};

export class SurfaceScene {
  readonly params: SurfaceParams = { density: 1, waveAmp: 1, rippleGain: 0.9, damping: 0.986, grain: 0.03, bloom: 0.45, descentOverride: -1 };
  private readonly camera = new Camera();
  private readonly geometry = new BufferGeometry();
  private readonly steam: Pass;
  private readonly water: Pass;
  private readonly composite: Pass | null = null;
  private readonly ripple: Pass | null = null;
  private readonly steamRT: WebGLRenderTarget;
  private readonly sceneRT: WebGLRenderTarget | null = null;
  private simA: WebGLRenderTarget | null = null;
  private simB: WebGLRenderTarget | null = null;
  private readonly rings: Vector4[] = [];
  private ringIndex = 0;
  private lastRing = new Vector2(1e3, 1e3);
  private lastRingTime = -10;
  private nextAmbient = 1.5;
  private pendingDrop = new Vector4();
  private readonly cam = { pos: new Vector3(), fwd: new Vector3(), up: new Vector3(), right: new Vector3(1, 0, 0) };
  private aspect = 1;
  private readonly rippleMode: TierSettings["ripple"];

  constructor(
    private readonly renderer: WebGLRenderer,
    readonly tier: Tier,
    private readonly settings: TierSettings,
  ) {
    this.geometry.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

    const halfFloat = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");
    this.rippleMode = settings.ripple === "sim" && !halfFloat ? "analytic" : settings.ripple;

    const defines: Record<string, string | number> = { OCTAVES: settings.octaves, WAVES: settings.waves, FLOOR_LIGHT: settings.lighting ? 2 : 1 };
    if (settings.lighting) defines.LIT = 1;
    if (this.rippleMode === "sim") defines.RIPPLE_SIM = 1;
    if (this.rippleMode === "analytic") defines.RIPPLE_ANALYTIC = 1;
    if (settings.post === "grain") defines.POST_GRAIN = 1;

    this.steamRT = new WebGLRenderTarget(1, 1, { minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false });

    this.steam = this.pass(steamFrag, defines, {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScroll: { value: 0 },
      uDescent: { value: 0 },
      uHorizon: { value: 0.18 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uMouseVel: { value: new Vector2() },
      uMouseAmt: { value: 0 },
      uDensity: { value: 1 },
      uLightDir: { value: new Vector2(0.5, 0.85).normalize() },
    });

    const waterUniforms: Uniforms = {
      uRes: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uTanHalf: { value: FOV_TAN_HALF },
      uCamPos: { value: this.cam.pos },
      uCamFwd: { value: this.cam.fwd },
      uCamUp: { value: this.cam.up },
      uCamRight: { value: this.cam.right },
      uSunDir: { value: new Vector3(0.72, 0.17, -1).normalize() },
      uSteam: { value: this.steamRT.texture },
      uWaveAmp: { value: 1 },
    };
    if (this.rippleMode === "sim") {
      const opts = { type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false };
      this.simA = new WebGLRenderTarget(SIM_SIZE, SIM_SIZE, opts);
      this.simB = new WebGLRenderTarget(SIM_SIZE, SIM_SIZE, opts);
      this.ripple = this.pass(rippleFrag, {}, {
        uState: { value: this.simA.texture },
        uTexel: { value: new Vector2(1 / SIM_SIZE, 1 / SIM_SIZE) },
        uDrop: { value: new Vector4() },
        uDamping: { value: this.params.damping },
      });
      waterUniforms.uRipple = { value: this.simA.texture };
      waterUniforms.uRippleRect = { value: RIPPLE_RECT };
      waterUniforms.uRippleGain = { value: this.params.rippleGain };
    }
    if (this.rippleMode === "analytic") {
      for (let i = 0; i < 4; i++) this.rings.push(new Vector4(0, 0, -100, 0));
      waterUniforms.uRings = { value: this.rings };
    }
    this.water = this.pass(waterFrag, defines, waterUniforms);

    if (settings.post === "full") {
      this.sceneRT = new WebGLRenderTarget(1, 1, { minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false });
      this.composite = this.pass(compositeFrag, {}, {
        uScene: { value: this.sceneRT.texture },
        uRes: { value: new Vector2(1, 1) },
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uGrain: { value: this.params.grain },
        uBloom: { value: this.params.bloom },
      });
    }
  }

  get rippleKind() {
    return this.rippleMode;
  }

  private pass(fragmentShader: string, defines: Record<string, string | number>, uniforms: Uniforms): Pass {
    const material = new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: fullscreenVert,
      fragmentShader,
      uniforms,
      defines,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(this.geometry, material);
    mesh.frustumCulled = false;
    const scene = new Scene();
    scene.add(mesh);
    return { scene, material };
  }

  /** Compiles one program per task so no single long task blocks input (KHR_parallel_shader_compile when available). */
  async compile(yieldToMain: () => Promise<void>) {
    for (const p of [this.ripple, this.steam, this.water, this.composite]) {
      if (!p) continue;
      await this.renderer.compileAsync(p.scene, this.camera);
      await yieldToMain();
    }
  }

  /** Sizes in CSS pixels; `dpr` is the clamped device pixel ratio, `renderScale` the steam buffer scale. */
  setSize(width: number, height: number, dpr: number, renderScale: number) {
    this.aspect = width / Math.max(1, height);
    const bw = Math.max(1, Math.round(width * dpr));
    const bh = Math.max(1, Math.round(height * dpr));
    this.steamRT.setSize(Math.max(1, Math.round(width * renderScale)), Math.max(1, Math.round(height * renderScale)));
    this.sceneRT?.setSize(bw, bh);
    (this.water.material.uniforms.uRes.value as Vector2).set(bw, bh);
    if (this.composite) (this.composite.material.uniforms.uRes.value as Vector2).set(bw, bh);
  }

  /** Camera tilts from looking slightly up over the water (hero) to looking down onto it (surface). */
  private updateCamera(descent: number, time: number) {
    const e = descent * descent * (3 - 2 * descent);
    const pitch = PITCH_TOP + (PITCH_SURFACE - PITCH_TOP) * e;
    this.cam.pos.set(Math.sin(time * 0.07) * 0.15, 2.0 - 0.85 * e, -1.4 * e);
    this.cam.fwd.set(0, -Math.sin(pitch), -Math.cos(pitch));
    this.cam.up.set(0, Math.cos(pitch), -Math.sin(pitch));
    return 0.5 + (0.5 * Math.tan(pitch)) / FOV_TAN_HALF;
  }

  /** Viewport uv → point on the water plane (x, z), or null over the sky. */
  private toWater(uv: Vector2, out: Vector2) {
    const nx = (uv.x * 2 - 1) * this.aspect * FOV_TAN_HALF;
    const ny = (uv.y * 2 - 1) * FOV_TAN_HALF;
    const { pos, fwd, up, right } = this.cam;
    const dx = fwd.x + nx * right.x + ny * up.x;
    const dy = fwd.y + nx * right.y + ny * up.y;
    const dz = fwd.z + nx * right.z + ny * up.z;
    if (dy > -0.02) return null;
    const t = -pos.y / dy;
    return out.set(pos.x + dx * t, pos.z + dz * t);
  }

  private hit = new Vector2();

  private emitRipples(f: Frame) {
    if (this.rippleMode === "none") return;
    let strength = 0;
    let at: Vector2 | null = null;
    if (f.pointerActive && f.pointerSpeed > 0.05) {
      at = this.toWater(f.mouse, this.hit);
      strength = Math.min(1, f.pointerSpeed * 0.9);
    }
    if (!at && f.time > this.nextAmbient) {
      this.nextAmbient = f.time + 2.4 + Math.random() * 2.6;
      at = this.toWater(new Vector2(0.15 + Math.random() * 0.7, Math.random() * 0.45), this.hit);
      strength = 0.45;
    }
    if (!at) return;

    if (this.rippleMode === "sim") {
      const rect = RIPPLE_RECT;
      const u = (at.x - rect.x) / rect.z + 0.5;
      const v = (at.y - rect.y) / rect.z + 0.5;
      if (u > 0 && u < 1 && v > 0 && v < 1) this.pendingDrop.set(u, v, 0.02, 0.06 * strength);
      return;
    }
    const moved = at.distanceTo(this.lastRing);
    if (moved < 0.22 && f.time - this.lastRingTime < 0.7) return;
    if (f.time - this.lastRingTime < 0.18) return;
    this.rings[this.ringIndex].set(at.x, at.y, f.time, 0.4 + strength * 0.6);
    this.ringIndex = (this.ringIndex + 1) % this.rings.length;
    this.lastRing.copy(at);
    this.lastRingTime = f.time;
  }

  private stepSim(dt: number) {
    if (!this.ripple || !this.simA || !this.simB) return;
    const u = this.ripple.material.uniforms;
    u.uDamping.value = this.params.damping;
    const steps = Math.max(1, Math.min(3, Math.round(dt * 90)));
    for (let i = 0; i < steps; i++) {
      u.uState.value = this.simA.texture;
      if (i === 0) (u.uDrop.value as Vector4).copy(this.pendingDrop);
      else (u.uDrop.value as Vector4).set(0, 0, 0, 0);
      this.renderer.setRenderTarget(this.simB);
      this.renderer.render(this.ripple.scene, this.camera);
      [this.simA, this.simB] = [this.simB, this.simA];
    }
    this.pendingDrop.set(0, 0, 0, 0);
    this.water.material.uniforms.uRipple.value = this.simA.texture;
    this.water.material.uniforms.uRippleGain.value = this.params.rippleGain;
  }

  render(f: Frame) {
    const descent = this.params.descentOverride >= 0 ? this.params.descentOverride : f.descent;
    const horizon = this.updateCamera(descent, f.time);
    this.emitRipples(f);
    this.stepSim(f.dt);

    const s = this.steam.material.uniforms;
    s.uTime.value = f.time;
    s.uAspect.value = this.aspect;
    s.uScroll.value = f.scroll;
    s.uDescent.value = descent;
    s.uHorizon.value = horizon;
    (s.uMouse.value as Vector2).copy(f.mouse);
    (s.uMouseVel.value as Vector2).copy(f.mouseVel);
    s.uMouseAmt.value = f.mouseAmt;
    s.uDensity.value = this.params.density;

    const w = this.water.material.uniforms;
    w.uTime.value = f.time;
    w.uAspect.value = this.aspect;
    w.uWaveAmp.value = this.params.waveAmp;

    const r = this.renderer;
    r.setRenderTarget(this.steamRT);
    r.render(this.steam.scene, this.camera);
    if (this.composite && this.sceneRT) {
      r.setRenderTarget(this.sceneRT);
      r.render(this.water.scene, this.camera);
      const c = this.composite.material.uniforms;
      c.uTime.value = f.time;
      c.uAspect.value = this.aspect;
      c.uGrain.value = this.params.grain;
      c.uBloom.value = this.params.bloom;
      r.setRenderTarget(null);
      r.render(this.composite.scene, this.camera);
    } else {
      r.setRenderTarget(null);
      r.render(this.water.scene, this.camera);
    }
  }

  dispose() {
    for (const p of [this.steam, this.water, this.composite, this.ripple]) p?.material.dispose();
    this.geometry.dispose();
    this.steamRT.dispose();
    this.sceneRT?.dispose();
    this.simA?.dispose();
    this.simB?.dispose();
  }
}
