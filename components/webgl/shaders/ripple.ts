/**
 * Tier 3 ripple simulation: height field in a 256² ping-pong buffer (R = height, G = previous height),
 * discrete wave equation with damping, plus one smooth drop per step at uDrop (uv, radius, strength).
 */
export const rippleFrag = /* glsl */ `
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform vec4 uDrop;
uniform float uDamping;

void main() {
  vec4 s = texture(uState, vUv);
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float d = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float u = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  float h = (l + r + d + u) * 0.5 - s.g;
  float border = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x) * smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
  h *= uDamping * mix(0.9, 1.0, border);
  if (uDrop.w != 0.0) {
    float k = max(0.0, 1.0 - length(vUv - uDrop.xy) / uDrop.z);
    h += (0.5 - cos(k * 3.14159265) * 0.5) * uDrop.w;
  }
  fragColor = vec4(h, s.r, 0.0, 1.0);
}
`;
