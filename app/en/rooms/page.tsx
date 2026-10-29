import { RoomsPage } from "@/components/pages/RoomsPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("en", "rooms");

export default function Page() {
  return <RoomsPage locale="en" />;
}
