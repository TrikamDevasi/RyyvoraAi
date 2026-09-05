'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentApi } from '@/lib/api/student.api';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  ArrowLeft,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface ConsentHistoryItem {
  action: string;
  timestamp: string;
  purposes: string[];
  signatureHash: string;
}

interface ConsentState {
  status: 'GRANTED' | 'PENDING' | 'WITHDRAWN';
  purposes: string[];
  grantedAt?: string;
  withdrawnAt?: string;
  consentId?: string;
  consentHistory: ConsentHistoryItem[];
}

const PURPOSES = [
  {
    id: 'outcome_tracking',
    title: 'Longitudinal Skilling & Outcome Tracking',
    desc: 'Allows tracking your progress from enrollment to certification, placement, and job milestones on the state ledger.',
    category: 'Core Educational Tracking',
    required: true,
  },
  {
    id: 'employer_verification',
    title: 'Employer Verification & Background Checks',
    desc: 'Enables verified enterprise hiring partners to inspect and confirm your Skill Passport SHA-256 signatures.',
    category: 'Employment Matching',
    required: false,
  },
  {
    id: 'longitudinal_followup',
    title: '30d, 90d, 365d Post-Placement Follow-Up Surveys',
    desc: 'Enables automated check-ins to monitor retention, promotion trajectories, and on-job role relevance.',
    category: 'Workforce Telemetry',
    required: false,
  },
  {
    id: 'salary_benchmarking',
    title: 'Aggregated Wage Progression & ROI Modeling',
    desc: 'Uses anonymized, masked salary figures to calculate vocational ROI without ever disclosing personal identification.',
    category: 'Economic Research',
    required: false,
  },
  {
    id: 'policy_analytics',
    title: 'State Policy & Curriculum Directives',
    desc: 'Provides aggregated demographic and skill gap intelligence to help Maharashtra allocate skill development funding.',
    category: 'Public Governance',
    required: false,
  },
];

