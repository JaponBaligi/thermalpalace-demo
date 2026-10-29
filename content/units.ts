import type { Locale } from "./routes";

type L = Record<Locale, string>;

export type Unit = {
  id: string;
  name: L;
  /** Code as the own 2025 site wrote it; "2+1" there means 2 + 1 guests, not rooms (54 D4). */
  code: string;
  guests: number;
  /** 2 = duplex. */
  levels: 1 | 2;
  hamam: boolean;
  layout: L;
  line: L;
  /** Own site 2025 only, conflicts with the group page (54 D3): labelled on the demo. */
  verify: boolean;
};

/** Own site 2025 set (57 §1, 54 D3). No sizes, no counts, no prices. */
export const units: Unit[] = [
  {
    id: "uc-kisilik",
    name: { tr: "Üç kişilik daire", en: "Apartment for three" },
    code: "2+1",
    guests: 3,
    levels: 1,
    hamam: false,
    layout: { tr: "Mutfaklı", en: "With kitchen" },
    line: { tr: "Üç kişiye kadar konaklama için mutfaklı daire.", en: "An apartment with a kitchen for up to three guests." },
    verify: true,
  },
  {
    id: "bes-kisilik-dubleks",
    name: { tr: "Beş kişilik dubleks daire", en: "Duplex apartment for five" },
    code: "4+1",
    guests: 5,
    levels: 2,
    hamam: false,
    layout: { tr: "Dubleks, mutfaklı", en: "Duplex, with kitchen" },
    line: { tr: "İki katlı, mutfaklı daire; beş kişiye kadar.", en: "A two-level apartment with a kitchen, for up to five guests." },
    verify: true,
  },
  {
    id: "yedi-kisilik-dubleks",
    name: { tr: "Yedi kişilik dubleks daire", en: "Duplex apartment for seven" },
    code: "6+1",
    guests: 7,
    levels: 2,
    hamam: true,
    layout: { tr: "Dubleks, mutfaklı, dairede Türk hamamı", en: "Duplex, kitchen, private Turkish bath" },
    line: { tr: "İki katlı, mutfaklı ve kendi Türk hamamı olan daire; yedi kişiye kadar.", en: "A two-level apartment with a kitchen and its own Turkish bath, for up to seven guests." },
    verify: true,
  },
];

/** Same list on all three type pages of the own 2025 site. */
export const unitFeatures: { id: string; label: L }[] = [
  { id: "wifi", label: { tr: "Ücretsiz Wi-Fi", en: "Free Wi-Fi" } },
  { id: "ac", label: { tr: "Klima", en: "Air conditioning" } },
  { id: "tv", label: { tr: "LED TV", en: "LED TV" } },
  { id: "fridge", label: { tr: "Mini buzdolabı", en: "Mini fridge" } },
  { id: "hob", label: { tr: "Elektrikli ocak ve fırın", en: "Electric hob and oven" } },
  { id: "dryer", label: { tr: "Saç kurutma makinesi", en: "Hair dryer" } },
  { id: "phone", label: { tr: "Direkt telefon", en: "Direct-dial telephone" } },
];
