import type { ReactNode } from "react";
import { delay, Kicker } from "../ui";

/** Sub-page opening: kicker, h1, lead over a lighter steam field. Scene 0 for the WebGL layer. */
export function PageHero({ kicker, title, lead, children }: { kicker: string; title: string; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className="tp-page-hero" data-scene="0" aria-labelledby="tp-page-h">
      <div className="tp-steam tp-steam-soft" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="tp-wrap tp-page-hero-inner">
        <div className="tp-enter" style={delay(0)}>
          <Kicker>{kicker}</Kicker>
        </div>
        <h1 id="tp-page-h" className="tp-display tp-page-title tp-enter" style={delay(80)}>
          {title}
        </h1>
        <p className="tp-lead tp-page-lead tp-enter" style={delay(160)}>
          {lead}
        </p>
        {children ? (
          <div className="tp-enter" style={delay(240)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
