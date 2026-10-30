import { noise } from "./noise";
import { palette } from "./fullscreen";

/**
 * S0 steam: three parallax layers of domain-warped fbm rising off the water, pushed by the cursor.
 * Rendered at the tier's render scale into a premultiplied RGBA buffer; the water pass composites it.
 * Defines: OCTAVES, LIT (two-sample lighting on the near layer).
 */
export const steamFrag = /* glsl */ `
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform float uAspect;
uniform float uScroll;
uniform float uDescent;
uniform float uHorizon;
uniform vec2 uMouse;
uniform vec2 uMouseVel;
uniform float uMouseAmt;
uniform float uDensity;
uniform vec2 uLightDir;

${noise}
${palette}

float field(vec2 p, float t, float seed) {
  vec2 w = vec2(snoise(vec3(p * 0.45, t * 0.7 + seed)), snoise(vec3(p * 0.45 + 7.31, t * 0.7 - seed)));
  return fbm(vec3(p + w * 0.85, t + seed * 3.7));
}

void layer(inout vec4 acc, vec2 a, vec2 push, float scale, float rise, float par, float drift, float seed, float opacity, float shape, bool lit) {
  float t = uTime * 0.045;
  // vertical stretch: rising plumes rather than round clouds
  vec2 p = (a - push - vec2(-drift * uTime, par * uScroll + rise * uTime)) * vec2(scale, scale * 0.6);
  float n = field(p, t, seed);
  float d = smoothstep(-0.1, 0.5, n) * shape * opacity;
  float shade = clamp(0.38 + 0.5 * vUv.y + 0.45 * n, 0.0, 1.0);
#ifdef LIT
  if (lit) {
    float n2 = field(p + uLightDir * 0.16, t, seed);
    shade = clamp(0.58 + (n - n2) * 2.4, 0.0, 1.0);
  }
#endif
  vec3 col = mix(STEAM_SHADE, STEAM_LIT, shade) + SAND * 0.05 * shade * (1.0 - vUv.y);
  acc.rgb = col * d + acc.rgb * (1.0 - d);
  acc.a = d + acc.a * (1.0 - d);
}

void main() {
  vec2 a = vec2(vUv.x * uAspect, vUv.y);
  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 dm = a - m;
  float md = length(dm);
  float near = exp(-md * md / 0.035) * uMouseAmt;
  vec2 push = dm / max(md, 1e-3) * near * 0.07 + uMouseVel * vec2(uAspect, 1.0) * near * 0.045;

  float above = vUv.y - uHorizon;
  float shape = above > 0.0 ? 0.38 + 1.05 * exp(-above * 1.4) : mix(1.4, 0.65, clamp(-above * 2.0, 0.0, 1.0));
  shape *= mix(1.0, 0.26, uDescent) * uDensity * (1.0 - near * 0.45);

  vec4 acc = vec4(0.0);
  layer(acc, a, push * 0.6, 3.1, 0.010, 0.30, 0.010, 0.0, 0.55, shape, false);
  layer(acc, a, push * 0.85, 1.9, 0.017, 0.62, -0.014, 1.7, 0.65, shape, false);
  layer(acc, a, push, 1.15, 0.026, 1.10, 0.020, 3.9, 0.78, shape, true);
  fragColor = vec4(acc.rgb, min(acc.a, 0.92));
}
`;
