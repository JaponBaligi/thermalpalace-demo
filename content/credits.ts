import type { Locale } from "./routes";

export const creditsPath: Record<Locale, string> = { tr: "/gorsel-kaynaklari/", en: "/en/image-credits/" };

const VIDEO_SOURCE = "https://www.pexels.com/video/close-up-on-ripple-on-water-surface-at-night-10557668/";
const VIDEO_LICENSE = "https://www.pexels.com/license/";

/** Third-party images and footage used on the site. Verified on the Pexels page, 30 Oct 2026. */
export const credits = {
  tr: {
    title: "Görsel kaynakları",
    lead: "Sitede kullanılan üçüncü taraf görseller ve lisansları.",
    description: "Yalova Thermal Palace sitesinde kullanılan görsellerin kaynakları ve lisansları.",
    items: [
      {
        name: "Gece su yüzeyi (ana sayfa açılış videosu)",
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
    lead: "Third-party images used on this site and their licences.",
    description: "Sources and licences of the images used on the Yalova Thermal Palace site.",
    items: [
      {
        name: "Night water surface (home page opening video)",
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
