// WCAG 2.2 contrast check of the text/background pairs used in app/globals.css. Exits 1 if any pair is under its minimum.
const c = {
  cream: "#f6f1e8",
  paper: "#fbf8f2",
  ink: "#1e2a2e",
  muted: "#536062",
  petrol: "#12393f",
  petrolDeep: "#0b2a2f",
  abyss: "#082226",
  copper: "#9a4e1f",
  copperDeep: "#7f3e16",
  sand: "#d9b98c",
  water: "#cfe3e1",
  waterDeep: "#c8dedb",
  mist: "#b4cdca",
  verifyBg: "#f1dec9",
  verifyInk: "#7f3e16",
  phBg: "#e3ecea",
  unitArt: "#e4eeeb",
  tag: "#ece5d8",
  duskMid: "#e6cda6",
  white: "#ffffff",
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [text, background, minimum]
const pairs = [
  ["ink", "cream", 4.5],
  ["ink", "paper", 4.5],
  ["ink", "water", 4.5],
  ["ink", "waterDeep", 4.5],
  ["ink", "phBg", 4.5],
  ["ink", "tag", 4.5],
  ["ink", "sand", 4.5],
  ["ink", "duskMid", 4.5],
  ["muted", "cream", 4.5],
  ["muted", "paper", 4.5],
  ["muted", "water", 4.5],
  ["petrol", "cream", 4.5],
  ["petrol", "paper", 4.5],
  ["petrol", "water", 4.5],
  ["petrol", "unitArt", 4.5],
  ["copperDeep", "cream", 4.5],
  ["copperDeep", "paper", 4.5],
  ["copperDeep", "water", 4.5],
  ["copperDeep", "duskMid", 4.5],
  ["white", "copper", 4.5],
  ["white", "copperDeep", 4.5],
  ["cream", "copper", 4.5],
  ["cream", "copperDeep", 4.5],
  ["cream", "petrol", 4.5],
  ["cream", "petrolDeep", 4.5],
  ["cream", "abyss", 4.5],
  ["mist", "petrol", 4.5],
  ["mist", "petrolDeep", 4.5],
  ["mist", "abyss", 4.5],
  ["sand", "petrol", 4.5],
  ["sand", "petrolDeep", 4.5],
  ["sand", "abyss", 4.5],
  ["petrol", "sand", 4.5],
  ["verifyInk", "verifyBg", 4.5],
  ["copper", "cream", 3],
];

let fail = 0;
for (const [fg, bg, min] of pairs) {
  const r = ratio(c[fg], c[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${fg}/${bg} ${r.toFixed(2)} (min ${min})`);
}
process.exit(fail ? 1 : 0);
