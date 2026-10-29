import { RoomsPage } from "@/components/pages/RoomsPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("tr", "rooms");

export default function Page() {
  return <RoomsPage locale="tr" />;
}
