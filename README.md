# Yalova Thermal Palace – demo (`thermalpalace-demo`)

Static Next.js site (TR `/`, EN `/en/`) for `https://thermalpalace-demo.japonbaligi.com`. Spec: `planlar/demo_planlari/57_thermalpalace_final_plan.md` (merge of 54, 55, 56 and the user decisions of 29 Oct 2026). Phase status: P1 (LITE site) done, see `PHASE_P1_REPORT.md`.

## Commands

```powershell
npm install
npm run dev             # http://localhost:3000
npm run build           # static export to out/ (+ flatten-segments for Windows), default edition "portfolio"
npm run build:business  # same with NEXT_PUBLIC_EDITION=business (LITE only, never imports WebGL code)
npm run lint
npm run check           # banned words, schema, canonical/hreflang/og:url, noindex, h1, sitemap, robots on out/
npm run contrast        # WCAG contrast of the palette pairs used in app/globals.css
npm run map             # re-render public/images/harita-thermalpalace.webp from OSM tiles
npm run og              # re-render public/og.webp (procedural text card)
node scripts/serve.mjs  # brotli static server for out/ on :4173 (Lighthouse runs)
```

All copy lives in `content/` (`site.ts`, `routes.ts`, `tr.ts`, `en.ts`, `units.ts`, `spa.ts`). `[[...]]` renders as a tinted placeholder; `[?]` renders a "teyit edilecek" / "to be confirmed" label while `IS_DEMO` is true. Before launch, remove every `[?]` item the owner has not confirmed.

Flags in `content/site.ts`: `IS_DEMO` (labels, noindex), `EDITION` (from `NEXT_PUBLIC_EDITION`, default `portfolio`), `SHOW_CREDIT = false` ("Designed by JB", not rendered while false).

## Kararlar (user, 29 Oct 2026; 57 §1)

- U1 Default edition is the full WebGL version (`portfolio`); in P1 the quality resolver always returns `lite`.
- U2 Business / lite edition stays as a fallback (`build:business`).
- U3 No Awwwards submission package.
- U4 "Designed by JB" only as a disabled config flag.
- U5 No healing / medical claims about the thermal water; no temperature or mineral data.
- U6 No invented facts; single-source items labelled, missing items as placeholders.
- U7 TR + EN.
- U8 No prices.
- U9 WhatsApp is a passive "numara alınacak" button (a `<span>`, no link).
- U10 Planned size figures (750 rooms etc.) left off.
- U11 No review quotes, ratings or badges.
- U12 Neutral procedural visuals (CSS/SVG); no photo presented as the hotel; no gallery.
- U13 noindex kept (meta + `vercel.json`); canonical, hreflang, sitemap, robots `Sitemap:` line and `og:url` active on the demo domain.

## Open items (teyit edilecek)

1. Current operator and legal name; Karaderili group involvement.
2. Street type (Cad. or Sok.) and the map pin (40.618673, 29.189453).
3. Unit types, guest capacity, bed layouts, sizes, number of units; types sold to nightly guests.
4. Spa: hours, separate hamam use, women / men / mixed session schedule, salt room, massage options, pool rules for nightly guests; children's pool; outdoor pool season dates.
5. Board options, breakfast and restaurant hours, à la carte restaurant; alcohol policy / bar (sources conflict, neither is written).
6. Parking (free or paid), laundry, shop hours.
7. Check-in / check-out, children, pets, payment, reception hours.
8. Mobile / WhatsApp number, e-mail, Instagram and Facebook accounts.
9. Photos and publication consent.
10. Tourism licence number and classification for the footer.
11. Water source name, if wanted (no health claims either way).
12. Accessibility (lift, step-free access, accessible units); meeting halls.
13. Domain `yalovathermalpalace.com`: who controls it.
14. EN native check.
15. Distance to Yalova centre (~9 km, single source); "2015'ten beri".
16. Permission to publish the site as a concept study under the hotel's name.

## Checks

- noindex: `<meta name="robots">` via metadata, `vercel.json` X-Robots-Tag, `public/robots.txt` `Allow: /` + `Sitemap:`.
- Intro: sessionStorage key `thermalpalace-intro`; CSS only, 3.2 s; skipped on reload and with reduced motion; hero entrance delayed until it ends.
- Header: hides after 80 px on scroll down (`top`, 1 s, `cubic-bezier(0.45,0,0.55,1)`), solid after 10 px, reveals on scroll up and on focus; body padding = header height (84 px).
- Lenis: dynamic import, `lerp: 0.1`, fine pointer without reduced motion only; mobile menu pauses it and has `data-lenis-prevent`.
- Mobile menu: closes on X, Esc and link tap; focus trap; focus returns to the trigger.
- Tap targets ≥ 44 px and no horizontal overflow at 375 / 768 / 1440 px on all pages.
- WebGL hooks: `components/webgl/WebGLStage.tsx` (empty `aria-hidden` layer, `html[data-quality]`, `html[data-active-scene]`), `lib/quality.ts`, `data-scene="0…6"` on the Home sections.
