import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SkillSense AI — Measuring Skills, Predicting Futures",
  description:
    "AI-powered skill gap analysis, verifiable Skill Passports, career matching, and national workforce intelligence for India's IT and software engineering ecosystem.",
  keywords: [
    "AI Career Counselor",
    "Skill Assessment",
    "Next.js",
    "Career Prediction",
    "Market Trends",
    "Verifiable Credentials",
    "Skill Passport",
  ],
  authors: [{ name: "SkillSense Team" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://skillsense-ai.vercel.app",
    title: "SkillSense AI — Measuring Skills, Predicting Futures",
    description:
      "AI-powered skill gap analysis, verifiable Skill Passports, and career matching for the modern workforce.",
    images: [
      {
        url: "https://skillsense-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkillSense AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSense AI",
    description: "AI-powered skill gap analysis and career matching.",
    images: ["https://skillsense-ai.vercel.app/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkillSense AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
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
