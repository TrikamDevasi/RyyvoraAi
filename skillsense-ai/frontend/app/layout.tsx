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

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Ryyvora AI | Workforce Outcome Intelligence",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Ryyvora AI",
    url: "https://skillsense-ai.vercel.app",
    title: "Ryyvora AI | Workforce Outcome Intelligence",
    description:
      "Ryyvora AI connects training, certification, employment, verification, retention and workforce outcomes into one intelligence platform.",
    images: [
      {
        url: "https://skillsense-ai.vercel.app/og-image.png",
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
    images: ["https://skillsense-ai.vercel.app/og-image.png"],
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
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <SplashScreen>{children}</SplashScreen>
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
