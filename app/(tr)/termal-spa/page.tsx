import { SpaPage } from "@/components/pages/SpaPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("tr", "spa");

export default function Page() {
  return <SpaPage locale="tr" />;
}
