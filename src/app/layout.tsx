import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="de"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overscroll-none">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
