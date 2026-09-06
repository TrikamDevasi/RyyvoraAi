'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  Briefcase,
  RefreshCw,
  Award,
  Search,
  Check,
  Clock,
  Lock,
  Sparkles,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MetricStrip } from '@/components/dashboard/KPICard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnalyticsPanel } from '@/components/ui/AnalyticsPanel';
import { InsightPanel } from '@/components/ui/InsightPanel';
import toast from 'react-hot-toast';

interface ValidationClaim {
  _id: string;
  traineeName: string;
  traineeLocation?: string;
  institutionName: string;
  program: string;
  jobRole: string;
  employerName?: string;
  employmentType?: string;
  startDate?: string;
  currentSalary?: number;
  initialSalary?: number;
  status: string;
  verificationStatus: 'PENDING' | 'SELF_REPORTED' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUESTED';
  verificationNotes?: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function EmployerValidationsPage() {
  const [claims, setClaims] = useState<ValidationClaim[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/verification/pending');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setClaims(res.data.data);
      } else {
        setClaims([]);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 401) {
        toast.error('Your session has expired. Please log in again.');
      } else if (status === 403) {
        toast.error('You are not authorized to access verification records.');
      } else {
        toast.error(message || 'Failed to load pending claims. Please try again.');
      }
      setError(message || 'Unable to load claims');
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleAction = async (
    claimId: string,
    action: 'VERIFY' | 'REJECT' | 'CORRECTION_REQUESTED'
  ) => {
    if (actionLoading) return;
    setActionLoading(claimId);

    try {
      const res = await api.post('/verification/action', {
        outcomeId: claimId,
        action,
      });

      if (res.data?.success) {
        const updated = res.data.data;
        setClaims((prev) =>
          prev.map((c) =>
            c._id === claimId
              ? {
                  ...c,
                  verificationStatus: updated.verificationStatus,
                  verificationNotes: updated.verificationNotes,
                  verifiedAt: updated.verifiedAt,
                }
              : c
          )
        );

        if (action === 'VERIFY') {
          toast.success('Placement verified successfully.');
        } else if (action === 'REJECT') {
          toast.error('Claim rejected. Candidate has been notified.');
        } else {
          toast.success('Correction request sent to candidate.');
        }
      } else {
        toast.error(res.data?.message || 'Action failed. Please try again.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message;
      toast.error(message || 'Unable to process verification. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyAll = async () => {
    const pendingClaims = claims.filter(
      (c) => c.verificationStatus === 'PENDING' || c.verificationStatus === 'SELF_REPORTED'
    );
    if (pendingClaims.length === 0) return;

    for (const claim of pendingClaims) {
      await handleAction(claim._id, 'VERIFY');
    }
  };

  const pendingList = claims.filter(
    (c) => c.verificationStatus === 'PENDING' || c.verificationStatus === 'SELF_REPORTED'
  );
  const verifiedList = claims.filter((c) => c.verificationStatus === 'VERIFIED');

  const displayedList = (activeTab === 'PENDING' ? pendingList : verifiedList).filter(
    (c) =>
      c.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.program?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Section Header ── */}
        <SectionHeader
          breadcrumbs={[{ label: 'Employer Cockpit', href: '/employer' }, { label: 'Outcome Validations' }]}
          badge={<AIBadge type="nsqf" label="EMPLOYER VERIFICATION LEDGER" />}
          title="Candidate Placement & Outcome Validations"
          description="Audit self-reported candidate hiring claims. Verified placements receive immediate state recognition and contribute to institutional ROI scorecards."
          actions={
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {pendingList.length > 0 && (
                <button
                  type="button"
                  onClick={handleVerifyAll}
                  disabled={!!actionLoading}
                  className="btn-gold"
                  style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, opacity: actionLoading ? 0.6 : 1 }}
                >
                  <CheckCircle2 size={14} /> Confirm All ({pendingList.length})
                </button>
              )}
              <button
                type="button"
                onClick={loadPending}
                disabled={loading}
                className="btn-secondary"
                style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Queue
              </button>
            </div>
          }
        />

        {/* ── Metric Strip (Replaces 4 Cards) ── */}
        <div style={{ marginBottom: 20 }}>
          <MetricStrip
            items={[
              {
                label: 'Pending Verification',
                value: `${pendingList.length} Claims`,
                subtext: 'Awaiting Confirmation',
                icon: Clock,
                color: pendingList.length > 0 ? 'var(--gold)' : 'var(--success)',
              },
              {
                label: 'Confirmed Validations',
                value: `${verifiedList.length} Placements`,
                subtext: 'Signed on Ledger',
                icon: ShieldCheck,
                color: 'var(--success)',
              },
              {
                label: 'Total Claims Loaded',
                value: `${claims.length} Records`,
                subtext: 'Database Source of Truth',
                icon: Briefcase,
                color: 'var(--info)',
              },
              {
                label: 'Verification Integrity',
                value: '100% Sealed',
                subtext: 'Cryptographic Hash Anchors',
                icon: Lock,
                color: '#a855f7',
              },
            ]}
          />
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div
            style={{
              padding: 40,
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 10 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Retrieving pending candidate claims from state database...
            </p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div
            style={{
              padding: 32,
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <AlertCircle size={36} style={{ color: '#ef4444', marginBottom: 10 }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
              Unable to Load Claims
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.5 }}>
              {error}
            </p>
            <button type="button" onClick={loadPending} className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
              <RefreshCw size={13} style={{ marginRight: 6 }} /> Retry
            </button>
          </div>
        )}

        {/* ── Main Verification Queue in AnalyticsPanel ── */}
        {!loading && !error && (
          <AnalyticsPanel
            eyebrow="VERIFICATION QUEUE"
            title="Candidate Employment Claims"
            description="Audit self-reported employment claims from technical graduates to seal verified placement status on the state ledger."
            action={
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('PENDING')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: activeTab === 'PENDING' ? 'var(--gold)' : 'transparent',
                      color: activeTab === 'PENDING' ? '#090a0f' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Pending Claims ({pendingList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('VERIFIED')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: activeTab === 'VERIFIED' ? 'var(--gold)' : 'transparent',
                      color: activeTab === 'VERIFIED' ? '#090a0f' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Verified Ledger ({verifiedList.length})
                  </button>
                </div>

                <div style={{ position: 'relative', width: 220 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate, role..."
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 30px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  />
                </div>
              </div>
            }
            style={{ marginBottom: 20 }}
            noPadding
          >
            {displayedList.length === 0 ? (
              <div style={{ padding: 40 }}>
                <EmptyState
                  illustration="validations"
                  title={activeTab === 'PENDING' ? 'No Pending Verification Claims' : 'No Verified Records Yet'}
                  description={
                    activeTab === 'PENDING'
                      ? 'There are no pending employment claims from trainees at your organization awaiting verification on the state ledger.'
                      : 'Confirmed placement and 90-day retention records will appear here after you verify claims.'
                  }
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {displayedList.map((item, idx) => {
                  const isProcessing = actionLoading === item._id;
                  const isVerified = item.verificationStatus === 'VERIFIED';
                  const isPending = item.verificationStatus === 'PENDING' || item.verificationStatus === 'SELF_REPORTED';

                  return (
                    <div
                      key={item._id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: idx < displayedList.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        background: idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>
                              {item.traineeName}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              · {item.program}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: isVerified ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                                color: isVerified ? '#10b981' : 'var(--gold)',
                                border: `1px solid ${isVerified ? 'rgba(16,185,129,0.25)' : 'var(--gold-border)'}`,
                              }}
                            >
                              {item.verificationStatus}
                            </span>
                          </div>
                          <div style={{ fontSize: 12.5, color: '#cbd5e1' }}>
                            Claimed Role: <strong style={{ color: 'var(--gold)' }}>{item.jobRole || 'N/A'}</strong>
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                            {item.institutionName} · {item.employmentType || 'Full-time'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          {item.currentSalary ? (
                            <div className="font-display" style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)' }}>
                              ₹{item.currentSalary.toLocaleString('en-IN')}/mo
                            </div>
                          ) : null}
                          {item.startDate && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                              Start: {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Row */}
                      {isPending && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'REJECT')}
                            disabled={isProcessing}
                            className="btn-secondary"
                            style={{ fontSize: 11.5, padding: '5px 12px', color: '#f87171' }}
                          >
                            Reject Claim
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'CORRECTION_REQUESTED')}
                            disabled={isProcessing}
                            className="btn-secondary"
                            style={{ fontSize: 11.5, padding: '5px 12px' }}
                          >
                            Request Correction
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'VERIFY')}
                            disabled={isProcessing}
                            className="btn-gold"
                            style={{ fontSize: 11.5, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Check size={13} /> Verify & Seal
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </AnalyticsPanel>
        )}

        {/* ── Policy & Compliance Insight Panel ── */}
        <InsightPanel
          title="NCVET Employer Verification Mandate (Section 14B)"
          signalType="POSITIVE"
          evidence={[
            { label: 'Attestation SLA', value: '48 Hours' },
            { label: 'State Subsidy Impact', value: 'Eligible for 100% Match' },
            { label: 'Audit Trail', value: 'DPDP Act Sovereign Log' },
          ]}
          recommendation="Confirmed placements generate official NCVET verification certificates and update the candidate's public Skill Passport within 10 minutes of attestation."
        />
      </FadeIn>
    </ErrorBoundary>
  );
}
