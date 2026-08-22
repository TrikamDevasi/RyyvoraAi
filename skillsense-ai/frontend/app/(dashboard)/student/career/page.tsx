'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Rocket } from 'lucide-react';

const CareerPredictor = dynamic(() => import('@/components/dashboard/CareerPredictor'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-2xl" />,
    ssr: false,
});

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function CareerPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 960 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                    <Rocket size={32} style={{ color: GOLD, marginRight: 12 }} /> Career <span style={{ color: GOLD, marginLeft: 8 }}>Pathways</span>
                </h1>
                <p style={{ margin: '8px 0 0', color: MUTED, fontSize: 16 }}>
                    AI-matched career trajectories based on your skill profile and market demand
                </p>
            </div>

            <CareerPredictor />

            {/* AI insight banner - Moved below predictor or integrated */}
            <div
                style={{
                    padding: '20px',
                    background: 'rgba(212,168,67,0.05)',
                    border: '1px solid rgba(212,168,67,0.2)',
                    borderRadius: 16,
                    marginTop: 48,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                }}
            >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,168,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: GOLD }}>AI</span>
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: WHITE }}>
                        Precision Career Mapping
                    </h3>
                    <p style={{ margin: '6px 0 0', fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
                        Our AI analyzes your skills across 50+ dimensions and matches them with real-time job market data 
                        to provide the most accurate career recommendations and specific growth roadmaps.
                    </p>
                </div>
            </div>
        </div>
    );
}
