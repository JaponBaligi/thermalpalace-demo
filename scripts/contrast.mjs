// WCAG 2.2 contrast check of the text/background pairs used in app/globals.css. Exits 1 if any pair is under its minimum.
const c = {
  basalt: "#14171a",
  basaltDeep: "#0e1012",
  slateSoft: "#1c2023",
  slate: "#2a3133",
  quartz: "#8c918c",
  quartzLight: "#aeb2ab",
  bone: "#e9e4da",
  amber: "#c8873a",
  amberHover: "#d89a52",
  verifyBg: "#2e261c",
  verifyInk: "#e0a862",
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [text, background, minimum]; amber on slate only for large text, quartz is body text only on basalt
const pairs = [
  ["bone", "basalt", 4.5],
  ["bone", "basaltDeep", 4.5],
  ["bone", "slateSoft", 4.5],
  ["bone", "slate", 4.5],
  ["quartzLight", "basalt", 4.5],
  ["quartzLight", "basaltDeep", 4.5],
  ["quartzLight", "slateSoft", 4.5],
  ["quartzLight", "slate", 4.5],
  ["amber", "basalt", 4.5],
  ["amber", "basaltDeep", 4.5],
  ["amber", "slateSoft", 4.5],
  ["amber", "slate", 3],
  ["quartz", "basalt", 4.5],
  ["basalt", "amber", 4.5],
  ["basalt", "amberHover", 4.5],
  ["verifyInk", "verifyBg", 4.5],
];

let fail = 0;
for (const [fg, bg, min] of pairs) {
  const r = ratio(c[fg], c[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${fg}/${bg} ${r.toFixed(2)} (min ${min})`);
}
process.exit(fail ? 1 : 0);
