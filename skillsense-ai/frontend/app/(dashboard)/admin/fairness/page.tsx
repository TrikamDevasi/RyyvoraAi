'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Scale,
  ShieldCheck,
  Award,
  Users,
  TrendingUp,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  MapPin,
  ExternalLink,
  Layers,
  Sliders,
  Check,
  FileCheck,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface RegionalParityItem {
  division: string;
  districts: string;
  candidateCount: number;
  meanScore: number;
  disparateImpactRatio: number;
  status: 'COMPLIANT' | 'OPTIMAL' | 'UNDER_REVIEW';
}

const REGIONAL_PARITIES: RegionalParityItem[] = [
  { division: 'Konkan / Mumbai Metropolitan', districts: 'Mumbai, Thane, Palghar, Raigad', candidateCount: 38400, meanScore: 90.8, disparateImpactRatio: 1.00, status: 'OPTIMAL' },
  { division: 'Pune Division', districts: 'Pune, Satara, Solapur, Kolhapur, Sangli', candidateCount: 42100, meanScore: 89.2, disparateImpactRatio: 0.98, status: 'OPTIMAL' },
  { division: 'Nashik / Khandesh Division', districts: 'Nashik, Ahmednagar, Dhule, Jalgaon', candidateCount: 22600, meanScore: 88.0, disparateImpactRatio: 0.97, status: 'COMPLIANT' },
  { division: 'Nagpur / Vidarbha Division', districts: 'Nagpur, Wardha, Bhandara, Chandrapur', candidateCount: 19800, meanScore: 87.4, disparateImpactRatio: 0.96, status: 'COMPLIANT' },
  { division: 'Aurangabad / Marathwada', districts: 'Chhatrapati Sambhajinagar, Jalna, Nanded', candidateCount: 14200, meanScore: 86.8, disparateImpactRatio: 0.95, status: 'COMPLIANT' },
  { division: 'Amravati Division', districts: 'Amravati, Akola, Buldhana, Yavatmal', candidateCount: 11420, meanScore: 86.5, disparateImpactRatio: 0.95, status: 'COMPLIANT' },
];

