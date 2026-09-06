import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Cryptographic Credential Verification',
  description:
    'Verify candidate qualifications, NSQF competency levels, and training certificates on the Ryyvora cryptographic ledger using unique SHA-256 credential hashes.',
  path: '/employer-verification',
  keywords: [
    'Employer Outcome Verification',
    'Candidate Credential Verification',
    'SHA-256 Skill Hash Verifier',
    'W3C Verifiable Credentials Ledger',
    'NSQF Competency Verification',
  ],
});

export default function EmployerVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
