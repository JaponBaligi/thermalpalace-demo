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

    const travel = (i: number) => {
      const t = cards[i].querySelector<HTMLElement>(".tp-h3");
      if (!t) return "";
      const a = t.getBoundingClientRect();
      const b = fly.getBoundingClientRect();
      const s = parseFloat(getComputedStyle(t).fontSize) / parseFloat(getComputedStyle(fly).fontSize);
      return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${s})`;
    };

    const mark = (i: number) => {
      cards.forEach((c, k) => c.toggleAttribute("data-active", k === i));
      layers.forEach((l, k) => l.toggleAttribute("data-on", k === i));
      hits.forEach((h, k) => h.setAttribute("aria-pressed", String(k === i)));
      if (i < 0) delete root.dataset.active;
      else root.dataset.active = String(i);
    };

    const show = (i: number) => {
      active = i;
      fly.style.top = `${heading.offsetTop}px`;
      fly.textContent = names[i];
      if (pinned) {
        fly.style.transition = "none";
        fly.style.transform = travel(i);
        void fly.offsetWidth;
        fly.style.transition = "";
      }
      fly.style.transform = "";
      mark(i);
    };

    const hide = () => {
      const i = active;
      active = -1;
      if (pinned && i >= 0) fly.style.transform = travel(i);
      mark(-1);
    };

    // one change at a time: the outgoing title returns to its card before the next one leaves
    const step = () => {
      if (wait || want === active) return;
      if (active >= 0) {
        hide();
        if (want >= 0) wait = window.setTimeout(() => ((wait = 0), step()), still.matches ? 0 : 850);
      } else show(want);
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
