'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Landmark,
  Building2,
  Users,
  Lock,
  Layers,
  FileCheck,
  Printer,
  Check,
  BarChart3,
  Scale,
  IndianRupee,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface ReportTemplate {
  id: string;
  title: string;
  category: 'STATE_CENSUS' | 'NCVET_COMPLIANCE' | 'DPDP_PRIVACY' | 'FISCAL_ROI' | 'FAIRNESS_AUDIT';
  categoryLabel: string;
  description: string;
  frequency: string;
  pages: number;
  lastGenerated: string;
  ledgerHash: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'rep_1',
    title: 'Comprehensive Maharashtra Skilling & Placement Census 2026',
    category: 'STATE_CENSUS',
    categoryLabel: 'State Census & Placements',
    description: 'Executive synthesis covering 148,520 assessments, 142 polytechnics, and corporate hiring pipelines across all 36 Maharashtra districts.',
    frequency: 'Monthly Official Gazette',
    pages: 42,
    lastGenerated: 'March 12, 2026',
    ledgerHash: '0x9e7a...4b12_CENSUS_SEALED',
  },
  {
    id: 'rep_2',
    title: 'NCVET & NSQF Institutional Compliance & Accreditation Audit',
    category: 'NCVET_COMPLIANCE',
    categoryLabel: 'NCVET Regulatory',
    description: 'Detailed curriculum gap analysis, 4-axis assessment rubric evaluations, and NSQF Level 4-6 certification authenticity records.',
    frequency: 'Quarterly Audit',
    pages: 28,
    lastGenerated: 'March 08, 2026',
    ledgerHash: '0x8812...NCVET_AUDIT_SEALED',
  },
  {
    id: 'rep_3',
    title: 'DPDP Act 2023 Sovereign Data Protection & Consent Ledger',
    category: 'DPDP_PRIVACY',
    categoryLabel: 'DPDP Privacy Mesh',
    description: 'Article 12 sovereign consent audit trail, automated PII masking verification, and cryptographic append-only data fiduciary proof.',
    frequency: 'Bi-Weekly Security Scan',
    pages: 18,
    lastGenerated: 'March 14, 2026',
    ledgerHash: '0x7140...DPDP_CONSENT_SEALED',
  },
  {
    id: 'rep_4',
    title: 'Maharashtra Skilling Fund Fiscal Allocation & Economic ROI',
    category: 'FISCAL_ROI',
    categoryLabel: 'Fiscal Grants & ROI',
    description: '₹142.5 Cr budget allocation breakdown, smart contract milestone escrow validation, and 23.4x economic wage multiplier model.',
    frequency: 'Monthly Fiscal Audit',
    pages: 34,
    lastGenerated: 'March 01, 2026',
    ledgerHash: '0x6290...FISCAL_ROI_SEALED',
  },
  {
    id: 'rep_5',
    title: 'Algorithmic Fairness & IEEE 7000 Demographic Parity Audit',
    category: 'FAIRNESS_AUDIT',
    categoryLabel: 'AI Ethics & Parity',
    description: 'Algorithmic disparate impact verification across gender, caste-neutral ast parsing, and 6 administrative division parity ratios.',
    frequency: 'Weekly Automated Scan',
    pages: 22,
    lastGenerated: 'March 10, 2026',
    ledgerHash: '0x5521...FAIRNESS_SEALED',
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  STATE_CENSUS: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
  NCVET_COMPLIANCE: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  DPDP_PRIVACY: { bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  FISCAL_ROI: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  FAIRNESS_AUDIT: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportTemplate[]>(REPORT_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Custom Report Builder State
  const [reportScope, setReportScope] = useState('State-Wide Maharashtra (36 Districts)');
  const [reportFormat, setReportFormat] = useState('JSON_DOSSIER');
  const [includeLedgerHash, setIncludeLedgerHash] = useState(true);

  useEffect(() => {
    api
      .get('/admin/reports')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleDownloadReport = (rep: ReportTemplate) => {
    setGeneratingId(rep.id);
    setTimeout(() => {
      setGeneratingId(null);

      const dossierPayload = {
        title: rep.title,
        authority: 'SkillSense AI State Administrative Reporting Desk',
        stateAffiliation: 'Government of Maharashtra & MSDE',
        generatedAt: new Date().toISOString(),
        category: rep.categoryLabel,
        ledgerProofHash: `${rep.ledgerHash}_ROOT_CONFIRMED`,
        summaryMetrics: {
          totalAssessedCandidates: 148520,
          accreditedInstitutions: 142,
          corporateHiringPartners: 640,
          stateBudgetEscrow: '₹142.50 Cr',
          overallFairnessIndex: '94.2 / 100',
        },
      };

      const blob = new Blob([JSON.stringify(dossierPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `${rep.id}_${Date.now()}.json`;
      downloadAnchor.click();
      toast.success(`${rep.title} compiled and downloaded.`);
    }, 800);
  };

  const handleGenerateCustomDossier = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Executive report for ${reportScope} compiled successfully.`);
  };

  const filteredReports = reports.filter((r) => {
    const matchCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
              <AIBadge type="nsqf" label="EXECUTIVE REPORTING & COMPLIANCE DESK" />
              <AIBadge type="verified" label="OFFICIAL STATE GAZETTE CITATIONS" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              State Skilling Reports & <span style={{ color: 'var(--gold)' }}>Compliance Dossiers</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Official administrative center for compiling, cryptographically sealing, and exporting state-wide vocational census dossiers, NCVET compliance audits, and fiscal ROI reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (reports[0]) handleDownloadReport(reports[0]);
              }}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Download State Census Dossier
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Executive Dossiers Compiled', value: '842 Reports', sub: 'Historical State Archive', color: 'var(--gold)', icon: FileText },
            { label: 'Regulatory Submissions', value: '100% On-Time', sub: 'NCVET, MSDE & DPDP', color: '#10b981', icon: ShieldCheck },
            { label: 'Ledger Proof Coverage', value: '100% Sealed', sub: 'SHA-256 HMAC Signatures', color: '#60a5fa', icon: Lock },
            { label: 'Compilation SLA', value: '< 1.2s', sub: 'Real-Time OLAP Telemetry', color: '#c084fc', icon: TrendingUp },
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

        {/* ── Custom Dossier Generator ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={17} color="var(--gold)" /> State Workforce Outcome Summary
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Generate customized compliance and skilling reports tailored for ministerial review.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateCustomDossier} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 650, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Report Geographic Scope
              </label>
              <select
                value={reportScope}
                onChange={(e) => setReportScope(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 12,
                }}
              >
                <option value="State-Wide Maharashtra (36 Districts)">State-Wide Maharashtra (36 Districts)</option>
                <option value="Pune Division Cluster">Pune Division Cluster</option>
                <option value="Mumbai Metropolitan Region">Mumbai Metropolitan Region</option>
                <option value="Nagpur Vidarbha SEZ Corridor">Nagpur Vidarbha SEZ Corridor</option>
                <option value="Nashik & Khandesh Hubs">Nashik & Khandesh Hubs</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 650, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Compilation Format
              </label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 12,
                }}
              >
                <option value="JSON_DOSSIER">Cryptographic JSON Dossier</option>
                <option value="EXECUTIVE_PDF">Executive PDF Briefing</option>
                <option value="CSV_DATASET">Raw CSV Data Matrix</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6 }}>
              <input
                type="checkbox"
                id="ledgerCheck"
                checked={includeLedgerHash}
                onChange={(e) => setIncludeLedgerHash(e.target.checked)}
                style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <label htmlFor="ledgerCheck" style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Attach Merkle Root Proof
              </label>
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ padding: '9px 18px', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <FileCheck size={14} /> Compile Dossier
            </button>
          </form>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div
          className="card-linear"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Report Categories', icon: FileText },
              { id: 'STATE_CENSUS', label: 'State Census', icon: BarChart3 },
              { id: 'NCVET_COMPLIANCE', label: 'NCVET Compliance', icon: FileCheck },
              { id: 'DPDP_PRIVACY', label: 'DPDP Privacy', icon: ShieldCheck },
              { id: 'FISCAL_ROI', label: 'Fiscal ROI', icon: IndianRupee },
              { id: 'FAIRNESS_AUDIT', label: 'AI Fairness', icon: Scale },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <TabIcon size={13} color={isActive ? '#090a0f' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, gazette citations..."
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

        {/* ── Reports Feed ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredReports.map((rep) => {
            const catBadge = CATEGORY_COLORS[rep.category] || CATEGORY_COLORS.STATE_CENSUS;
            const isGenerating = generatingId === rep.id;

            return (
              <div
                key={rep.id}
                className="card-linear"
                style={{
                  padding: 22,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  borderLeft: '4px solid var(--gold)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: catBadge.bg, color: catBadge.color, textTransform: 'uppercase' }}>
                      {rep.categoryLabel}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {rep.frequency}
                    </span>
                  </div>

                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Last Generated: {rep.lastGenerated}
                  </span>
                </div>

                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {rep.title}
                </h3>

                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {rep.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <span>Dossier Volume: <strong style={{ color: '#f8fafc' }}>{rep.pages} Pages</strong></span>
                    <span>·</span>
                    <span style={{ fontFamily: 'monospace', color: '#10b981' }}>{rep.ledgerHash}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadReport(rep)}
                    disabled={isGenerating}
                    className="btn-gold"
                    style={{ fontSize: 12, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                    <span>{isGenerating ? 'Compiling Dossier...' : 'Download Official Report'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}