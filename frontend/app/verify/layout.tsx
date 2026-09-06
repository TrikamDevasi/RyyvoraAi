import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cryptographic Credential Verification | Ryyvora AI',
  description: 'Cryptographic credential verification for student and trainee credentials on the Ryyvora immutable ledger.',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
