/**
 * CSS-only opening, "waterline": a surface line draws across the dark water, three steam wisps rise from it,
 * the name surfaces from under the line, the sub-line follows, then the water drains downwards. 3.2 s, once per session.
 */
export function IntroOverlay({ name, line }: { name: string; line: string }) {
  return (
    <div className="tp-intro" aria-hidden="true">
      <div className="tp-intro-stage">
        <svg className="tp-intro-wisps" viewBox="0 0 160 90" fill="none">
          <path pathLength={1} d="M48 88c-10-18 12-28 2-46s10-28 4-40" />
          <path pathLength={1} d="M80 88c-12-20 14-32 2-52s12-30 4-34" />
          <path pathLength={1} d="M112 88c-10-18 12-28 2-46s10-28 4-40" />
        </svg>
        <span className="tp-intro-clip">
          <span className="tp-intro-name">{name}</span>
        </span>
        <span className="tp-intro-surface" />
        <span className="tp-intro-line">{line}</span>
      </div>
    </div>
  );
}
