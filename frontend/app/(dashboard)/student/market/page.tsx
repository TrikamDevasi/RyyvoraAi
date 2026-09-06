'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const MarketIntelligence = dynamic(() => import('@/components/dashboard/MarketIntelligence'), {
  loading: () => <div className="h-80 w-full animate-pulse-slow bg-white/5 rounded-xl border border-white/5" />,
  ssr: false,
});

export default function MarketPage() {
  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1040, margin: '0 auto' }}>
        <MarketIntelligence />
      </FadeIn>
    </ErrorBoundary>
  );
}
