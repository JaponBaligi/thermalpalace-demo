"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { routes, type Locale, type PageKey } from "@/content/routes";
import type { SiteContent } from "@/content";
import { navPage } from "@/lib/path";
import { phoneText, telLink } from "@/lib/contact";
import { pauseSmoothScroll, resumeSmoothScroll } from "@/lib/motion";
import { site } from "@/content/site";
import { LangSwitcher } from "./LangSwitcher";
import { NewTab, PhoneIcon, PinIcon, Wordmark } from "./ui";

export function Header({ locale, c }: { locale: Locale; c: SiteContent["common"] }) {
  const pathname = usePathname();
  const current = navPage(locale, pathname);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 10);
      if (y > 80 && y > lastY.current) setHidden(true);
      else if (y < lastY.current || y <= 80) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Released synchronously so a same-page anchor tapped in the panel can scroll in the same click.
  const unlock = useCallback(() => {
    document.documentElement.classList.remove("tp-menu-open");
    resumeSmoothScroll();
    document.body.style.overflow = "";
  }, []);

  const close = useCallback(() => {
    unlock();
    setOpen(false);
    triggerRef.current?.focus();
  }, [unlock]);

  useEffect(() => unlock, [unlock]);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      unlock();
      return;
    }
    root.classList.add("tp-menu-open");
    pauseSmoothScroll();
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, unlock]);

  const shown = open || !hidden;
  const links: { key: PageKey; label: string }[] = [
    { key: "rooms", label: c.nav.rooms },
    { key: "spa", label: c.nav.spa },
    { key: "contact", label: c.nav.contact },
  ];

  return (
    <>
      <header className="tp-header" data-hidden={!shown} data-solid={open || solid} onFocus={() => setHidden(false)}>
        <div className="tp-wrap tp-header-inner">
          <a href={routes[locale].home} className="tp-home-link" aria-current={current === "home" ? "page" : undefined}>
            <Wordmark line={c.wordmarkLine} />
            <span className="sr-only"> – {c.home}</span>
          </a>

          <nav aria-label={c.primaryNav} className="tp-nav">
            <ul>
              {links.map((l) => (
                <li key={l.key}>
                  <a href={routes[locale][l.key]} aria-current={current === l.key ? "page" : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="tp-header-end">
            <a href={telLink} className="tp-header-phone">
              {phoneText(locale)}
            </a>
            <LangSwitcher locale={locale} label={c.languageLabel} className="tp-lang-header" />
            <a href={telLink} className="tp-btn tp-btn-copper tp-header-cta">
              <PhoneIcon />
              <span>{c.callUs}</span>
            </a>
            <button
              ref={triggerRef}
              type="button"
              className="tp-menu-btn"
              aria-expanded={open}
              aria-controls="tp-panel"
              aria-label={c.menuOpen}
              onClick={() => setOpen(true)}
            >
              <span className="tp-menu-lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="tp-panel" ref={panelRef} className="tp-panel" role="dialog" aria-modal="true" aria-label={c.primaryNav} data-lenis-prevent inert={!open}>
        <div className="tp-panel-sheet">
          <div className="tp-panel-top">
            <a href={routes[locale].home} className="tp-home-link" onClick={close}>
              <Wordmark line={c.wordmarkLine} />
              <span className="sr-only"> – {c.home}</span>
            </a>
            <button type="button" className="tp-close" aria-label={c.menuClose} onClick={close}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          <nav aria-label={c.primaryNav} className="tp-panel-nav">
            <ul>
              {[{ key: "home" as PageKey, label: c.home }, ...links].map((l, i) => (
                <li key={l.key} style={{ "--i": i } as CSSProperties}>
                  <a href={routes[locale][l.key]} aria-current={current === l.key ? "page" : undefined} onClick={close}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LangSwitcher locale={locale} label={c.languageLabel} className="tp-lang-panel" onNavigate={close} />

          <div className="tp-panel-contact">
            <a href={telLink} className="tp-btn tp-btn-copper" onClick={close}>
              <PhoneIcon />
              <span>
                {c.call}: {phoneText(locale)}
              </span>
            </a>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-btn tp-btn-ghost-light" onClick={close}>
              <PinIcon />
              <span>{c.directions}</span>
              <NewTab label={c.newTab} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
