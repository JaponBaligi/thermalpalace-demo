import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { site } from "@/content/site";
import { phoneText, telLink } from "@/lib/contact";
import { MapBlock } from "../MapBlock";
import { NewTab, PhoneIcon, PinIcon, Rich, Ridges, WhatsAppPending } from "../ui";
import { PageHero } from "./PageHero";

export function ContactPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  const p = c.contactPage;
  return (
    <>
      <PageHero title={p.h1} lead={p.lead} />

      <section className="tp-section tp-paper" aria-labelledby="tp-details-h">
        <div className="tp-wrap tp-contact-grid">
          <div className="tp-reveal">
            <h2 id="tp-details-h" className="tp-h2">
              {p.detailsHeading}
            </h2>
            <dl className="tp-dl">
              <div>
                <dt>{c.common.address}</dt>
                <dd>
                  <address>
                    {c.common.addressLines.map((l) => (
                      <span key={l}>
                        <Rich text={l} locale={locale} />
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div>
                <dt>{c.common.phone}</dt>
                <dd>
                  <a href={telLink} className="tp-dl-phone">
                    {phoneText(locale)}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{p.whatsappLabel}</dt>
                <dd>
                  <WhatsAppPending locale={locale} />
                </dd>
              </div>
              <div>
                <dt>{p.receptionLabel}</dt>
                <dd>
                  <Rich text={p.reception} locale={locale} />
                </dd>
              </div>
            </dl>
            <div className="tp-btn-row">
              <a href={telLink} className="tp-btn tp-btn-copper">
                <PhoneIcon />
                <span>{c.common.call}</span>
              </a>
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-outline">
                <PinIcon />
                <span>{c.common.directions}</span>
                <NewTab label={c.common.newTab} />
              </a>
            </div>
          </div>

          <div className="tp-reveal">
            <h2 className="tp-h2">{p.gettingHeading}</h2>
            <ul className="tp-getting">
              <li>{p.getting}</li>
              <li>
                <Rich text={p.distance} locale={locale} />
              </li>
              <li>
                <Rich text={p.transit} locale={locale} />
              </li>
              <li>{p.parking}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="tp-scene tp-dusk tp-dusk-map" data-scene="5" aria-labelledby="tp-map-h">
        <div className="tp-wrap">
          <h2 id="tp-map-h" className="tp-h2 tp-reveal">
            {p.mapHeading}
          </h2>
          <div className="tp-reveal">
            <MapBlock alt={p.mapAlt} label={p.mapLabel} locale={locale} className="tp-map-wide" />
          </div>
        </div>
        <Ridges />
      </section>

      <section className="tp-scene tp-copper tp-dark" data-scene="6" aria-labelledby="tp-booking-h">
        <div className="tp-halo" aria-hidden="true" />
        <div className="tp-wrap tp-copper-inner">
          <h2 id="tp-booking-h" className="tp-display tp-copper-title tp-copper-title-sm">
            {p.bookingHeading}
          </h2>
          <a href={telLink} className="tp-copper-phone">
            {phoneText(locale)}
          </a>
          <p className="tp-copper-text">{p.booking}</p>
          <div className="tp-btn-row tp-btn-row-center">
            <a href={telLink} className="tp-btn tp-btn-cream">
              <PhoneIcon />
              <span>{c.common.call}</span>
            </a>
            <WhatsAppPending locale={locale} className="tp-on-dark" />
          </div>
        </div>
      </section>
    </>
  );
}
