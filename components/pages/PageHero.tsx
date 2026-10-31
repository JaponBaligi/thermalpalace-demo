import type { ReactNode } from "react";
import { delay } from "../ui";

/** Sub-page opening: h1, lead. Scene 0 for the WebGL layer. */
export function PageHero({ title, lead, children }: { title: string; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className="tp-page-hero" data-scene="0" aria-labelledby="tp-page-h">
      <div className="tp-wrap tp-page-hero-inner">
        <h1 id="tp-page-h" className="tp-display tp-page-title tp-enter" style={delay(0)}>
          {title}
        </h1>
        <p className="tp-lead tp-page-lead tp-enter" style={delay(80)}>
          {lead}
        </p>
        {children ? (
          <div className="tp-enter" style={delay(160)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
