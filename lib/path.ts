import { routes, type Locale, type PageKey } from "@/content/routes";

export function pageFromPath(locale: Locale, pathname: string): PageKey {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const entry = (Object.entries(routes[locale]) as [PageKey, string][]).find(([, p]) => p === path);
  return entry ? entry[0] : "home";
}
