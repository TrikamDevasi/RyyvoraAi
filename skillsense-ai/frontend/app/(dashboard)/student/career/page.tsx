'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Compass, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { AIInsightCard } from '@/components/ui/AIInsightCard';

const CareerPredictor = dynamic(() => import('@/components/dashboard/CareerPredictor'), {
  loading: () => <div className="h-80 w-full animate-pulse-slow bg-white/5 rounded-xl border border-white/5" />,
  ssr: false,
});

export default function CareerPage() {
  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AIBadge type="ai" label="PREDICTIVE CAREER ENGINE" />
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Career Pathways & Workforce Alignment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
            AI-matched career trajectories calibrated against your evaluated NSQF skill profile and hiring signals across India.
          </p>
        </div>

        <CareerPredictor />

        <div style={{ marginTop: 28 }}>
          <AIInsightCard
            title="Precision Workforce Calibration"
            badgeText="AI METHODOLOGY"
            insight="SkillSense neural matching compares student capability across 50+ granular competency dimensions against real-time job market requisitions from top Indian industry leaders across core engineering, manufacturing, and tech sectors (Tata Motors, L&T, Qualcomm, Biocon, TCS, Infosys) to predict the most viable high-growth trajectories."
            category="Algorithmic Matching"
          />
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
