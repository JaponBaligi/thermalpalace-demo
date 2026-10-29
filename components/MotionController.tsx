"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { allowsFullMotion, headerOffset, setLenis } from "@/lib/motion";

/** Lenis on fine pointers without reduced motion, plus the scroll reveals. */
export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    if (!allowsFullMotion()) return;
    let cancelled = false;
    let destroy = () => {};
    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: { offset: -headerOffset() } });
      setLenis(lenis);
      destroy = () => {
        lenis.destroy();
        setLenis(null);
      };
    })();
    return () => {
      cancelled = true;
      destroy();
    };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const targets = document.querySelectorAll<HTMLElement>(".tp-reveal");
    if (!root.classList.contains("js-motion") || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
