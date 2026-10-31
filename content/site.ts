/**
 * While true: noindex (meta + vercel.json) and one site-wide "teyit edilecek" note in the footer.
 * Canonical, hreflang, og:url and the sitemap are always emitted (57 §1 U13).
 * Before launch, remove every unconfirmed item the owner has not confirmed; do not just flip this flag.
 */
export const IS_DEMO = true;

export const SITE_URL = "https://thermalpalace-demo.japonbaligi.com";

/**
 * Build-time edition (57 U1/U2). `portfolio` (default) may load the WebGL layer from P2 on;
 * `business` always stays LITE and never imports WebGL/GSAP chunks.
 */
export type Edition = "portfolio" | "business";
export const EDITION: Edition = process.env.NEXT_PUBLIC_EDITION === "business" ? "business" : "portfolio";

/** "Designed by JB" footer credit (57 U4). Disabled; flip only with the user's approval. */
export const SHOW_CREDIT = false;
export const CREDIT_TEXT = "Designed by JB";

/** Facts from 57 §3 only. Nullable fields stay null until the owner confirms them. */
export const site = {
  name: "Yalova Thermal Palace",
  phoneDisplay: "0226 809 23 23",
  phoneDisplayIntl: "+90 226 809 23 23",
  phoneTel: "+902268092323",
  /** No mobile number in any source: passive placeholder button, never a link (57 U9). */
  whatsapp: null as string | null,
  /** info@ on the dead domain; delivery unknown (54 D9). Hidden. */
  email: null as string | null,
  /** Instagram / Facebook not confirmed as active or the operator's own (54 D9). Hidden. */
  instagram: null as string | null,
  facebook: null as string | null,
  /** Google place data (EXA). OSM node 4354567779 is ~25 m away (checked 29 Oct 2026). */
  geo: { lat: 40.618673, lng: 29.189453 },
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=40.618673,29.189453",
  address: {
    district: "Köyiçi Mah.",
    /** "Sok." per 54 D2 (Google, Yandex, group page); own site said "Cad.". Labelled. */
    street: "Killi Orman Sok. No: 23",
    village: "Akköy",
    postalCode: "77400",
    town: "Termal",
    city: "Yalova",
  },
  /** Hidden in the footer until supplied (54 §5). */
  legalName: null as string | null,
  licenceNo: null as string | null,
} as const;
