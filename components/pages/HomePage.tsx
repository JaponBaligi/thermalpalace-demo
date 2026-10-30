import { anchors, routes, type Locale } from "@/content/routes";
import { t } from "@/content";
import { site } from "@/content/site";
import { phoneText, telLink } from "@/lib/contact";
import { MapBlock } from "../MapBlock";
import { FacilityList, PoolCards, Sessions, UnitCards, UnitFeatures } from "../sections";
import { ArrowIcon, Caustics, delay, Kicker, NewTab, PhoneIcon, PinIcon, Rich, Ridges, WaterLine, WhatsAppPending } from "../ui";

export function HomePage({ locale }: { locale: Locale }) {
  const c = t(locale);
  const h = c.home;
  const r = routes[locale];
  const a = anchors[locale];
  const depth = c.depth;

  return (
    <>
      {/* S0 — steam */}
      <section className="tp-hero" data-scene="0" aria-labelledby="tp-hero-h">
        <div className="tp-hero-photo" aria-hidden="true">
          {/* static export: pre-sized WebP, no next/image optimiser */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/termal-orman-1304.webp"
            srcSet="/images/termal-orman-1000.webp 1000w, /images/termal-orman-1304.webp 1304w"
            sizes="100vw"
            width={1304}
            height={1150}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="tp-steam" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="tp-wrap tp-hero-inner">
          <p className="tp-eyebrow tp-enter" style={delay(0)}>
            {h.hero.eyebrow}
          </p>
          <h1 id="tp-hero-h" className="tp-display tp-hero-title">
            <span className="tp-hero-l1 tp-enter" style={delay(60)}>
              Yalova
            </span>{" "}
            <span className="tp-hero-l2 tp-enter" style={delay(140)}>
              Thermal
            </span>{" "}
            <span className="tp-hero-l3 tp-enter" style={delay(220)}>
              Palace
            </span>
          </h1>
          <div className="tp-hero-side">
            <p className="tp-tagline tp-enter" style={delay(320)}>
              {h.hero.tagline}
            </p>
            <p className="tp-hero-sub tp-enter" style={delay(400)}>
              {h.hero.sub}
            </p>
            <div className="tp-btn-row tp-enter" style={delay(480)}>
              <a href={telLink} className="tp-btn tp-btn-copper">
                <PhoneIcon />
                <span>{c.common.callUs}</span>
              </a>
              <a href={r.rooms} className="tp-btn tp-btn-outline">
                <span>{h.hero.ctaRooms}</span>
                <ArrowIcon />
              </a>
            </div>
          </div>
          <ul className="tp-hero-facts tp-enter" style={delay(560)} aria-label={h.hero.factsLabel}>
            {h.hero.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a href={`#${a.pools}`} className="tp-scroll-cue tp-enter" style={delay(640)}>
            <span className="tp-scroll-line" aria-hidden="true" />
            <span>{c.common.scrollCue}</span>
          </a>
        </div>
        <div className="tp-surface-edge" aria-hidden="true">
          <WaterLine />
        </div>
      </section>

      {/* S1 — surface: practical strip */}
      <section className="tp-scene tp-surface" data-scene="1" aria-labelledby="tp-s1-h">
        <div className="tp-wrap tp-surface-grid">
          <div className="tp-reveal">
            <Kicker depth={depth[1]}>{h.surface.kicker}</Kicker>
            <h2 id="tp-s1-h" className="tp-h2">
              {h.surface.heading}
            </h2>
          </div>
          <div className="tp-float-cards">
            <div className="tp-float tp-reveal" style={delay(0)}>
              <p className="tp-float-label">{c.common.address}</p>
              <address className="tp-float-value">
                {c.common.addressLines.map((l) => (
                  <span key={l}>
                    <Rich text={l} locale={locale} />
                  </span>
                ))}
              </address>
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-link">
                <PinIcon />
                <span>{c.common.directions}</span>
                <NewTab label={c.common.newTab} />
              </a>
            </div>
            <div className="tp-float tp-reveal" style={delay(90)}>
              <p className="tp-float-label">{c.common.phone}</p>
              <a href={telLink} className="tp-float-phone">
                {phoneText(locale)}
              </a>
              <p className="tp-float-note">
                <Rich text={h.surface.reception} locale={locale} />
              </p>
            </div>
            <div className="tp-float tp-float-wide tp-reveal" style={delay(180)}>
              <p className="tp-float-label">{h.surface.services}</p>
              <ul className="tp-chips">
                {h.surface.list.map((s) => (
                  <li key={s}>
                    <Rich text={s} locale={locale} />
                  </li>
                ))}
              </ul>
              <p className="tp-float-ph">
                <Rich text={h.surface.board} locale={locale} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S2 — pools, under water */}
      <section id={a.pools} className="tp-scene tp-pools-scene tp-dark" data-scene="2" aria-labelledby="tp-s2-h">
        <div className="tp-rays" aria-hidden="true" />
        <div className="tp-wrap">
          <div className="tp-scene-head tp-reveal">
            <Kicker depth={depth[2]}>{h.pools.kicker}</Kicker>
            <h2 id="tp-s2-h" className="tp-h2 tp-h2-xl">
              {h.pools.heading}
            </h2>
            <p className="tp-lead">{h.pools.text}</p>
          </div>
          <PoolCards locale={locale} />
          <p className="tp-scene-link tp-reveal">
            <a href={r.spa} className="tp-link tp-link-light">
              <span>{h.pools.link}</span>
              <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* S3 — spa, light through water */}
      <section className="tp-scene tp-spa-scene tp-dark" data-scene="3" aria-labelledby="tp-s3-h">
        <Caustics />
        <div className="tp-wrap tp-spa-grid">
          <div className="tp-reveal">
            <Kicker depth={depth[3]}>{h.spa.kicker}</Kicker>
            <h2 id="tp-s3-h" className="tp-h2 tp-h2-xl">
              {h.spa.heading}
            </h2>
            <p className="tp-lead">
              <Rich text={h.spa.text} locale={locale} />
            </p>
            <FacilityList locale={locale} />
          </div>
          <div className="tp-reveal" style={delay(120)}>
            <Sessions locale={locale} headingId="tp-s3-sessions" />
          </div>
        </div>
      </section>

      {/* S4 — rooms, still water */}
      <section id={a.rooms} className="tp-scene tp-rooms-scene" data-scene="4" aria-labelledby="tp-s4-h">
        <div className="tp-mirror" aria-hidden="true" />
        <div className="tp-wrap">
          <div className="tp-scene-head tp-reveal">
            <Kicker depth={depth[4]}>{h.rooms.kicker}</Kicker>
            <h2 id="tp-s4-h" className="tp-h2 tp-h2-xl">
              {h.rooms.heading}
            </h2>
            <p className="tp-lead">{h.rooms.text}</p>
          </div>
          <UnitCards locale={locale} />
          <div className="tp-features-band tp-reveal">
            <h3 className="tp-h3">{c.units.featuresHeading}</h3>
            <UnitFeatures locale={locale} />
          </div>
          <p className="tp-scene-link tp-reveal">
            <a href={r.rooms} className="tp-link">
              <span>{h.rooms.link}</span>
              <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* S5 — surfacing at dusk */}
      <section id={a.location} className="tp-scene tp-dusk" data-scene="5" aria-labelledby="tp-s5-h">
        <div className="tp-wrap tp-dusk-grid">
          <div className="tp-reveal">
            <Kicker depth={depth[5]}>{h.location.kicker}</Kicker>
            <h2 id="tp-s5-h" className="tp-h2 tp-h2-xl">
              {h.location.heading}
            </h2>
            <p className="tp-lead">{h.location.text}</p>
            <ul className="tp-dusk-facts">
              <li>
                <Rich text={h.location.distance} locale={locale} />
              </li>
              <li>
                <Rich text={h.location.since} locale={locale} />
              </li>
            </ul>
            <div className="tp-btn-row">
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-petrol">
                <PinIcon />
                <span>{c.common.directions}</span>
                <NewTab label={c.common.newTab} />
              </a>
              <a href={r.contact} className="tp-btn tp-btn-outline">
                <span>{h.location.link}</span>
                <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="tp-reveal" style={delay(120)}>
            <MapBlock alt={c.contactPage.mapAlt} label={c.contactPage.mapLabel} />
          </div>
        </div>
        <Ridges />
      </section>

      {/* S6 — warm copper light */}
      <section className="tp-scene tp-copper tp-dark" data-scene="6" aria-labelledby="tp-s6-h">
        <div className="tp-halo" aria-hidden="true" />
        <div className="tp-wrap tp-copper-inner">
          <Kicker depth={depth[6]}>{h.contact.kicker}</Kicker>
          <h2 id="tp-s6-h" className="tp-display tp-copper-title">
            {h.contact.heading}
          </h2>
          <a href={telLink} className="tp-copper-phone">
            {phoneText(locale)}
          </a>
          <p className="tp-copper-text">{h.contact.text}</p>
          <div className="tp-btn-row tp-btn-row-center">
            <a href={telLink} className="tp-btn tp-btn-cream">
              <PhoneIcon />
              <span>{c.common.call}</span>
            </a>
            <WhatsAppPending locale={locale} className="tp-on-dark" />
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-ghost-light">
              <PinIcon />
              <span>{c.common.directions}</span>
              <NewTab label={c.common.newTab} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
