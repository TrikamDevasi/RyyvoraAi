import type { Metadata, Viewport } from "next";
import "./globals.css";
import SplashScreen from "../components/SplashScreen";
import ChatWidgetLoader from "../components/ChatWidgetLoader";

export const viewport: Viewport = {
    themeColor: "#D4A843",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "SkillSense AI — Measuring Skills, Predicting Futures",
    description:
        "AI-powered skill gap analysis, verifiable Skill Passports, career matching, and national workforce intelligence for India's IT and software engineering ecosystem.",
    keywords: ["AI Career Counselor", "Skill Assessment", "Next.js", "Career Prediction", "Market Trends", "Verifiable Credentials", "Skill Passport"],
    authors: [{ name: "SkillSense Team" }],
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://skillsense-ai.vercel.app",
        title: "SkillSense AI — Measuring Skills, Predicting Futures",
        description: "AI-powered skill gap analysis, verifiable Skill Passports, and career matching for the modern workforce.",
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
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <SplashScreen>{children}</SplashScreen>
                <ChatWidgetLoader />
            </body>
        </html>
    );
}
