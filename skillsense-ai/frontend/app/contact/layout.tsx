import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Institutional Partnerships Team',
  description:
    'Connect with Ryyvora AI specialists for enterprise pilot onboarding, state government consultations, training institute partnerships, and technical inquiries.',
  path: '/contact',
  keywords: [
    'Contact Ryyvora AI',
    'Workforce Platform Partnerships',
    'Institutional Pilot Onboarding',
    'Directorate Skilling Consultation',
    'Support Ryyvora',
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
