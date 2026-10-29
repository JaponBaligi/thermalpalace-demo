import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("tr", "contact");

export default function Page() {
  return <ContactPage locale="tr" />;
}
