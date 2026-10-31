import type { Metadata } from "next";
import { credits, creditsPath } from "@/content/credits";
import { htmlLang, locales, type Locale } from "@/content/routes";
import { IS_DEMO, SITE_URL, site } from "@/content/site";
import { PageHero } from "./PageHero";

export function creditsMetadata(locale: Locale): Metadata {
  const c = credits[locale];
  return {
    title: `${c.title} · ${site.name}`,
    description: c.description,
    metadataBase: new URL(SITE_URL),
    robots: IS_DEMO ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: creditsPath[locale],
      languages: { ...Object.fromEntries(locales.map((l) => [htmlLang[l], creditsPath[l]])), "x-default": creditsPath.tr },
    },
  };
}

export function CreditsPage({ locale }: { locale: Locale }) {
  const c = credits[locale];
  return (
    <>
      <PageHero title={c.title} lead={c.lead} />
      <section className="tp-scene" aria-label={c.title}>
        <div className="tp-wrap">
          {c.items.map((item) => (
            <article key={item.name}>
              <h2 className="tp-h2">{item.name}</h2>
              <dl className="tp-credits">
                {item.rows.map(([k, v, href]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer license">
                          {v}
                        </a>
                      ) : v.startsWith("https://") ? (
                        <a href={v} target="_blank" rel="noopener noreferrer">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
