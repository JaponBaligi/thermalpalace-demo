import { HomePage } from "@/components/pages/HomePage";
import { pageMetadata } from "@/components/LocaleShell";

export const metadata = pageMetadata("en", "home");

export default function Page() {
  return <HomePage locale="en" />;
}
