import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { site } from "@/content/site";
import { phoneText, telLink } from "@/lib/contact";
import { NewTab, PhoneIcon, PinIcon, Rich, WaterLine, WhatsAppPending } from "./ui";

/** Above the footer on Rooms and Thermal & Spa (Home ends with its own contact scene). */
export function ContactStrip({ locale }: { locale: Locale }) {
  const c = t(locale).common;
  return (
    <section className="tp-strip tp-dark" aria-labelledby="tp-strip-h">
      <WaterLine className="tp-strip-line" />
      <div className="tp-wrap tp-strip-inner">
        <div>
          <h2 id="tp-strip-h" className="tp-h2">
            {c.strip.heading}
          </h2>
          <p className="tp-strip-text">{c.strip.text}</p>
          <address className="tp-strip-address">
            {c.addressLines.map((l) => (
              <span key={l}>
                <Rich text={l} locale={locale} />
              </span>
            ))}
          </address>
        </div>
        <div className="tp-strip-actions">
          <a href={telLink} className="tp-strip-phone">
            {phoneText(locale)}
          </a>
          <div className="tp-btn-row">
            <a href={telLink} className="tp-btn tp-btn-cream">
              <PhoneIcon />
              <span>{c.call}</span>
            </a>
            <WhatsAppPending locale={locale} className="tp-on-dark" />
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-ghost-light">
              <PinIcon />
              <span>{c.directions}</span>
              <NewTab label={c.newTab} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
