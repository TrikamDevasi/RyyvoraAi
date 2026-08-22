'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MarketIntelligence = dynamic(() => import('@/components/dashboard/MarketIntelligence'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-2xl" />,
    ssr: false,
});

export default function MarketPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <MarketIntelligence />
        </div>
    );
}
