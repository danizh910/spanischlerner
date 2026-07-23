import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SyncManager } from "@/components/SyncManager";
import "./globals.css";

// Self-hosted via next/font (downloaded at build time, served from our own
// origin) - no external/CDN request at runtime. Sole typeface for the app.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Spanischlerner",
  description: "Spanisch lernen: Vokabeln mit Spaced Repetition und Satzbaukasten.",
  appleWebApp: {
    // iOS ignores manifest.json for "Zum Home-Bildschirm" - these tags (plus
    // src/app/apple-icon.png) are what make it install as a standalone app
    // with a proper icon and title instead of a plain Safari bookmark.
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Spanisch",
  },
  other: {
    // Next only emits the modern "mobile-web-app-capable" tag; Safari
    // (including older iOS versions) still keys off the legacy vendor-
    // prefixed one, so set it explicitly too.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text overscroll-none">
        {children}
        <ServiceWorkerRegister />
        <SyncManager />
      </body>
    </html>
  );
}
