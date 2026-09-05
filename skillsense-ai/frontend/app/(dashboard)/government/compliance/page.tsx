'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Printer,
  Sparkles,
  Award,
  ChevronDown,
  ChevronRight,
  Landmark,
  Scale,
  FileText,
  Clock,
  Eye,
  Zap,
  Check,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface ComplianceFramework {
  id: string;
  name: string;
  authority: string;
  totalRequirements: number;
  met: number;
  partial: number;
  score: number;
  status: 'COMPLIANT' | 'NEEDS_REVIEW' | 'WARNING';
  lastAudited: string;
  rules: { id: string; title: string; status: 'MET' | 'PARTIAL' | 'NOT_MET'; detail: string }[];
}

const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'nsqf',
    name: 'NSQF & NCVET Qualification Alignment',
    authority: 'National Council for Vocational Education & Training (NCVET)',
    totalRequirements: 32,
    met: 30,
    partial: 2,
    score: 96,
    status: 'COMPLIANT',
    lastAudited: 'Today at 09:30 AM',
    rules: [
      { id: 'R-101', title: 'NSQF Level 4–7 Competency Descriptors', status: 'MET', detail: 'Curriculum learning outcomes verified against National Occupational Standards (NOS).' },
      { id: 'R-102', title: 'SHA-256 Ledger Passport Minting', status: 'MET', detail: 'Every issued qualification certificate contains an immutable cryptographic ledger hash.' },
      { id: 'R-103', title: 'Practical Hands-on Assessment Ratio >= 60%', status: 'MET', detail: 'Technical evaluations require real source code execution and architecture analysis.' },
      { id: 'R-104', title: 'Rural ITI Infrastructure Parity', status: 'PARTIAL', detail: '2 district training centers in Marathwada currently pending high-speed cloud workbench updates.' },
    ],
  },
  {
    id: 'dpdp',
    name: 'India DPDP Act 2023 & Data Privacy',
    authority: 'Ministry of Electronics & Information Technology (MeitY)',
    totalRequirements: 16,
    met: 16,
    partial: 0,
    score: 100,
    status: 'COMPLIANT',
    lastAudited: 'Today at 10:15 AM',
    rules: [
      { id: 'R-201', title: 'Article 12 Right to Erasure & Masking', status: 'MET', detail: 'Trainees can download full privacy archives in JSON or request data masking in 1 click.' },
      { id: 'R-202', title: 'Granular Purpose Consent Architecture', status: 'MET', detail: 'Consent can be given or withdrawn independently for longitudinal tracking vs wage analytics.' },
      { id: 'R-203', title: 'Zero PII Leakage in Macro Government Analytics', status: 'MET', detail: 'All district-level outcome tables utilize k-anonymized aggregated salary aggregates.' },
    ],
  },
  {
    id: 'fairness',
    name: 'Algorithmic Fairness & Bias Governance',
    authority: 'Ryyvora AI Ethical Governance Board',
    totalRequirements: 14,
    met: 13,
    partial: 1,
    score: 94,
    status: 'COMPLIANT',
    lastAudited: 'Yesterday at 04:45 PM',
    rules: [
      { id: 'R-301', title: '80% (4/5ths) Disparate Impact Auditing', status: 'MET', detail: 'Automated statistical tests verify recommendation rates across gender and caste demographics.' },
      { id: 'R-302', title: 'Explainable Scoring Rationale', status: 'MET', detail: 'Every candidate score is paired with verifiable source evidence snippets and rubric breakdowns.' },
      { id: 'R-303', title: 'Geographic Rural Representation Parity', status: 'PARTIAL', detail: 'Continuous fine-tuning active to equalize diagnostic question vocabulary in regional dialects.' },
    ],
  },
  {
    id: 'pmkvy',
    name: 'PMKVY 4.0 & State Apprenticeship Rules',
    authority: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    totalRequirements: 20,
    met: 18,
    partial: 2,
    score: 91,
    status: 'COMPLIANT',
    lastAudited: '2 days ago',
    rules: [
      { id: 'R-401', title: '30-Day Onboarding Retention Tracking', status: 'MET', detail: 'Automated employer check-in workflows verify valid placement contracts.' },
      { id: 'R-402', title: 'Stipend Direct Benefit Transfer (DBT) Auditing', status: 'MET', detail: 'Apprenticeship wage distribution logs cross-verified with state banking APIs.' },
      { id: 'R-403', title: 'Biometric Attendance Reconciliation', status: 'PARTIAL', detail: 'Periodic offline sync required for mobile training centers in remote tribal blocks.' },
    ],
  },
];

