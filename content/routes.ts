export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export type PageKey = "home" | "rooms" | "spa" | "contact";
export const pageKeys: PageKey[] = ["home", "rooms", "spa", "contact"];

export const routes: Record<Locale, Record<PageKey, string>> = {
  tr: { home: "/", rooms: "/odalar/", spa: "/termal-spa/", contact: "/iletisim/" },
  en: { home: "/en/", rooms: "/en/rooms/", spa: "/en/thermal-spa/", contact: "/en/contact/" },
};

/** Section anchors on the home page. */
export const anchors: Record<Locale, { pools: string; rooms: string; location: string }> = {
  tr: { pools: "havuzlar", rooms: "daireler", location: "konum" },
  en: { pools: "pools", rooms: "apartments", location: "location" },
};

export const localeLabel: Record<Locale, string> = { tr: "TR", en: "EN" };
export const localeName: Record<Locale, string> = { tr: "Türkçe", en: "English" };
export const htmlLang: Record<Locale, string> = { tr: "tr", en: "en" };
export const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
