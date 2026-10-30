import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { htmlLang, locales, ogLocale, routes, type Locale, type PageKey } from "@/content/routes";
import { t } from "@/content";
import { EDITION, IS_DEMO, SITE_URL, site } from "@/content/site";
import { fontVars } from "@/lib/fonts";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";
import { MotionController } from "./MotionController";
import { IntroOverlay } from "./IntroOverlay";
import { WebGLStage } from "./webgl/WebGLStage";
import "@/app/globals.css";

// Runs before the intro markup is parsed: LITE quality default, motion start states, and the intro once per session (key thermalpalace-intro).
const bootScript = `(function(){var d=document.documentElement;d.setAttribute("data-quality","lite");try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-motion");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("js-motion")},4000);if(sessionStorage.getItem("thermalpalace-intro")){d.classList.add("intro-seen");return}sessionStorage.setItem("thermalpalace-intro","1");d.classList.add("intro-on");var ev=["pointerdown","keydown","wheel","touchstart"],done=function(){d.classList.add("intro-done");ev.forEach(function(e){removeEventListener(e,done)})};ev.forEach(function(e){addEventListener(e,done,{passive:true})});setTimeout(done,3300)}catch(e){}})();`;

export const shellViewport: Viewport = { themeColor: "#14171a" };

export function LocaleShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const c = t(locale);
  return (
    <html lang={htmlLang[locale]} className={fontVars} data-edition={EDITION} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <IntroOverlay name={c.intro.name} line={c.intro.line} />
        <a href="#icerik" className="tp-skip">
          {c.common.skip}
        </a>
        <WebGLStage />
        <Header locale={locale} c={c.common} />
        <main id="icerik" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <StickyBar c={c.common} />
        <MotionController />
        <HotelJsonLd />
      </body>
    </html>
  );
}

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const m = t(locale).meta;
  const title = m.titles[page];
  return {
    title,
    description: m.descriptions[page],
    metadataBase: new URL(SITE_URL),
    robots: IS_DEMO ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: m.descriptions[page],
      url: routes[locale][page],
      siteName: site.name,
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: "/og.webp", width: 1200, height: 630, alt: m.ogAlt, type: "image/webp" }],
    },
    alternates: {
      canonical: routes[locale][page],
      languages: {
        ...Object.fromEntries(locales.map((l) => [htmlLang[l], routes[l][page]])),
        "x-default": routes.tr[page],
      },
    },
  };
}

/** Verified facts only (57 §5): no rating, review, star rating, price range, room count or founding date. */
function HotelJsonLd() {
  const a = site.address;
  const amenity = (name: string) => ({ "@type": "LocationFeatureSpecification", name, value: true });
  const data = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: site.name,
    url: `${SITE_URL}/`,
    telephone: site.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.district}, Killi Orman Mevkii No: 23, ${a.village}`,
      postalCode: a.postalCode,
      addressLocality: a.town,
      addressRegion: a.city,
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    amenityFeature: [
      amenity("Indoor thermal pool"),
      amenity("Outdoor pool (seasonal)"),
      amenity("Sauna"),
      amenity("Steam room"),
      amenity("Turkish bath"),
      amenity("Free Wi-Fi"),
      amenity("Parking"),
      amenity("Restaurant"),
      amenity("Kitchen in every unit"),
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
