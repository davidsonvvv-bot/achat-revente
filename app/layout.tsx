import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = { title: "Parc", description: "Gestion d'achat-revente automobile" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr"><body><AppProviders>{children}</AppProviders></body></html>;
}
