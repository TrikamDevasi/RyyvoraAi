import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System AI Health & Telemetry | Ryyvora AI',
  description: 'Internal diagnostic health checks for multi-provider AI model telemetry.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AIHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
