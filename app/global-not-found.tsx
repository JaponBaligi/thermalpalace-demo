import type { Metadata } from "next";
import Link from "next/link";
import { fontVars } from "@/lib/fonts";
import { htmlLang, locales, routes, type Locale } from "@/content/routes";
import { content } from "@/content";
import { site } from "@/content/site";
import { WaterLine, Wordmark } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found | Yalova Thermal Palace",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={fontVars}>
      <body className="tp-404">
        <main className="tp-wrap tp-narrow tp-404-main">
          <Link href="/" className="tp-home-link">
            <Wordmark line="Akköy · Termal" />
          </Link>
          <WaterLine className="tp-404-line" />
          <h1 className="tp-display tp-404-title">
            Sayfa bulunamadı
            <span lang="en" className="tp-404-en">
              Page not found
            </span>
          </h1>
          <ul className="tp-404-links">
            {locales.map((l: Locale) => {
              const c = content[l];
              return (
                <li key={l} lang={htmlLang[l]}>
                  <p>{c.notFound.title}</p>
                  <p className="tp-404-row">
                    <a href={routes[l].home} className="tp-link">
                      {c.common.home}
                    </a>
                    <a href={routes[l].rooms} className="tp-link">
                      {c.common.nav.rooms}
                    </a>
                    <a href={routes[l].spa} className="tp-link">
                      {c.common.nav.spa}
                    </a>
                    <a href={routes[l].contact} className="tp-link">
                      {c.common.nav.contact}
                    </a>
                    <a href={`tel:${site.phoneTel}`} className="tp-link">
                      {c.common.call}: {l === "tr" ? site.phoneDisplay : site.phoneDisplayIntl}
                    </a>
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="tp-note">{content.tr.common.footer.demo}</p>
        </main>
      </body>
    </html>
  );
}
