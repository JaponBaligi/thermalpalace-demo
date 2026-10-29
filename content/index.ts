import type { Locale } from "./routes";
import { tr } from "./tr";
import { en } from "./en";

export type SiteContent = typeof tr;

export const content: Record<Locale, SiteContent> = { tr, en };

export function t(locale: Locale): SiteContent {
  return content[locale];
}
