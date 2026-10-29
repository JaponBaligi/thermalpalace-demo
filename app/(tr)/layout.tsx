import type { ReactNode } from "react";
import type { Viewport } from "next";
import { LocaleShell, shellViewport } from "@/components/LocaleShell";

export const viewport: Viewport = shellViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <LocaleShell locale="tr">{children}</LocaleShell>;
}
