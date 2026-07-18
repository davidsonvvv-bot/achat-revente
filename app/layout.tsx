import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "Parc",
  description: "Gestion d'achat-revente automobile",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Parc" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f7f7f5" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr"><body><AppProviders>{children}</AppProviders></body></html>;
}
