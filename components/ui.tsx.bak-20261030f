import type { CSSProperties, ReactNode, SVGProps } from "react";
import type { Locale } from "@/content/routes";
import { t } from "@/content";
import { IS_DEMO, site } from "@/content/site";

type IconProps = SVGProps<SVGSVGElement>;

const base = (p: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.6 16.6 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z" />
    </svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function ChatIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.6 18.7Z" />
    </svg>
  );
}

export function ArrowIcon(p: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...p })}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function WaveIcon(p: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...p })}>
      <path d="M2 9c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5 0M2 15c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5 0" />
    </svg>
  );
}

/** Screen-reader hint for links that open a new tab. */
export function NewTab({ label }: { label: string }) {
  return <span className="sr-only"> {label}</span>;
}

/** Small "teyit edilecek" / "to be confirmed" label; rendered only on the demo. */
export function Verify({ locale }: { locale: Locale }) {
  if (!IS_DEMO) return null;
  return <span className="tp-verify">{t(locale).common.verify}</span>;
}

/** Renders `[[...]]` as a labelled placeholder and `[?]` as the verify label. */
export function Rich({ text, locale }: { text: string; locale: Locale }) {
  const parts = text.split(/(\[\[[^\]]+\]\]|\s?\[\?\])/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("[[")) {
          return (
            <span key={i} className="tp-ph">
              {p.slice(2, -2)}
            </span>
          );
        }
        if (p.trim() === "[?]") {
          return (
            <span key={i}>
              {" "}
              <Verify locale={locale} />
            </span>
          );
        }
        return p;
      })}
    </>
  );
}

/** Text wordmark until a logo file arrives. */
export function Wordmark({ line, className = "" }: { line: string; className?: string }) {
  return (
    <span className={`tp-mark ${className}`}>
      <span className="tp-mark-name">{site.name}</span>
      <span className="tp-mark-line">{line}</span>
    </span>
  );
}

/** WhatsApp placeholder (57 U9): looks like a button, is not a link, says why. */
export function WhatsAppPending({ locale, className = "" }: { locale: Locale; className?: string }) {
  const c = t(locale).common;
  if (site.whatsapp) return null;
  return (
    <span className={`tp-btn tp-btn-pending ${className}`}>
      <ChatIcon />
      <span className="tp-pending-text">
        {c.whatsapp}
        <span className="tp-pending-note">{c.whatsappPending}</span>
      </span>
    </span>
  );
}

