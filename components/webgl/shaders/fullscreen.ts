/** Shared vertex shader for every pass: one oversized triangle covering the viewport. */
export const fullscreenVert = /* glsl */ `
precision highp float;
in vec3 position;
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Palette (57 §2) in sRGB, shared by the passes. DEEP is also the per-channel floor of the final output
 * (relative luminance ≈ 0.575): the copper-deep kicker and muted text over the water stay ≥ 4.5:1.
 */
export const palette = /* glsl */ `
const vec3 CREAM = vec3(0.965, 0.945, 0.910);
const vec3 PAPER = vec3(0.984, 0.973, 0.949);
const vec3 HAZE = vec3(0.945, 0.937, 0.906);
const vec3 MIST = vec3(0.886, 0.925, 0.910);
const vec3 WATER = vec3(0.812, 0.890, 0.882);
const vec3 DEEP = vec3(0.680, 0.810, 0.795);
const vec3 SAND = vec3(0.851, 0.725, 0.549);
const vec3 PETROL = vec3(0.071, 0.224, 0.247);
const vec3 STEAM_LIT = vec3(0.988, 0.982, 0.962);
const vec3 STEAM_SHADE = vec3(0.745, 0.808, 0.806);
`;
