import { hash } from "./noise";
import { palette } from "./fullscreen";

/**
 * Tier 3 post pass (56 §3): chromatic aberration towards the edges (≤ 1.5 px), highlight bloom from eight taps,
 * a gentle tone curve, vignette and film grain. Tier 2 inlines grain + vignette in the water pass; tier 1 has none.
 */
export const compositeFrag = /* glsl */ `
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;
uniform vec2 uRes;
uniform float uTime;
uniform float uAspect;
uniform float uGrain;
uniform float uBloom;

${hash}
${palette}

void main() {
  vec2 c = vUv - 0.5;
  vec2 off = c * (dot(c, c) / 0.5) * (1.5 / 0.7071) / uRes;
  vec3 col = vec3(
    texture(uScene, vUv + off).r,
    texture(uScene, vUv).g,
    texture(uScene, vUv - off).b
  );

  vec3 glow = vec3(0.0);
  vec2 px = 9.0 / uRes;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398 + 0.39;
    vec3 s = texture(uScene, vUv + vec2(cos(a), sin(a)) * px * (1.0 + float(i & 1))).rgb;
    glow += max(s - 0.975, 0.0);
  }
  col += glow * uBloom;

  col = mix(col, col * col * (3.0 - 2.0 * col), 0.1);
  vec2 vc = c * vec2(uAspect, 1.0);
  col *= mix(0.955, 1.0, smoothstep(1.15, 0.35, length(vc)));
  col += (hash12(gl_FragCoord.xy + fract(uTime * 7.0) * 311.0) - 0.5) * uGrain;
  fragColor = vec4(clamp(col, DEEP, CEIL), 1.0);
}
`;