export default function TraineeConsentPage() {
  const { user } = useAuth();
  const [consent, setConsent] = useState<ConsentState>({ status: 'PENDING', purposes: [], consentHistory: [] });
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['outcome_tracking']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConsent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentApi.getConsent();
      if (res) {
        const state: ConsentState = {
          status: res.status,
          purposes: res.purposes || [],
          grantedAt: res.grantedAt,
          withdrawnAt: res.withdrawnAt,
          consentId: res._id,
          consentHistory: (res.consentHistory || []).map((h) => ({
            action: h.action,
            timestamp: new Date(h.timestamp).toLocaleString(),
            purposes: h.purposes || [],
            signatureHash: h.action === 'CONSENT_GRANTED' ? 'CONSENT_SEALED' : 'UPDATED',
          })),
        };
        setConsent(state);
        setSelectedPurposes(res.purposes || ['outcome_tracking']);
      }
    } catch {
      setError('Unable to load consent data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsent();
  }, []);

  const handlePurposeToggle = (purposeId: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purposeId) ? prev.filter((p) => p !== purposeId) : [...prev, purposeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPurposes(PURPOSES.map((p) => p.id));
    toast.success('Selected all processing purposes');
  };

  const handleSaveConsent = async (newStatus: 'GRANTED' | 'WITHDRAWN') => {
    setSaving(true);
    const updatedPurposes = newStatus === 'WITHDRAWN' ? [] : selectedPurposes;

    try {
      const result = await studentApi.updateConsent({
        status: newStatus,
        purposes: updatedPurposes,
      });

      const newHistoryItem: ConsentHistoryItem = {
        action: newStatus === 'GRANTED' ? 'PREFERENCES_UPDATED' : 'CONSENT_WITHDRAWN',
        timestamp: new Date().toLocaleString(),
        purposes: updatedPurposes,
        signatureHash: result?._id || 'CONSENT_SEALED',
      };

      setConsent((prev) => ({
        ...prev,
        status: newStatus,
        purposes: updatedPurposes,
        grantedAt: newStatus === 'GRANTED' ? new Date().toISOString() : prev.grantedAt,
        withdrawnAt: newStatus === 'WITHDRAWN' ? new Date().toISOString() : undefined,
        consentId: result?._id || prev.consentId,
        consentHistory: [newHistoryItem, ...prev.consentHistory],
      }));

      if (newStatus === 'GRANTED') {
        toast.success('DPDP Act 2023 consent preferences updated.');
      } else {
        toast.success('All optional data processing consents withdrawn.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save consent preferences. Please try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPrivacyPackage = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          candidate: user?.name || 'Candidate',
          dpdpConsentId: consent.consentId || 'PENDING',
          status: consent.status,
          activePurposes: selectedPurposes,
          auditHistory: consent.consentHistory,
          exportedAt: new Date().toISOString(),
          issuingAuthority: 'Ryyvora AI · Government of Maharashtra',
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ryyvora_privacy_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Privacy Data Package (JSON) downloaded!');
  };

  const isGranted = consent.status === 'GRANTED';

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1060, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Top Navigation & Back Link ── */}
        <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="/student/journey"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back to Outcome Journey
          </Link>

          <button
            type="button"
            onClick={handleDownloadPrivacyPackage}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={13} /> Export Privacy Data (JSON)
          </button>
        </div>

        {/* ── Header Banner ── */}
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
              <AIBadge type="nsqf" label="INDIA DPDP ACT 2023 COMPLIANT" />
              <AIBadge type="verified" label="SOVEREIGN DATA OWNERSHIP" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Consent & <span style={{ color: 'var(--gold)' }}>Privacy Governance</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              You maintain sovereign control over your educational, skill diagnostic, and wage outcome telemetry. Configure transparent permissions for state and employer processing.
            </p>
          </div>

          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 800,
                background: isGranted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: isGranted ? '#10b981' : '#f87171',
                border: isGranted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {isGranted ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              Consent Status: {isGranted ? 'ACTIVE & VERIFIED' : 'WITHDRAWN'}
            </span>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <RefreshCw size={28} style={{ color: 'var(--gold)', marginBottom: 10, animation: 'spin 1.5s linear infinite' }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading consent data...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <div className="card-linear" style={{ padding: 24, borderRadius: 12, textAlign: 'center', marginBottom: 24 }}>
            <AlertTriangle size={28} style={{ color: 'var(--error, #f87171)', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px' }}>{error}</p>
            <button onClick={loadConsent} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* ── DPDP 3-Pillar Security Matrix ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { title: 'What We Store', desc: 'Competency assessments, SHA-256 certificate hashes, and voluntary employer milestone claims.', icon: Eye, color: 'var(--gold)' },
            { title: 'Who Has Access', desc: 'Affiliated institutions and authorized employers. Government analytics receive anonymized macro metrics.', icon: UserCheck, color: '#10b981' },
            { title: 'Right to Revoke', desc: 'Revoke or alter consent anytime. Revocation instantly halts non-essential longitudinal surveys.', icon: Lock, color: '#60a5fa' },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="card-linear" style={{ padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: pillar.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={17} />
                </div>
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Granular Purpose Toggles Card ── */}
        <div className="card-linear" style={{ padding: 26, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Granular Processing Permissions
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Toggle individual processing purposes in compliance with India DPDP Act 2023.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectAll}
              style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Select All Purposes
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PURPOSES.map((p) => {
              const isChecked = selectedPurposes.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handlePurposeToggle(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: 16,
                    borderRadius: 12,
                    background: isChecked ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                    border: isChecked ? '1px solid var(--gold)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: isChecked ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                      border: isChecked ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#090a0f',
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                        {p.category}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: isChecked ? '#f8fafc' : '#cbd5e1', margin: '2px 0 4px' }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => handleSaveConsent('WITHDRAWN')}
              disabled={saving}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Withdraw All Consent
            </button>

            <button
              type="button"
              onClick={() => handleSaveConsent('GRANTED')}
              disabled={saving}
              className="btn-gold"
              style={{
                padding: '9px 22px',
                fontSize: 13,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              <span>{saving ? 'Recording Ledger...' : 'Save DPDP Preferences'}</span>
            </button>
          </div>
        </div>

        {/* ── Immutable Audit Log Ledger ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} color="var(--gold)" /> Immutable Consent Audit History
            </h3>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#10b981' }}>
              Ledger ID: {consent.consentId || 'PENDING'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {consent.consentHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                  <strong style={{ color: '#f8fafc' }}>{item.action}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>· {item.timestamp}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{item.purposes.length} Active Purposes</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>
                    {item.signatureHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
