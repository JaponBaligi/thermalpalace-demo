import type { Locale } from "./routes";

type L = Record<Locale, string>;

export type Facility = { id: string; name: L; line: L | null };

/** Pools (57 §1): indoor and outdoor verified; children's pool single source (RCI/AFVC). No pool count, no temperatures. */
export const pools: (Facility & { tone: "deep" | "open" | "small" | "steam"; season: L })[] = [
  {
    id: "kapali",
    tone: "deep",
    name: { tr: "Kapalı termal havuz", en: "Indoor thermal pool" },
    season: { tr: "Dört mevsim", en: "All year" },
    line: { tr: "Yıl boyu açık, kapalı alanda termal havuz.", en: "An indoor thermal pool, open all year." },
  },
  {
    id: "acik",
    tone: "open",
    name: { tr: "Açık havuz", en: "Outdoor pool" },
    season: { tr: "Yaz aylarında", en: "In summer" },
    line: { tr: "Yaz aylarında açık havada yüzme.", en: "Open-air swimming in the summer months." },
  },
  {
    id: "cocuk",
    tone: "small",
    name: { tr: "Çocuk havuzu", en: "Children's pool" },
    season: { tr: "Sezon bilgisi alınacak", en: "Season to be confirmed" },
    line: { tr: "Küçük misafirler için ayrı havuz.", en: "A separate pool for younger guests." },
  },
  {
    id: "sauna-buhar",
    tone: "steam",
    name: { tr: "Sauna ve buhar odası", en: "Sauna and steam room" },
    season: { tr: "SPA bölümünde", en: "In the spa" },
    line: { tr: "Kuru sıcak ya da buhar; ikisi de SPA bölümünde.", en: "Dry heat or steam, both in the spa." },
  },
];

/** Spa list (54 §6.3). Gym and walking paths are shown only on the spa page, labelled. */
export const facilities: Facility[] = [
  {
    id: "hamam",
    name: { tr: "Türk hamamı", en: "Turkish bath" },
    line: { tr: "Kadın ve erkek için ayrı kullanım.", en: "Separate use for women and men." },
  },
  { id: "sauna", name: { tr: "Sauna", en: "Sauna" }, line: null },
  { id: "buhar", name: { tr: "Buhar odası", en: "Steam room" }, line: null },
  { id: "tuz", name: { tr: "Tuz odası", en: "Salt room" }, line: null },
  {
    id: "masaj",
    name: { tr: "Masaj odaları", en: "Massage rooms" },
    line: { tr: "Masaj seçenekleri ve randevu için resepsiyonu arayın.", en: "Call reception for massage options and appointments." },
  },
];

/** Women / men / mixed sessions (RCI/AFVC; own site: separate hamam use). Hours unknown: no table until supplied. */
export const sessions = {
  kinds: [
    { id: "kadin", label: { tr: "Kadın", en: "Women" } },
    { id: "erkek", label: { tr: "Erkek", en: "Men" } },
    { id: "karma", label: { tr: "Karma", en: "Mixed" } },
  ],
  /** Fill with rows like { day, women, men, mixed } once the owner supplies hours; a real <table> renders then. */
  hours: null as null | { day: L; times: [string, string, string] }[],
};
