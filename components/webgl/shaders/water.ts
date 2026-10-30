import { hash, noise } from "./noise";
import { palette } from "./fullscreen";

/**
 * S0/S1 scene pass: morning sky, the thermal water surface seen from a camera that tilts down as the page
 * descends, and the steam buffer on top. One ray per pixel against the plane y = 0 (no geometry).
 * Defines: WAVES (3–6 sine waves), RIPPLE_SIM | RIPPLE_ANALYTIC, FLOOR_LIGHT (1–2 layers), POST_GRAIN, OCTAVES (noise include).
 */
export const waterFrag = /* glsl */ `
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uAspect;
uniform float uTanHalf;
uniform vec3 uCamPos;
uniform vec3 uCamFwd;
uniform vec3 uCamUp;
uniform vec3 uCamRight;
uniform vec3 uSunDir;
uniform sampler2D uSteam;
uniform float uWaveAmp;
#ifdef RIPPLE_SIM
uniform sampler2D uRipple;
uniform vec3 uRippleRect;
uniform float uRippleGain;
#endif
#ifdef RIPPLE_ANALYTIC
uniform vec4 uRings[4];
#endif

${noise}
${hash}
${palette}

vec3 sky(vec3 d) {
  float e = clamp(d.y, -0.1, 1.0);
  vec3 c = mix(MIST, HAZE, smoothstep(0.0, 0.2, e));
  c = mix(c, CREAM, smoothstep(0.16, 0.45, e));
  c = mix(c, PAPER, smoothstep(0.5, 1.0, e) * 0.6);
  // soft high cloud, projected on a sky plane; gives the reflections something to bend
  vec2 cp = d.xz / max(d.y, 0.06) * 0.32 + vec2(uTime * 0.004, 0.0);
  float cloud = smoothstep(0.05, 0.75, snoise(vec3(cp, uTime * 0.008)));
  c = mix(c, PAPER, cloud * 0.6 * smoothstep(0.02, 0.25, e));
  float s = max(dot(d, uSunDir), 0.0);
  c += vec3(0.035, 0.028, 0.016) * pow(s, 24.0) + vec3(0.06, 0.05, 0.035) * pow(s, 400.0);
  return c;
}

#define WAVE(dx, dz, f, a, s) { vec2 D = normalize(vec2(dx, dz)); float ph = dot(D, xz) * f + t * s; float aa = 1.0 - smoothstep(0.5, 1.6, f * fp); g += aa * a * f * D * cos(ph); }

vec2 waveSlope(vec2 xz, float t, float fp) {
  vec2 g = vec2(0.0);
  WAVE(0.86, 0.50, 4.3, 0.0060, 0.62)
  WAVE(-0.42, 0.91, 6.9, 0.0042, 0.81)
  WAVE(0.27, -0.96, 11.2, 0.0026, 1.05)
#if WAVES > 3
  WAVE(-0.93, -0.37, 17.6, 0.0015, 1.33)
#endif
#if WAVES > 4
  WAVE(0.64, 0.77, 27.0, 0.0009, 1.7)
  WAVE(-0.21, -0.98, 41.0, 0.0005, 2.2)
#endif
  return g * uWaveAmp;
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 dir = normalize(uCamFwd + ndc.x * uAspect * uTanHalf * uCamRight + ndc.y * uTanHalf * uCamUp);
  vec3 col;

  if (dir.y >= -0.0005) {
    col = sky(dir);
  } else {
    float dist = -uCamPos.y / dir.y;
    vec3 P = uCamPos + dir * dist;
    // world size of one pixel along the view, used to fade waves that would alias
    float fp = dist * (2.0 * uTanHalf / uRes.y) / max(-dir.y, 0.03);
    vec2 g = waveSlope(P.xz, uTime, fp);

#ifdef RIPPLE_SIM
    vec2 suv = (P.xz - uRippleRect.xy) / uRippleRect.z + 0.5;
    float edge = smoothstep(0.0, 0.08, suv.x) * smoothstep(1.0, 0.92, suv.x) * smoothstep(0.0, 0.08, suv.y) * smoothstep(1.0, 0.92, suv.y);
    if (edge > 0.0) {
      vec2 e = vec2(1.0 / 256.0, 0.0);
      float hx = texture(uRipple, suv + e.xy).r - texture(uRipple, suv - e.xy).r;
      float hz = texture(uRipple, suv + e.yx).r - texture(uRipple, suv - e.yx).r;
      g += vec2(hx, hz) * uRippleGain * edge / (1.0 + fp * 40.0);
    }
#endif
#ifdef RIPPLE_ANALYTIC
    for (int i = 0; i < 4; i++) {
      vec4 ring = uRings[i];
      float age = uTime - ring.z;
      if (ring.w <= 0.0 || age < 0.0 || age > 6.0) continue;
      vec2 off = P.xz - ring.xy;
      float r = length(off) + 1e-4;
      float x = r - age * 0.34;
      float env = exp(-x * x / 0.012) * exp(-age * 0.75) * ring.w;
      g += off / r * env * 26.0 * 0.0065 * cos(x * 26.0) / (1.0 + fp * 40.0);
    }
#endif

    vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
    vec3 V = -dir;
    float ndv = max(dot(n, V), 0.0);
    // F0 above water's 0.02 so the sky still reads from above (art direction, not physics)
    float F = 0.07 + 0.93 * pow(1.0 - ndv, 5.0);
    vec3 R = reflect(dir, n);
    R.y = abs(R.y);
    vec3 refl = sky(R) * vec3(0.925, 0.968, 0.966);

    float steep = clamp(-dir.y, 0.0, 1.0);
    vec3 body = mix(WATER, DEEP, smoothstep(0.15, 0.85, steep));
    body *= 1.0 + dot(n.xz, vec2(-0.55, 0.8)) * 2.6;
    // sunlight focused by the surface onto the pool floor, seen through the water
    float floorFade = smoothstep(0.2, 0.7, steep) / (1.0 + fp * 30.0);
    vec2 fl = P.xz * 2.3 + n.xz * 1.4;
    float c1 = 1.0 - abs(snoise(vec3(fl, uTime * 0.11)));
#if FLOOR_LIGHT > 1
    float c2 = 1.0 - abs(snoise(vec3(fl * 1.7 + 3.1, -uTime * 0.09)));
    float caustic = pow(c1, 7.0) * 0.6 + pow(c2, 9.0) * 0.45;
#else
    float caustic = pow(c1, 8.0) * 0.75;
#endif
    body += vec3(1.0, 0.96, 0.86) * caustic * 0.17 * floorFade;
    col = mix(body, refl, F);

    // sun glints only where the waves still resolve; far, flat water would mirror the whole disc
    float sun = max(dot(R, uSunDir), 0.0);
    float glint = pow(sun, 3000.0) * 1.6 * (1.0 - smoothstep(8.0, 30.0, dist));
    col += vec3(1.0, 0.94, 0.82) * (glint + pow(sun, 80.0) * 0.035);
    vec3 top = normalize(vec3(-0.35, 1.0, 0.3));
    col += vec3(1.0, 0.98, 0.94) * pow(max(dot(R, top), 0.0), 80.0) * 0.22;

    col = mix(col, MIST, smoothstep(6.0, 60.0, dist) * 0.6);
  }

  vec4 steam = texture(uSteam, vUv);
  col = col * (1.0 - steam.a) + steam.rgb;

#ifdef POST_GRAIN
  vec2 vc = (vUv - 0.5) * vec2(uAspect, 1.0);
  col *= mix(0.955, 1.0, smoothstep(1.15, 0.35, length(vc)));
  col += (hash12(gl_FragCoord.xy + fract(uTime * 7.0) * 311.0) - 0.5) * 0.026;
#else
  col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
#endif
  fragColor = vec4(max(col, DEEP), 1.0);
}
`;
