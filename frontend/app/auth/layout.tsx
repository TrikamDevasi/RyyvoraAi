import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sign In | Ryyvora AI',
  description: 'Sign in to your Ryyvora AI workforce outcome intelligence workspace.',
  alternates: {
    canonical: getCanonicalUrl('/auth'),
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
  keywords: [
    'Ryyvora AI',
    'Sign In',
    'Workforce Outcome Intelligence',
    'Enterprise Authentication',
    'Skill Passport',
    'DPDP Compliance',
  ],
  openGraph: {
    title: 'Sign In | Ryyvora AI',
    description: 'Sign in to your Ryyvora AI workforce outcome intelligence workspace.',
    type: 'website',
    url: getCanonicalUrl('/auth'),
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Ryyvora AI',
    description: 'Sign in to your Ryyvora AI workforce outcome intelligence workspace.',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
