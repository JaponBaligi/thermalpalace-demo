import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { site } from "@/content/site";
import { telLink } from "@/lib/contact";
import { ContactStrip } from "../ContactStrip";
import { UnitCards, UnitFeatures, UnitTable } from "../sections";
import { NewTab, PhoneIcon, PinIcon, Rich, WhatsAppPending } from "../ui";
import { PageHero } from "./PageHero";

export function RoomsPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  const p = c.roomsPage;
  return (
    <>
      <PageHero kicker={p.kicker} title={p.h1} lead={p.lead}>
        <div className="tp-btn-row">
          <a href={telLink} className="tp-btn tp-btn-copper">
            <PhoneIcon />
            <span>{c.units.cta}</span>
          </a>
        </div>
      </PageHero>

      <section className="tp-scene tp-rooms-scene tp-rooms-plain" data-scene="4" aria-labelledby="tp-types-h">
        <div className="tp-wrap">
          <h2 id="tp-types-h" className="tp-h2 tp-reveal">
            {p.typesHeading}
          </h2>
          <UnitCards locale={locale} withCta />
        </div>
      </section>

      <section className="tp-section tp-paper" aria-labelledby="tp-compare-h">
        <div className="tp-wrap tp-two-col">
          <div className="tp-reveal">
            <h2 id="tp-compare-h" className="tp-h2">
              {p.compareHeading}
            </h2>
            <UnitTable locale={locale} />
          </div>
          <div className="tp-reveal">
            <h2 className="tp-h2">{c.units.featuresHeading}</h2>
            <UnitFeatures locale={locale} />
          </div>
        </div>
      </section>

      <section className="tp-section" aria-labelledby="tp-stay-h">
        <div className="tp-wrap tp-narrow">
          <h2 id="tp-stay-h" className="tp-h2 tp-reveal">
            {p.stayHeading}
          </h2>
          <p className="tp-reveal">
            <Rich text={p.stay} locale={locale} />
          </p>
          <p className="tp-note tp-reveal">{p.note}</p>
          <div className="tp-btn-row tp-reveal">
            <a href={telLink} className="tp-btn tp-btn-copper">
              <PhoneIcon />
              <span>{c.common.call}</span>
            </a>
            <WhatsAppPending locale={locale} />
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-outline">
              <PinIcon />
              <span>{c.common.directionsShort}</span>
              <NewTab label={c.common.newTab} />
            </a>
          </div>
        </div>
      </section>

      <ContactStrip locale={locale} />
    </>
  );
}
