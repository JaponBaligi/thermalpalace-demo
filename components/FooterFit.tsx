"use client";

import { useEffect } from "react";

/** Publishes the footer height as --footer-h so the closing call block above it fills the rest of the viewport. */
export function FooterFit() {
  useEffect(() => {
    const f = document.querySelector<HTMLElement>(".tp-footer");
    if (!f) return;
    const html = document.documentElement;
    const ro = new ResizeObserver(() => html.style.setProperty("--footer-h", `${f.offsetHeight}px`));
    ro.observe(f);
    return () => ro.disconnect();
  }, []);
  return null;
}
