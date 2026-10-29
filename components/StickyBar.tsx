import type { SiteContent } from "@/content";
import { site } from "@/content/site";
import { telLink } from "@/lib/contact";
import { ChatIcon, NewTab, PhoneIcon, PinIcon } from "./ui";

/** Mobile only: call, WhatsApp (passive until a number exists, 57 U9), directions. Hidden while the menu is open. */
export function StickyBar({ c }: { c: SiteContent["common"] }) {
  return (
    <nav aria-label={c.stickyLabel} className="tp-sticky">
      <a href={telLink} className="tp-sticky-call">
        <PhoneIcon />
        <span>{c.call}</span>
      </a>
      {site.whatsapp ? null : (
        <span className="tp-sticky-pending">
          <ChatIcon />
          <span>{c.whatsapp}</span>
          <span className="tp-sticky-note">{c.whatsappPendingShort}</span>
        </span>
      )}
      <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer">
        <PinIcon />
        <span>{c.directionsShort}</span>
        <NewTab label={c.newTab} />
      </a>
    </nav>
  );
}
