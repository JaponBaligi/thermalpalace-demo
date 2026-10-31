"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getLitePreference, parseQualityOverride } from "@/lib/quality";

const FALLBACK = "/images/termal-orman-1304.webp";

/**
 * S2 pools. Tiers 1–3 on wide screens: the scene pins and scrolling walks through the cards; the active card's title
 * travels into the heading slot and the background crossfades to that pool's photo. Lite / narrow / reduced motion:
 * no pinning, a card click shows its photo with the same fades but no travel. Photos are /images/pool-<id>.webp;
 * a missing file falls back to the forest image (second background layer), so a new photo is a file drop.
 */
export function PoolsShowcase({ ids, names, children }: { ids: string[]; names: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const section = root?.closest("section");
    const fly = root?.querySelector<HTMLElement>(".tp-pools-fly");
    const heading = root?.querySelector<HTMLElement>(".tp-pools-head h2");
    if (!root || !section || !fly || !heading) return;
    const html = document.documentElement;
    const n = ids.length;
    const cards = [...root.querySelectorAll<HTMLElement>(".tp-pool")];
    const hits = [...root.querySelectorAll<HTMLButtonElement>(".tp-pool-hit")];
    const layers = [...root.querySelectorAll<HTMLElement>(".tp-pools-bg span")];
    const wide = matchMedia("(min-width: 72rem) and (min-height: 42rem)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let active = -1;
    let want = -1;
    let wait = 0;
    let raf = 0;
    let pinned = false;

    // two title layers: the outgoing title returns to its card while the incoming one flies into the heading slot
    const flies = [fly, fly.cloneNode() as HTMLElement];
    fly.after(flies[1]);
    let cur = 0;

    const travel = (i: number, el: HTMLElement) => {
      const t = cards[i].querySelector<HTMLElement>(".tp-h3");
      if (!t) return "";
      const a = t.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const s = parseFloat(getComputedStyle(t).fontSize) / parseFloat(getComputedStyle(el).fontSize);
      return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${s})`;
    };

    const mark = (i: number) => {
      cards.forEach((c, k) => c.toggleAttribute("data-active", k === i));
      layers.forEach((l, k) => l.toggleAttribute("data-on", k === i));
      hits.forEach((h, k) => h.setAttribute("aria-pressed", String(k === i)));
      if (i < 0) delete root.dataset.active;
      else root.dataset.active = String(i);
    };

    const flyOut = (i: number) => {
      const el = flies[cur];
      if (pinned) el.style.transform = travel(i, el);
      el.removeAttribute("data-on");
    };

    const flyIn = (i: number) => {
      cur = 1 - cur;
      const el = flies[cur];
      el.style.top = `${heading.offsetTop}px`;
      el.textContent = names[i];
      if (pinned) {
        el.style.transition = "none";
        el.style.transform = travel(i, el);
        void el.offsetWidth;
        el.style.transition = "";
      }
      el.style.transform = "";
      el.setAttribute("data-on", "");
    };

    // card to card swaps directly (heading stays hidden, photos crossfade); the heading returns only outside the cards
    const step = () => {
      if (wait || want === active) return;
      if (active >= 0) flyOut(active);
      if (want >= 0) flyIn(want);
      active = want;
      mark(active);
      if (!still.matches) wait = window.setTimeout(() => ((wait = 0), step()), 500);
    };
    const go = (i: number) => {
      want = i;
      step();
    };

    const onScroll = () => {
      raf = 0;
      const total = section.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
      const seg = Math.floor(p * (n + 2));
      go(seg >= 1 && seg <= n ? seg - 1 : -1);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(onScroll);
    };

    const mode = () => {
      // inner pages report lite only because they host no WebGL scene; the showcase still pins there unless lite was chosen
      const chosen = parseQualityOverride(location.search) === "lite" || getLitePreference();
      const lite = html.dataset.quality === "lite" && (html.dataset.qualityReason !== "no-webgl-scene" || chosen);
      const next = wide.matches && !still.matches && !lite;
      if (next === pinned) return;
      pinned = next;
      section.toggleAttribute("data-pin", pinned);
      section.style.setProperty("--pool-n", String(n));
      go(-1);
      if (pinned) {
        addEventListener("scroll", queue, { passive: true });
        queue();
      } else removeEventListener("scroll", queue);
    };

    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLButtonElement>(".tp-pool-hit");
      if (!b) return;
      const i = Number(b.dataset.i);
      if (pinned) {
        const top = section.getBoundingClientRect().top + scrollY;
        const total = section.offsetHeight - innerHeight;
        scrollTo({ top: top + (total * (i + 1.5)) / (n + 2), behavior: "smooth" });
      } else go(want === i ? -1 : i);
    };

    // photos load only when the scene comes near
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        layers.forEach((l, k) => (l.style.backgroundImage = `url(/images/pool-${ids[k]}.webp), url(${FALLBACK})`));
        io.disconnect();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(section);

    const mo = new MutationObserver(mode);
    mo.observe(html, { attributes: true, attributeFilter: ["data-quality", "data-quality-reason"] });
    wide.addEventListener("change", mode);
    still.addEventListener("change", mode);
    root.addEventListener("click", onClick);
    mode();

    return () => {
      io.disconnect();
      mo.disconnect();
      wide.removeEventListener("change", mode);
      still.removeEventListener("change", mode);
      root.removeEventListener("click", onClick);
      removeEventListener("scroll", queue);
      cancelAnimationFrame(raf);
      window.clearTimeout(wait);
      section.removeAttribute("data-pin");
      flies[1].remove();
    };
  }, [ids, names]);

  return (
    <div ref={ref} className="tp-pools-sticky">
      <div className="tp-pools-bg" aria-hidden="true">
        {ids.map((id) => (
          <span key={id} />
        ))}
      </div>
      {children}
    </div>
  );
}
