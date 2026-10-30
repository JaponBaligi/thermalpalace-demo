import localFont from "next/font/local";
import { Inter } from "next/font/google";

/**
 * Display: General Sans variable (Indian Type Foundry, ITF Free Font License via Fontshare; self-hosting for own
 * websites is permitted, license text in public/fonts/GeneralSans-LICENSE.txt). Covers ğ ş ı İ ç ö ü.
 */
export const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  weight: "200 700",
  display: "swap",
  variable: "--font-general-sans",
});

/** UI and body. Variable weight axis. */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const fontVars = `${generalSans.variable} ${inter.variable}`;