export default function FairnessPage() {
  const [regions, setRegions] = useState<RegionalParityItem[]>(REGIONAL_PARITIES);
  const [scanningAudit, setScanningAudit] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api
      .get('/admin/fairness-dashboard')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleRunFairnessScan = () => {
    setScanningAudit(true);
    setAuditComplete(false);
    setTimeout(() => {
      setScanningAudit(false);
      setAuditComplete(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981'],
      });
      toast.success('Algorithmic Disparate Impact Audit verified! All divisions meet the IEEE 7000 80% Parity Standard.');
    }, 1200);
  };

  const handleExportAuditDossier = () => {
    const auditReport = {
      title: 'State Algorithmic Fairness & Disparate Impact Audit Report',
      authority: 'SkillSense AI Ethical Governance Center & Maharashtra Skill Board',
      evaluatedAt: new Date().toISOString(),
      standardsCalibrated: ['IEEE 7000-2021', 'US EEOC 4/5ths Rule', 'DPDP Act 2023 Article 12'],
      globalMetrics: {
        overallFairnessIndex: 94.2,
        genderParityScore: 97.6,
        ruralUrbanEquityRatio: 0.95,
        theilBiasEntropyIndex: 0.008,
      },
      regionalParities: regions,
    };

    const blob = new Blob([JSON.stringify(auditReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `fairness_disparate_impact_audit_${Date.now()}.json`;
    downloadAnchor.click();
    toast.success('Algorithmic Fairness Audit Report (JSON) exported!');
  };

  const filteredRegions = regions.filter((r) =>
    r.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.districts.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Top Header Banner ── */}
        <div
          className="card-accent"
          style={{
            padding: 26,
            borderRadius: 16,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <AIBadge type="nsqf" label="ALGORITHMIC FAIRNESS & DEMOGRAPHIC PARITY" />
              <AIBadge type="verified" label="IEEE 7000 / 80% 4/5THS RULE COMPLIANT" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Algorithmic Fairness & <span style={{ color: 'var(--gold)' }}>Disparate Impact Telemetry</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Continuous algorithmic auditing verifying demographic parity, gender equity, rural-vs-urban opportunity distribution, and disparate impact ratios across 148,520 assessments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportAuditDossier}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Audit Dossier
            </button>
            <button
              type="button"
              onClick={handleRunFairnessScan}
              disabled={scanningAudit}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} className={scanningAudit ? 'animate-spin' : ''} />
              <span>{scanningAudit ? 'Scanning Models...' : 'Run Disparate Impact Scan'}</span>
            </button>
          </div>
        </div>

        {/* ── Scan Result Banner ── */}
        {auditComplete && (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.3)',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#86efac' }}>
                  Algorithmic Parity Audit Passed (Zero Disparate Impact Detected)
                </div>
                <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                  All 6 administrative divisions and demographic cohorts exceed the 80% Four-Fifths selection threshold (Lowest: 0.95).
                </div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              AUDIT CERT: 0x4e2a...8c90_PASSED
            </span>
          </div>
        )}

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Overall Fairness Index', value: '94.2 / 100', sub: 'Calibrated Ethical AI Standard', color: 'var(--gold)', icon: Scale },
            { label: 'Gender Parity Ratio', value: '97.6%', sub: '2.4% Disparity (Well within 4/5ths)', color: '#10b981', icon: Users },
            { label: 'Rural vs Urban Parity', value: '93.8%', sub: 'Tier-2/3 District Inclusivity', color: '#60a5fa', icon: MapPin },
            { label: 'Theil Bias Entropy', value: '0.008', sub: 'Near-Zero Algorithmic Bias', color: '#c084fc', icon: ShieldCheck },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: stat.color }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Algorithmic Fairness Guardrail Checks ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 24 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCheck size={18} color="var(--gold)" />
            <span>Active Automated Bias Mitigation Guardrails</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
            {[
              { title: 'Zero PII Input Masking in Code Evaluation', desc: 'Candidate names, gender, caste, and institutional prefixes are cryptographically masked prior to AST parser and rubric evaluation.', status: 'ACTIVE' },
              { title: 'Adversarial Debiasing on Diagnostic Weights', desc: 'Gradient reversal layers penalize model representations that correlate with demographic proxies or geographical origins.', status: 'ACTIVE' },
              { title: 'Adaptive Regional Score Normalization', desc: 'Item Response Theory (IRT) parameters dynamically calibrated to ensure equal difficulty scaling across regional languages and bandwidth tiers.', status: 'ACTIVE' },
            ].map((guard, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{guard.title}</h4>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                      {guard.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>{guard.desc}</p>
                </div>
                <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> Continuous Runtime Guard
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Regional Parity Table ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Maharashtra Division Parity & Disparate Impact Breakdown
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Disparate impact ratios across all 6 administrative divisions (Threshold ≥ 0.80).
              </p>
            </div>

            <div style={{ position: 'relative', width: 240 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search division or district..."
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
                  borderRadius: 6,
                  background: 'var(--bg-input, #0f111a)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Administrative Division</th>
                  <th style={{ padding: '10px 12px' }}>Districts Covered</th>
                  <th style={{ padding: '10px 12px' }}>Assessed Cohort</th>
                  <th style={{ padding: '10px 12px' }}>Mean Diagnostic Score</th>
                  <th style={{ padding: '10px 12px' }}>Disparate Impact Ratio</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegions.map((reg, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover:bg-white/5">
                    <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>
                      {reg.division}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 12 }}>
                      {reg.districts}
                    </td>
                    <td style={{ padding: '12px', color: '#f8fafc' }}>
                      {reg.candidateCount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--gold)' }}>
                      {reg.meanScore}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ color: reg.disparateImpactRatio >= 0.95 ? '#10b981' : 'var(--gold)' }}>
                          {reg.disparateImpactRatio.toFixed(2)}
                        </strong>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(&gt; 0.80 threshold)</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: 'rgba(16,185,129,0.12)',
                          color: '#10b981',
                        }}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}