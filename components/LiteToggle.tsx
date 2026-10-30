"use client";

import { useSyncExternalStore } from "react";
import { EDITION } from "@/content/site";
import { getLitePreference, setLitePreference } from "@/lib/quality";

const subscribe = () => () => {};

/** Footer switch for the stored LITE preference (56 §6.2). Reloads so the quality is resolved from scratch. */
export function LiteToggle({ label, on, off }: { label: string; on: string; off: string }) {
  const lite = useSyncExternalStore(subscribe, getLitePreference, () => false);
  if (EDITION === "business") return null;
  return (
    <button
      type="button"
      className="tp-lite-toggle"
      aria-pressed={lite}
      onClick={() => {
        setLitePreference(!lite);
        window.location.reload();
      }}
    >
      <span>{label}</span>
      <span className="tp-lite-state" aria-hidden="true">
        {lite ? on : off}
      </span>
    </button>
  );
}
