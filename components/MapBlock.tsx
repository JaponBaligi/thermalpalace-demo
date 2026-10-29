import { site } from "@/content/site";
import { LiveMap } from "./LiveMap";

/** Static OSM render first (no-JS fallback, LCP-safe), Leaflet on top once near the viewport after input. */
export function MapBlock({ alt, label, className = "" }: { alt: string; label: string; className?: string }) {
  return (
    <LiveMap lat={site.geo.lat} lng={site.geo.lng} label={label} zoom={16} className={`tp-map ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img src="/images/harita-thermalpalace.webp" alt={alt} width={1200} height={800} loading="lazy" decoding="async" />
    </LiveMap>
  );
}
