import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Manrope, Outfit } from "next/font/google";
import "./globals.css";
import SplashScreen from "../components/SplashScreen";
import ChatWidgetLoader from "../components/ChatWidgetLoader";
import ThemeScript from "../components/shared/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import { SITE_CONFIG } from "../lib/seo";
import { OrganizationJsonLd, WebSiteJsonLd } from "../components/seo/JsonLd";

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Workforce Outcome Intelligence | Ryyvora AI",
    template: "%s | Ryyvora AI",
  },
  description:
    "Ryyvora AI connects training, certification, employment, verification, retention and workforce outcomes into one intelligence platform.",
  keywords: [
    "Ryyvora AI",
    "Workforce Outcome Intelligence",
    "Skill Assessment",
    "Outcome Verification",
    "Skill Passport",
    "Labor Market Analytics",
    "Workforce Policy Intelligence",
  ],
  authors: [{ name: "Ryyvora AI Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/app-icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/app-icons/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Ryyvora AI",
    url: SITE_CONFIG.url,
    title: "Ryyvora AI | Workforce Outcome Intelligence",
    description:
      "Ryyvora AI connects training, certification, employment, verification, retention and workforce outcomes into one intelligence platform.",
    images: [
      {
        url: `${SITE_CONFIG.url}/brand/ryyvora-og.png`,
        width: 1200,
        height: 630,
        alt: "Ryyvora AI — Workforce Outcome Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryyvora AI | Workforce Outcome Intelligence",
    description: "From Skills to Sustainable Outcomes. Enterprise & Government Workforce Outcome Intelligence.",
    images: [`${SITE_CONFIG.url}/brand/ryyvora-og.png`],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ryyvora AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${manrope.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <SplashScreen>{children}</SplashScreen>
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
