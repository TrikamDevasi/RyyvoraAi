import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessment Session | Ryyvora AI',
  description: 'Active diagnostic testing and skill evaluation session.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
