"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { htmlLang, localeLabel, localeName, locales, routes, type Locale } from "@/content/routes";
import { pageFromPath } from "@/lib/path";

export function LangSwitcher({
  locale,
  label,
  className = "",
  onNavigate,
}: {
  locale: Locale;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const page = pageFromPath(locale, pathname);

  function go(e: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (window.location.hash) {
      e.preventDefault();
      window.location.assign(e.currentTarget.getAttribute("href") ?? "/");
    }
  }

  return (
    <nav aria-label={label} className={`tp-lang ${className}`}>
      <ul>
        {locales.map((l) => (
          <li key={l}>
            <a
              href={routes[l][page]}
              hrefLang={htmlLang[l]}
              lang={htmlLang[l]}
              onClick={go}
              aria-current={l === locale ? "true" : undefined}
            >
              {localeLabel[l]}
              <span className="sr-only"> – {localeName[l]}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
