"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Extra labelled badge (e.g. a legend number); the view fits all points when any are given. */
export type MapPoint = { lat: number; lng: number; text: string; color: string; square?: boolean };

type Props = {
  lat: number;
  lng: number;
  /** Accessible name of the interactive map region. */
  label: string;
  zoom?: number;
  points?: MapPoint[];
  /** Draw the default drop pin at lat/lng; turn off when a point already marks the place. */
  pin?: boolean;
  className?: string;
  /** Static map shown until Leaflet is ready; also the no-JS fallback and the box that sizes the map. */
  children: ReactNode;
};

const PIN =
  '<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true"><path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 41 16 41s15-14 15-25.2C31 7.6 24.3 1 16 1Z" fill="currentColor" stroke="#fff" stroke-width="2"/><circle cx="16" cy="15.5" r="5.5" fill="#fff"/></svg>';

/**
 * Leaflet + OpenStreetMap tiles, loaded when the map nears the viewport after the first user input (no cookies, no iframe).
 * Wheel zoom and one-finger drag on touch stay off until the map is clicked or tapped, so page scrolling is never trapped.
 */
const badge = ({ text, color, square }: MapPoint) =>
  `<span class="live-map-badge" style="background:${color};border-radius:${square ? "4px" : "50%"}">${text}</span>`;

export function LiveMap({ lat, lng, label, zoom = 16, points, pin = true, className = "", children }: Props) {
  const pointsKey = JSON.stringify(points ?? []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = mapRef.current;
    if (!wrap || !el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: L }] = await Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]);
      if (cancelled) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const touch = window.matchMedia("(pointer: coarse)").matches;

      map = L.map(el, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
        dragging: !touch,
        zoomAnimation: !reduced,
        fadeAnimation: !reduced,
        markerZoomAnimation: !reduced,
      });
      map.attributionControl.setPrefix(false);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      })
        .once("load", () => !cancelled && setReady(true))
        .addTo(map);
      if (pin) {
        L.marker([lat, lng], {
          icon: L.divIcon({ className: "live-map-pin", html: PIN, iconSize: [32, 42], iconAnchor: [16, 41] }),
          keyboard: false,
          interactive: false,
        }).addTo(map);
      }
      const extra: MapPoint[] = JSON.parse(pointsKey);
      for (const p of extra) {
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: "live-map-point", html: badge(p), iconSize: [30, 30], iconAnchor: [15, 15] }),
          keyboard: false,
          interactive: false,
        }).addTo(map);
      }
      if (extra.length) {
        map.fitBounds(L.latLngBounds([[lat, lng], ...extra.map((p) => [p.lat, p.lng] as [number, number])]), { padding: [36, 36], maxZoom: zoom });
      }

      const activate = () => {
        map?.scrollWheelZoom.enable();
        map?.dragging.enable();
        wrap.setAttribute("data-lenis-prevent", "");
      };
      const deactivate = () => {
        map?.scrollWheelZoom.disable();
        if (touch) map?.dragging.disable();
        wrap.removeAttribute("data-lenis-prevent");
      };
      map.on("click focus", activate);
      wrap.addEventListener("mouseleave", deactivate);
      el.addEventListener("blur", deactivate);
    };

    // Start only once the map is near the viewport and the visitor has interacted, so page load never pays for Leaflet.
    let inView = false;
    let interacted = false;
    const INPUT = ["scroll", "wheel", "pointerdown", "pointermove", "keydown", "touchstart"] as const;
    const stopListening = () => {
      io.disconnect();
      for (const t of INPUT) window.removeEventListener(t, onInput);
    };
    const start = () => {
      if (!inView || !interacted) return;
      stopListening();
      void init();
    };
    const onInput = () => {
      interacted = true;
      start();
    };
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        start();
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);
    for (const t of INPUT) window.addEventListener(t, onInput, { passive: true });

    return () => {
      cancelled = true;
      stopListening();
      map?.remove();
    };
  }, [lat, lng, zoom, pin, pointsKey]);

  return (
    <div ref={wrapRef} className={`live-map ${className}`} data-ready={ready || undefined}>
      <div className="live-map-static">{children}</div>
      <div ref={mapRef} className="live-map-canvas" dir="ltr" role="region" aria-label={label} />
    </div>
  );
}
