import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function pauseSmoothScroll() {
  lenis?.stop();
}

export function resumeSmoothScroll() {
  lenis?.start();
}

/** Fine pointer and no reduced-motion preference. Touch keeps native scrolling. */
export function allowsFullMotion() {
  return window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Real header height in px, read from the CSS custom property so JS and CSS never disagree. */
export function headerOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return v.endsWith("rem") ? parseFloat(v) * rem : parseFloat(v) || 76;
}
