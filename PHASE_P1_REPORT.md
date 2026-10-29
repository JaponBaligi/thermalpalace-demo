# Phase P1 report – `thermalpalace-demo` (29 Oct 2026)

Scope (57 §7, P1): project skeleton, all content in config, full LITE (no-WebGL) site with every page in TR and EN, accessibility, SEO, hooks for the WebGL layer. Nothing from P2–P4 was built.

## Done

- Plan merge: `planlar/demo_planlari/57_thermalpalace_final_plan.md` (54 + 55 + 56 + user decisions U1–U13).
- Next.js 16.4 App Router static export, React 19.3, Tailwind 4; route groups `(tr)` and `en`; `global-not-found` (bilingual 404).
- Pages: `/`, `/odalar/`, `/termal-spa/`, `/iletisim/`, `/en/`, `/en/rooms/`, `/en/thermal-spa/`, `/en/contact/`.
- Content only in `content/*`; verified facts per 57 §3.1, labelled items per §3.2, placeholders per §3.3.
- Home scenes S0–S6 as `<section data-scene="n">`; procedural visuals (steam gradients, water lines, caustic plates, dusk ridges, unit glyphs); real `<table>` for the unit comparison.
- Mandatory rules: CSS intro (3.2 s, once per session, not with reduced motion), Lenis (dynamic import, fine pointer only), header behaviour (hide/reveal, `top` transition, solid after 10 px, reveal on focus).
- Mobile sticky bar: Ara (tel link), WhatsApp passive `<span>`, Yol tarifi (Google Maps directions).
- SEO: absolute self-canonicals, hreflang `tr` / `en` / `x-default`, `og:url`, `og:locale`, `og:image` (procedural WebP), `sitemap.xml` (8 URLs with alternates), `robots.txt` with `Sitemap:`, JSON-LD `Hotel` with verified facts only, noindex (meta + `vercel.json`).
- WebGL hooks for P2: `components/webgl/WebGLStage.tsx` (mounted in both layouts, empty `aria-hidden` layer, sets `html[data-quality]`, `data-quality-reason`, `data-active-scene`), `lib/quality.ts` (overrides `?lite=1` / `?tier=`, reduced motion, Save-Data, slow network, low-end device, no WebGL2; `detectTier()` / `clampToPhase()` stubs return `lite`), `EDITION` flag; the business build renders no stage.

## Acceptance criteria

| Criterion | Result |
|---|---|
| `next build` export without errors | Pass (default and business builds; lint clean) |
| All TR/EN pages work | Pass (8 pages + 404; `npm run check` passes) |
| Lighthouse mobile performance ≥ 95 | **Not met locally**: 78–97, only `/` reached 95+ in one pass (see below) |
| Lighthouse accessibility ≥ 95 | Pass: 100 on all 8 pages |
| Lighthouse SEO 100 | **Not reachable by design**: 66–69; the only failing audit is `is-crawlable` (intended noindex, U13) |
| First-load JS ≤ 110 KB gz | **Not met**: 134.8–137.4 KB gz (see below) |
| Health-word grep 0 | Pass: raw grep of `out/` (HTML, RSC payloads, XML) returns 0 for health, price, review and `wa.me` patterns |
| Every fact sourced | Pass: only 57 §3 facts; single-source items labelled |
| Keyboard | Pass: skip link, all controls reachable, focus never off-screen (header reveals on focus), menu focus trap, Esc closes |
| Mobile bottom bar | Pass: three ≥ 44 px targets; tel and directions links work; WhatsApp passive |
| Menu closes on X / Esc / link tap; taps ≥ 44 px | Pass (375 / 768 / 1440 px, all pages) |

## Measurements

Lighthouse 12, mobile, local brotli server (`scripts/serve.mjs`, cache warmed), fresh session, so the intro always plays. Two passes on the final build (ranges = min–max). Best practices 100 and CLS 0 on all pages.

| Page | Perf | LCP | TBT |
|---|---|---|---|
| `/` | 78–97 | 1.9–2.9 s | 60–720 ms |
| `/odalar/` | 78–80 | 2.8 s | 630–690 ms |
| `/termal-spa/` | 80–81 | 2.7–2.8 s | 590–650 ms |
| `/iletisim/` | 82–83 | 2.9 s | 490–520 ms |
| `/en/` | 88 | 2.8 s | 320–340 ms |
| `/en/rooms/` | 86–89 | 2.8 s | 300–390 ms |
| `/en/thermal-spa/` | 89–91 | 2.7–2.8 s | 290–310 ms |
| `/en/contact/` | 93 | 2.9 s | 170 ms |

- The score is limited by TBT. A trace with 4× CPU throttling shows two main tasks on the content pages: the initial layout (226–326 ms throttled, before first paint) and React hydration (about 300 ms throttled). The bilingual 404, which has almost no content, scores 97 with TBT 80 ms on the same setup.
- TR pages are consistently heavier than EN pages (TBT 490–720 vs 170–390 ms). Cause not identified.
- First-load JS: the 404 page alone loads 134.8 KB gz of framework code (React DOM + Next runtime); the site's own client components add at most 2.6 KB. The 110 KB budget cannot be met with Next 16 + React 19.3 as configured; it needs either a budget change or a different runtime.
- The local setup understates production for other demos (ulkeotel README: townie-demo 84–85 locally, 92 on its production URL). Re-run on the deployed URL.
- Tried and reverted: `experimental.inlineCss` (no gain), un-preloading Cormorant (CLS 0.044 from the latin-ext face used by Turkish headings).
- Fonts: 6 preloaded woff2 files, 124 KB (budget 160 KB). Images: `og.webp` 17 KB, map 32 KB.

## For P2

- Fill `WebGLStage` via dynamic import when `EDITION !== "business"` and `resolveQuality() !== "lite"`; replace `detectTier()` / `clampToPhase()` with `detect-gpu` (self-hosted benchmarks).
- Keep the LITE paint as the first paint; the canvas stays `aria-hidden`.
- Before adding WebGL weight, decide on the first-load JS and performance budgets above and measure on the deployed URL.
