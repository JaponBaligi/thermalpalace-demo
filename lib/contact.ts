import { site } from "@/content/site";
import type { Locale } from "@/content/routes";

export const telLink = `tel:${site.phoneTel}`;

export function phoneText(locale: Locale) {
  return locale === "tr" ? site.phoneDisplay : site.phoneDisplayIntl;
}
