import { creditsPath } from "@/content/credits";
import { routes, type Locale, type PageKey } from "@/content/routes";

/** Pages outside the nav: their path in every locale. */
const extraPages: Record<Locale, string>[] = [creditsPath];

const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

/** Counterpart paths of a non-nav page, or undefined for nav pages. */
export function extraPage(pathname: string): Record<Locale, string> | undefined {
  const path = withSlash(pathname);
  return extraPages.find((m) => Object.values(m).includes(path));
}

export function pageFromPath(locale: Locale, pathname: string): PageKey {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const entry = (Object.entries(routes[locale]) as [PageKey, string][]).find(([, p]) => p === path);
  return entry ? entry[0] : "home";
}

/** Nav page for the current path; null on pages outside the nav (nothing is marked current). */
export function navPage(locale: Locale, pathname: string): PageKey | null {
  return extraPage(pathname) ? null : pageFromPath(locale, pathname);
}
