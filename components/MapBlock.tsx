import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { site } from "@/content/site";
import { LiveMap } from "./LiveMap";
import { NewTab, PinIcon } from "./ui";

/** Static OSM render first (no-JS fallback, LCP-safe), Leaflet on top once near the viewport after input; directions to the same pin. */
export function MapBlock({ alt, label, locale, className = "" }: { alt: string; label: string; locale: Locale; className?: string }) {
  const c = t(locale).common;
  return (
    <div className="tp-map-block">
      <div className="tp-map-frame">
        <LiveMap lat={site.geo.lat} lng={site.geo.lng} label={label} zoom={16} className={`tp-map ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img src="/images/harita-thermalpalace.webp" alt={alt} width={1200} height={800} loading="lazy" decoding="async" />
        </LiveMap>
        <span className="tp-map-medal tp-map-medal-t" aria-hidden="true" />
        <span className="tp-map-medal tp-map-medal-b" aria-hidden="true" />
      </div>
      <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-gold tp-map-dir">
        <PinIcon />
        <span>{c.directionsShort}</span>
        <NewTab label={c.newTab} />
      </a>
    </div>
  );
}
