import { CreditsPage, creditsMetadata } from "@/components/pages/CreditsPage";

export const metadata = creditsMetadata("en");

export default function Page() {
  return <CreditsPage locale="en" />;
}
