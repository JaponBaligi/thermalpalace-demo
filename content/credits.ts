import type { Locale } from "./routes";

export const creditsPath: Record<Locale, string> = { tr: "/gorsel-kaynaklari/", en: "/en/image-credits/" };

const SOURCE = "https://commons.wikimedia.org/wiki/File:Termal_orman%C4%B1_-_panoramio.jpg";
const LICENSE = "https://creativecommons.org/licenses/by-sa/3.0/";

/** Third-party images used on the site. Verified on the Commons page, 30 Oct 2026. */
export const credits = {
  tr: {
    title: "Görsel kaynakları",
    lead: "Sitede kullanılan üçüncü taraf görseller ve lisansları.",
    description: "Yalova Thermal Palace sitesinde kullanılan görsellerin kaynakları ve lisansları.",
    items: [
      {
        name: "Termal ormanı (ana sayfa, açılışın altındaki bölümün arka planı)",
        rows: [
          ["Fotoğraf", "HuSeYiN, 3 Ağustos 2007 (Panoramio üzerinden Wikimedia Commons)"],
          ["Kaynak", SOURCE],
          ["Lisans", "CC BY-SA 3.0", LICENSE],
          ["Değişiklikler", "Kırpıldı (kişi ve tarih damgası çıkarıldı), hafif bulanıklaştırıldı, renk doygunluğu azaltıldı, karartıldı, soğuk tona çekildi, yeniden boyutlandırılıp WebP biçimine dönüştürüldü. Değiştirilmiş görsel de CC BY-SA 3.0 lisansı altındadır."],
        ],
      },
    ],
  },
  en: {
    title: "Image credits",
    lead: "Third-party images used on this site and their licences.",
    description: "Sources and licences of the images used on the Yalova Thermal Palace site.",
    items: [
      {
        name: "Termal forest (home page, background of the section below the opening)",
        rows: [
          ["Photo", "HuSeYiN, 3 August 2007 (Wikimedia Commons, via Panoramio)"],
          ["Source", SOURCE],
          ["Licence", "CC BY-SA 3.0", LICENSE],
          ["Modifications", "Cropped (person and date stamp removed), lightly blurred, desaturated, darkened, cool-toned, resized and converted to WebP. The modified image is also licensed under CC BY-SA 3.0."],
        ],
      },
    ],
  },
} as const;
