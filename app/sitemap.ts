import type { MetadataRoute } from "next";
import { htmlLang, locales, pageKeys, routes } from "@/content/routes";
import { SITE_URL } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    pageKeys.map((page) => ({
      url: `${SITE_URL}${routes[locale][page]}`,
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [htmlLang[l], `${SITE_URL}${routes[l][page]}`])),
          "x-default": `${SITE_URL}${routes.tr[page]}`,
        },
      },
    })),
  );
}