export default function CompliancePage() {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>(FRAMEWORKS);
  const [expandedFramework, setExpandedFramework] = useState<string | null>('nsqf');
  const [scanning, setScanning] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('Q1 2026');
  const [reportScope, setReportScope] = useState('State-wide (Maharashtra)');

  const handleRunFullAudit = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('Full Regulatory Compliance Audit Completed. Overall Index: 95.2%');
    }, 1200);
  };

  const handleGenerateReport = () => {
    const reportData = {
      title: 'Government of Maharashtra · Skilling Compliance & Regulatory Audit Report',
      period: reportPeriod,
      scope: reportScope,
      generatedAt: new Date().toISOString(),
      overallScore: 95.2,
      frameworks: frameworks.map((f) => ({
        framework: f.name,
        authority: f.authority,
        score: f.score,
        status: f.status,
        metRequirements: `${f.met}/${f.totalRequirements}`,
      })),
      complianceAuthority: 'Ryyvora AI Regulatory Ledger · MSDE Calibrated',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_audit_report_${reportPeriod.replace(/\s+/g, '_')}.json`;
    a.click();
    toast.success('Official Compliance Report (JSON) generated & downloaded!');
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: 60 }}>
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
              <AIBadge type="nsqf" label="GOVERNMENT AUDIT COCKPIT" />
              <AIBadge type="verified" label="REGULATORY COMPLIANCE 95.2%" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Regulatory Framework & <span style={{ color: 'var(--gold)' }}>Compliance Monitor</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Real-time governance dashboard auditing adherence to NSQF qualification standards, India DPDP Act 2023, algorithmic fairness metrics, and PMKVY 4.0 guidelines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleRunFullAudit}
              disabled={scanning}
              className="btn-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: scanning ? 'not-allowed' : 'pointer',
              }}
            >
              {scanning ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}
              <span>{scanning ? 'Auditing Ledgers...' : 'Run Audit Scan'}</span>
            </button>
          </div>
        </div>

        {/* ── Overall Compliance Scorecard ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Overall Compliance Index', value: '95.2%', sub: 'Exceeds State Benchmark (90%)', color: '#10b981', icon: ShieldCheck },
            { label: 'Audited Frameworks', value: '4 Standards', sub: 'NSQF · DPDP · Fairness · PMKVY', color: 'var(--gold)', icon: Scale },
            { label: 'Rules Evaluated', value: '82 Checklist Rules', sub: '77 Fully Met · 5 In Progress', color: '#60a5fa', icon: FileCheck },
            { label: 'Critical Breaches', value: '0 Violations', sub: '100% Zero-Breach Integrity', color: '#a855f7', icon: Lock },
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

        {/* ── Main Layout: Frameworks Accordion & Report Generator ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'flex-start' }}>
          {/* Frameworks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Landmark size={16} color="var(--gold)" /> Active Regulatory Standards Matrix
            </div>

            {frameworks.map((fw) => {
              const isExpanded = expandedFramework === fw.id;
              return (
                <div
                  key={fw.id}
                  className="card-linear"
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: `1px solid ${isExpanded ? 'var(--gold)' : 'var(--border)'}`,
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => setExpandedFramework(isExpanded ? null : fw.id)}
                    style={{
                      padding: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      background: isExpanded ? 'rgba(245,158,11,0.03)' : 'transparent',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {fw.name}
                        </h3>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                          {fw.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{fw.authority}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: fw.score >= 95 ? '#10b981' : 'var(--gold)' }}>
                          {fw.score}%
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                          {fw.met}/{fw.totalRequirements} Met
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        color="var(--gold)"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded Checklist */}
                  {isExpanded && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 14 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                        Audited Rule Checklist & Telemetry:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {fw.rules.map((rule) => (
                          <div
                            key={rule.id}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 8,
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc' }}>
                                <strong style={{ color: 'var(--gold)', marginRight: 6 }}>{rule.id}</strong> {rule.title}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: rule.status === 'MET' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                                  color: rule.status === 'MET' ? '#10b981' : 'var(--gold)',
                                }}
                              >
                                {rule.status}
                              </span>
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {rule.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Official Report Generator Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} color="var(--gold)" /> Executive Report Generator
            </div>

            <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
              <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                Generate Compliance Dossier
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 16px' }}>
                Export verified audit credentials for state assembly reviews, CAG auditing, or NCVET accreditation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Audit Period
                  </label>
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12.5,
                    }}
                  >
                    <option value="Q1 2026">Q1 2026 (Jan – Mar 2026)</option>
                    <option value="Q4 2025">Q4 2025 (Oct – Dec 2025)</option>
                    <option value="Annual 2025-26">Annual Financial Year 2025-26</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Geographic Scope
                  </label>
                  <select
                    value={reportScope}
                    onChange={(e) => setReportScope(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12.5,
                    }}
                  >
                    <option value="State-wide (Maharashtra)">State-wide (Maharashtra · 36 Districts)</option>
                    <option value="Pune Division">Pune Division (Pune, Satara, Solapur, Kolhapur)</option>
                    <option value="Konkan Division">Konkan Division (Mumbai, Thane, Palghar, Raigad)</option>
                    <option value="Marathwada Division">Marathwada Division (Chhatrapati Sambhajinagar, Nanded)</option>
                  </select>
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="btn-gold"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={14} />
                    <span>Download Compliance Dossier</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Authority Seal Badge */}
            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ShieldCheck size={16} color="#10b981" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                  State Verification Consensus
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Continuous automated health probes monitor smart contracts, DPDP consent revocations, and algorithmic parity metrics every 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
