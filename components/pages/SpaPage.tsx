import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { telLink } from "@/lib/contact";
import { ContactStrip } from "../ContactStrip";
import { FacilityList, PoolCards, Sessions } from "../sections";
import { PhoneIcon, Rich, WhatsAppPending } from "../ui";
import { SpaWater } from "../SpaWater";
import { SpaDuo } from "../SpaDuo";
import { PageHero } from "./PageHero";
import { PoolsShowcase } from "../PoolsShowcase";
import { pools } from "@/content/spa";

export function SpaPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  const p = c.spaPage;
  return (
    <>
      <PageHero title={p.h1} lead={p.lead} />

      <section className="tp-scene tp-pools-scene tp-dark" data-scene="2" aria-labelledby="tp-pools-h">
        <div className="tp-rays" aria-hidden="true" />
        <PoolsShowcase ids={pools.map((x) => x.id)} names={pools.map((x) => x.name[locale])}>
          <div className="tp-wrap">
            <div className="tp-scene-head tp-pools-head tp-reveal">
              <h2 id="tp-pools-h" className="tp-h2 tp-h2-xl">
                {p.poolsHeading}
              </h2>
              <p className="tp-h2 tp-h2-xl tp-pools-fly" aria-hidden="true" />
            </div>
            <PoolCards locale={locale} interactive />
            <p className="tp-scene-ph tp-scene-link tp-reveal">
              <Rich text={p.poolsRules} locale={locale} />
            </p>
          </div>
        </PoolsShowcase>
      </section>

      <section className="tp-scene tp-spa-scene tp-spa-rise tp-dark" data-scene="3" aria-labelledby="tp-spa-h">
        <SpaWater />
        <div className="tp-wrap tp-spa-grid">
          <div className="tp-reveal">
            <h2 id="tp-spa-h" className="tp-h2 tp-h2-xl">
              {p.spaHeading}
            </h2>
            <FacilityList locale={locale} />
            <p className="tp-scene-ph">
              <Rich text={p.massage} locale={locale} />
            </p>
            <p className="tp-spa-extra">
              <Rich text={p.gym} locale={locale} />
            </p>
          </div>
          <div className="tp-reveal">
            <h2 className="sr-only">{p.sessionsHeading}</h2>
            <Sessions locale={locale} headingId="tp-spa-sessions" />
          </div>
        </div>
      </section>

      <section className="tp-section tp-duo-section" aria-labelledby="tp-duo-h">
        <div className="tp-reveal">
          <SpaDuo
            title={p.duoTitle}
            water={
              <>
                <h3 className="tp-h2">{p.waterHeading}</h3>
                <p>
                  <Rich text={p.water} locale={locale} />
                </p>
              </>
            }
            forest={
              <>
                <h3 className="tp-h2">{p.walkHeading}</h3>
                <p>
                  <Rich text={p.walk} locale={locale} />
                </p>
              </>
            }
          />
        </div>
        <div className="tp-wrap">
          <p className="tp-note tp-reveal">{p.note}</p>
          <div className="tp-btn-row tp-reveal">
            <a href={telLink} className="tp-btn tp-btn-copper">
              <PhoneIcon />
              <span>{c.common.call}</span>
            </a>
            <WhatsAppPending locale={locale} />
          </div>
        </div>
      </section>

      <ContactStrip locale={locale} />
    </>
  );
}
