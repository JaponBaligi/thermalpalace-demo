import type { Locale } from "./routes";

export const creditsPath: Record<Locale, string> = { tr: "/gorsel-kaynaklari/", en: "/en/image-credits/" };

const SOURCE = "https://commons.wikimedia.org/wiki/File:Termal_orman%C4%B1_-_panoramio.jpg";
const LICENSE = "https://creativecommons.org/licenses/by-sa/3.0/";
const VIDEO_SOURCE = "https://www.pexels.com/video/close-up-on-ripple-on-water-surface-at-night-10557668/";
const VIDEO_LICENSE = "https://www.pexels.com/license/";

/** Third-party images and footage used on the site. Verified on the Commons and Pexels pages, 30 Oct 2026. */
export const credits = {
  tr: {
    title: "Görsel kaynakları",
    lead: "Sitede kullanılan üçüncü taraf görseller, video ve lisansları.",
    description: "Yalova Thermal Palace sitesinde kullanılan görsellerin kaynakları ve lisansları.",
    items: [
      {
        name: "Termal ormanı (ana sayfa açılış görseli)",
        rows: [
          ["Fotoğraf", "HuSeYiN, 3 Ağustos 2007 (Panoramio üzerinden Wikimedia Commons)"],
          ["Kaynak", SOURCE],
          ["Lisans", "CC BY-SA 3.0", LICENSE],
          ["Değişiklikler", "Kırpıldı (kişi ve tarih damgası çıkarıldı), hafif bulanıklaştırıldı, renk doygunluğu azaltıldı, karartıldı, soğuk tona çekildi, yeniden boyutlandırılıp WebP biçimine dönüştürüldü. Değiştirilmiş görsel de CC BY-SA 3.0 lisansı altındadır."],
        ],
      },
      {
        name: "Gece su yüzeyi (ana sayfa, açılışın altındaki su arka planı)",
        rows: [
          ["Video", "Şaban Karabeli, “Close up on Ripple on Water Surface at Night” (Pexels)"],
          ["Kaynak", VIDEO_SOURCE],
          ["Lisans", "Pexels Lisansı", VIDEO_LICENSE],
          ["Değişiklikler", "10 saniyelik kesintisiz döngüye kırpıldı, renk doygunluğu azaltıldı, soğuk tona çekildi, hafif bulanıklaştırıldı, yeniden boyutlandırılıp AV1/WebM ve H.264/MP4 biçimlerine dönüştürüldü."],
        ],
      },
    ],
  },
  en: {
    title: "Image credits",
    lead: "Third-party images and footage used on this site and their licences.",
    description: "Sources and licences of the images used on the Yalova Thermal Palace site.",
    items: [
      {
        name: "Termal forest (home page opening image)",
        rows: [
          ["Photo", "HuSeYiN, 3 August 2007 (Wikimedia Commons, via Panoramio)"],
          ["Source", SOURCE],
          ["Licence", "CC BY-SA 3.0", LICENSE],
          ["Modifications", "Cropped (person and date stamp removed), lightly blurred, desaturated, darkened, cool-toned, resized and converted to WebP. The modified image is also licensed under CC BY-SA 3.0."],
        ],
      },
      {
        name: "Night water surface (home page, water background below the opening)",
        rows: [
          ["Video", "Şaban Karabeli, “Close up on Ripple on Water Surface at Night” (Pexels)"],
          ["Source", VIDEO_SOURCE],
          ["Licence", "Pexels License", VIDEO_LICENSE],
          ["Modifications", "Trimmed into a seamless 10-second loop, desaturated, cool-toned, lightly blurred, resized and converted to AV1/WebM and H.264/MP4."],
        ],
      },
    ],
  },
} as const;
