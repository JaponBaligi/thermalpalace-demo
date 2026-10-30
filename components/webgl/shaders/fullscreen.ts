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
 * Palette, art direction A "Taş ve Buhar" (sRGB, shared by the passes): dark mineral water, warm grey steam, amber light.
 * The final output is clamped to [DEEP, CEIL]; CEIL (relative luminance ≈ 0.12) keeps bone text over the water ≥ 4.5:1.
 */
export const palette = /* glsl */ `
const vec3 CREAM = vec3(0.110, 0.125, 0.137);
const vec3 PAPER = vec3(0.165, 0.192, 0.200);
const vec3 HAZE = vec3(0.090, 0.102, 0.110);
const vec3 MIST = vec3(0.078, 0.090, 0.102);
const vec3 WATER = vec3(0.060, 0.072, 0.078);
const vec3 DEEP = vec3(0.035, 0.040, 0.045);
const vec3 CEIL = vec3(0.380, 0.370, 0.355);
const vec3 SAND = vec3(0.784, 0.529, 0.227);
const vec3 PETROL = vec3(0.165, 0.192, 0.200);
`;
