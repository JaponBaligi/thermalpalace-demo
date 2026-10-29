import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { unitFeatures, units } from "@/content/units";
import { facilities, pools, sessions } from "@/content/spa";
import { telLink } from "@/lib/contact";
import { delay, PhoneIcon, Rich, UnitGlyph, Verify, WaterPlate } from "./ui";

/** Pool "plates": one card per pool, procedural art on top. P3 pins these horizontally on desktop. */
export function PoolCards({ locale, headingLevel = 3 }: { locale: Locale; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="tp-pools" data-webgl-cards="pools">
      {pools.map((p, i) => (
        <li key={p.id} className="tp-pool tp-reveal" style={delay(i * 90)}>
          <WaterPlate id={p.id} tone={p.tone} />
          <div className="tp-pool-body">
            <p className="tp-pool-season">{p.season[locale]}</p>
            <H className="tp-h3">
              {p.name[locale]}
              {p.verify ? (
                <>
                  {" "}
                  <Verify locale={locale} />
                </>
              ) : null}
            </H>
            {p.line ? <p className="tp-pool-line">{p.line[locale]}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Spa facilities as a ruled list with one line each. */
export function FacilityList({ locale, headingLevel = 3 }: { locale: Locale; headingLevel?: 3 | 4 }) {
  const H = headingLevel === 3 ? "h3" : "h4";
  return (
    <ul className="tp-facilities">
      {facilities.map((f, i) => (
        <li key={f.id} className="tp-facility tp-reveal" style={delay(i * 70)}>
          <span className="tp-facility-index" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <H className="tp-facility-name">
            {f.name[locale]}
            {f.verify ? (
              <>
                {" "}
                <Verify locale={locale} />
              </>
            ) : null}
          </H>
          {f.line ? <p className="tp-facility-line">{f.line[locale]}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Women / men / mixed. A real <table> renders once hours exist in content/spa.ts; until then a call CTA. */
export function Sessions({ locale, headingId }: { locale: Locale; headingId: string }) {
  const c = t(locale).home.spa;
  return (
    <div className="tp-sessions">
      <h3 id={headingId} className="tp-sessions-h">
        <Rich text={c.sessionsHeading} locale={locale} />
      </h3>
      <p className="tp-sessions-kinds" aria-hidden="true">
        {sessions.kinds.map((k, i) => (
          <span key={k.id}>
            {i > 0 ? <span className="tp-sessions-dot">·</span> : null}
            {k.label[locale]}
          </span>
        ))}
      </p>
      {sessions.hours ? (
        <table className="tp-table" aria-labelledby={headingId}>
          <thead>
            <tr>
              <th scope="col">{locale === "tr" ? "Gün" : "Day"}</th>
              {sessions.kinds.map((k) => (
                <th scope="col" key={k.id}>
                  {k.label[locale]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.hours.map((row) => (
              <tr key={row.day.tr}>
                <th scope="row">{row.day[locale]}</th>
                {row.times.map((time, i) => (
                  <td key={i}>{time}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <p className="tp-sessions-text">{c.sessionsText}</p>
          <a href={telLink} className="tp-btn tp-btn-cream">
            <PhoneIcon />
            <span>{c.sessionsCta}</span>
          </a>
        </>
      )}
    </div>
  );
}

/** Three unit cards with the abstract glyph (P3 draws the strokes on scroll). */
export function UnitCards({ locale, headingLevel = 3, withCta = false }: { locale: Locale; headingLevel?: 2 | 3; withCta?: boolean }) {
  const u = t(locale).units;
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="tp-units">
      {units.map((unit, i) => (
        <li key={unit.id} id={unit.id} className="tp-unit tp-reveal" style={delay(i * 110)}>
          <div className="tp-unit-art">
            <UnitGlyph guests={unit.guests} levels={unit.levels} hamam={unit.hamam} label={u.glyph(unit.guests, unit.levels === 2)} />
          </div>
          <div className="tp-unit-body">
            <p className="tp-unit-meta">
              <span className="tp-unit-code" title={u.codeNote}>
                <span className="sr-only">{u.codeNote}: </span>
                {unit.code}
              </span>
              <span>{u.guests(unit.guests)}</span>
            </p>
            <H className="tp-h3">
              {unit.name[locale]}
              {unit.verify ? (
                <>
                  {" "}
                  <Verify locale={locale} />
                </>
              ) : null}
            </H>
            <p className="tp-unit-line">{unit.line[locale]}</p>
            <ul className="tp-unit-tags">
              {unit.levels === 2 ? <li>{u.duplex}</li> : null}
              <li>{u.kitchen}</li>
              {unit.hamam ? <li>{u.hamam}</li> : null}
            </ul>
            {withCta ? (
              <a href={telLink} className="tp-btn tp-btn-copper tp-unit-cta">
                <PhoneIcon />
                <span>{u.cta}</span>
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Comparison as a real table; on narrow screens each row becomes a block (CSS). */
export function UnitTable({ locale, captionVisible = false }: { locale: Locale; captionVisible?: boolean }) {
  const u = t(locale).units;
  return (
    <div className="tp-table-wrap">
      <table className="tp-table tp-table-units">
        <caption className={captionVisible ? "tp-caption" : "sr-only"}>{u.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{u.cols.type}</th>
            <th scope="col">{u.cols.guests}</th>
            <th scope="col">{u.cols.layout}</th>
            <th scope="col">{u.cols.kitchen}</th>
            <th scope="col">{u.cols.hamam}</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <th scope="row">
                {unit.name[locale]} <span className="tp-table-code">({unit.code})</span>
                {unit.verify ? (
                  <>
                    {" "}
                    <Verify locale={locale} />
                  </>
                ) : null}
              </th>
              <td data-label={u.cols.guests}>{unit.guests}</td>
              <td data-label={u.cols.layout}>{unit.layout[locale]}</td>
              <td data-label={u.cols.kitchen}>{u.yes}</td>
              <td data-label={u.cols.hamam}>{unit.hamam ? u.yes : u.no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UnitFeatures({ locale }: { locale: Locale }) {
  return (
    <ul className="tp-features">
      {unitFeatures.map((f) => (
        <li key={f.id}>{f.label[locale]}</li>
      ))}
    </ul>
  );
}
