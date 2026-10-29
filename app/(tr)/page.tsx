import { HomePage } from "@/components/pages/HomePage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("tr", "home");

export default function Page() {
  return <HomePage locale="tr" />;
}
