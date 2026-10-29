import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("en", "contact");

export default function Page() {
  return <ContactPage locale="en" />;
}
