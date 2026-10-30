import { routes, type Locale, type PageKey } from "@/content/routes";
import { t } from "@/content";
import { CREDIT_TEXT, IS_DEMO, SHOW_CREDIT, site } from "@/content/site";
import { phoneText, telLink } from "@/lib/contact";
import { Rich, Wordmark } from "./ui";
import { LiteToggle } from "./LiteToggle";

export function Footer({ locale }: { locale: Locale }) {
  const c = t(locale).common;
  const pages: PageKey[] = ["home", "rooms", "spa", "contact"];
  const label: Record<PageKey, string> = { home: c.home, rooms: c.nav.rooms, spa: c.nav.spa, contact: c.nav.contact };
  return (
    <footer className="tp-footer tp-dark">
      <div className="tp-wrap tp-footer-grid">
        <div className="tp-footer-brand">
          <Wordmark line={c.footer.tagline} className="tp-mark-light" />
        </div>

        <div>
          <h2 className="tp-footer-h">{c.footer.contact}</h2>
          <address className="tp-footer-address">
            {c.addressLines.map((l) => (
              <span key={l}>
                <Rich text={l} locale={locale} />
              </span>
            ))}
          </address>
          <a href={telLink} className="tp-footer-link">
            {c.phone}: {phoneText(locale)}
          </a>
          {site.email ? (
            <a href={`mailto:${site.email}`} className="tp-footer-link">
              {site.email}
            </a>
          ) : null}
        </div>

        <nav aria-labelledby="tp-footer-pages">
          <h2 id="tp-footer-pages" className="tp-footer-h">
            {c.footer.pages}
          </h2>
          <ul className="tp-footer-list">
            {pages.map((p) => (
              <li key={p}>
                <a href={routes[locale][p]} className="tp-footer-link">
                  {label[p]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="tp-wrap tp-footer-base">
        {site.legalName && site.licenceNo ? (
          <p>
            {site.legalName} · {site.licenceNo}
          </p>
        ) : IS_DEMO ? (
          <p className="tp-footer-legal">
            <Rich text={c.footer.legal} locale={locale} />
          </p>
        ) : null}
        <p>
          © {new Date().getFullYear()} {c.footer.rights}
        </p>
        {IS_DEMO ? <p className="tp-footer-demo">{c.footer.demo}</p> : null}
        <p className="tp-footer-osm">{c.footer.osm}</p>
        <LiteToggle label={c.footer.liteMode} on={c.footer.liteOn} off={c.footer.liteOff} />
        {SHOW_CREDIT ? <p className="tp-footer-credit">{CREDIT_TEXT}</p> : null}
      </div>
    </footer>
  );
}
