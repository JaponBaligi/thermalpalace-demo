import { Cormorant_Garamond, Manrope } from "next/font/google";

/** Display: 500 + 500 italic only (tagline). latin-ext preloaded too: headings use ğ ş İ ı, late swap shifts layout. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

/** UI and body. Variable weight axis. */
export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

export const fontVars = `${cormorant.variable} ${manrope.variable}`;