/** Stagger delay for `.tp-enter` / `.tp-reveal`. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Section kicker with the decorative depth marker of the "descent". */
export function Kicker({ children, depth }: { children: ReactNode; depth?: string }) {
  return (
    <p className="tp-kicker">
      {depth ? (
        <span className="tp-kicker-depth" aria-hidden="true">
          {depth}
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

/** Thin animated water line used as a divider. Decorative. */
export function WaterLine({ className = "" }: { className?: string }) {
  const d = "M0 10 C 50 2, 100 2, 150 10 S 250 18, 300 10 S 400 2, 450 10 S 550 18, 600 10";
  return (
    <svg className={`tp-waterline ${className}`} viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

type Tone = "deep" | "open" | "small" | "steam";

const plateTones: Record<Tone, [string, string, string]> = {
  deep: ["#2a3133", "#14171a", "#8c918c"],
  open: ["#3a4143", "#2a3133", "#aeb2ab"],
  small: ["#4a3a28", "#2a3133", "#aeb2ab"],
  steam: ["#2a3133", "#14171a", "#c8873a"],
};

/**
 * Procedural "water plate" (57 U12): gradient, ripple rings and surface lines in the tone of each pool.
 * Not a photo and not presented as one. The WebGL layer (P3) replaces it with a per-card shader.
 */
export function WaterPlate({ id, tone }: { id: string; tone: Tone }) {
  const [a, b, line] = plateTones[tone];
  const g = `tp-plate-${id}`;
  return (
    <svg className={`tp-plate tp-plate-${tone}`} viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${g}-glow`} cx="0.7" cy="0.2" r="0.7">
          <stop offset="0" stopColor={line} stopOpacity="0.45" />
          <stop offset="1" stopColor={line} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="220" fill={`url(#${g})`} />
      <rect width="320" height="220" fill={`url(#${g}-glow)`} />
      {tone === "steam" ? (
        <g className="tp-plate-wisps" stroke={line} strokeOpacity="0.55" fill="none" strokeWidth="1.4" strokeLinecap="round">
          <path d="M90 210c-14-30 18-46 4-78s16-48 6-80" />
          <path d="M160 214c-16-34 20-52 4-86s18-50 8-86" />
          <path d="M230 210c-14-30 18-46 4-78s16-48 6-80" />
        </g>
      ) : (
        <g className="tp-plate-rings" stroke={line} fill="none" strokeWidth="1.1">
          <ellipse cx="200" cy="140" rx="30" ry="9" strokeOpacity="0.7" />
          <ellipse cx="200" cy="140" rx="62" ry="19" strokeOpacity="0.45" />
          <ellipse cx="200" cy="140" rx="100" ry="31" strokeOpacity="0.25" />
          <ellipse cx="200" cy="140" rx="146" ry="45" strokeOpacity="0.12" />
        </g>
      )}
      <g stroke={line} strokeOpacity="0.35" fill="none" strokeWidth="1">
        <path d="M0 60c40-8 80-8 120 0s80 8 120 0 60-6 80-4" />
        <path d="M0 78c40-6 80-6 120 0s80 6 120 0 60-5 80-3" strokeOpacity="0.2" />
      </g>
    </svg>
  );
}

/** Caustic light network for the spa scene (LITE stand-in for the caustics shader). */
export function Caustics({ className = "" }: { className?: string }) {
  return (
    <svg className={`tp-caustics ${className}`} aria-hidden="true" focusable="false" width="100%" height="100%">
      <defs>
        <pattern id="tp-caustic-tile" width="240" height="240" patternUnits="userSpaceOnUse" patternTransform="scale(1.7) rotate(-8)">
          <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
            <path d="M0 40c30 10 50-12 80 4s40 34 70 22 50-30 90-18" />
            <path d="M0 130c26-16 54 6 76-10s34-40 64-30 46 34 70 24 22-8 30-6" />
            <path d="M0 200c34 6 46-22 82-14s44 30 76 20 50-24 82-16" />
            <path d="M40 0c-10 30 14 48-2 78s-26 44-8 72 20 54 6 90" />
            <path d="M150 0c12 28-12 50 6 78s30 40 12 70-22 52-6 92" />
            <path d="M210 0c-8 34 18 44 4 74s-20 50-2 76 14 50 6 90" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tp-caustic-tile)" />
    </svg>
  );
}

/** Evening hillside of Termal: three layered ridges (LITE stand-in for the sky shader). */
export function Ridges({ className = "" }: { className?: string }) {
  return (
    <svg className={`tp-ridges ${className}`} viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 150 C 160 90 300 120 430 96 S 700 40 860 80 S 1160 60 1280 92 S 1400 110 1440 100 V260 H0Z" fill="#3a3128" fillOpacity="0.55" />
      <path d="M0 190 C 140 150 260 170 400 140 S 640 110 820 150 S 1080 120 1240 150 S 1380 170 1440 160 V260 H0Z" fill="#2a3133" fillOpacity="0.75" />
      <path d="M0 228 C 180 200 340 220 520 200 S 860 180 1040 206 S 1320 210 1440 198 V260 H0Z" fill="#1c2023" />
    </svg>
  );
}

/** Abstract apartment glyph: one or two levels, a dot per guest, a dome for the in-unit hamam. Not a floor plan. */
export function UnitGlyph({ guests, levels, hamam, label }: { guests: number; levels: 1 | 2; hamam: boolean; label: string }) {
  const rows = levels === 2 ? [Math.ceil(guests / 2), Math.floor(guests / 2)] : [guests];
  const top = levels === 2 ? 22 : 52;
  const h = levels === 2 ? 72 : 42;
  return (
    <svg className="tp-glyph" viewBox="0 0 160 110" role="img" aria-label={label} focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <rect className="tp-draw" x="16" y={top} width="128" height={h} rx="3" pathLength={1} />
        {levels === 2 ? <path className="tp-draw" d="M16 58h128" pathLength={1} /> : null}
        {hamam ? <path className="tp-draw" d="M112 22c0-12 20-12 20 0" pathLength={1} /> : null}
        <path className="tp-draw tp-glyph-water" d="M4 102c18-5 36-5 54 0s36 5 54 0 30-4 44-1" pathLength={1} />
      </g>
      <g fill="currentColor">
        {rows.map((count, r) =>
          Array.from({ length: count }, (_, i) => {
            const rowY = levels === 2 ? (r === 0 ? 40 : 76) : 73;
            const span = 104;
            const x = 28 + (count === 1 ? span / 2 : (span / (count - 1)) * i);
            return <circle key={`${r}-${i}`} className="tp-glyph-dot" cx={x} cy={rowY} r="4.2" />;
          }),
        )}
      </g>
    </svg>
  );
}
