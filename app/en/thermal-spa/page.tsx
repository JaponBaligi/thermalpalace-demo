import { SpaPage } from "@/components/pages/SpaPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("en", "spa");

export default function Page() {
  return <SpaPage locale="en" />;
}
