'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  DollarSign,
  Briefcase,
  RefreshCw,
  ExternalLink,
  Award,
  ArrowLeft,
  UserCheck,
  Search,
  Filter,
  Check,
  Clock,
  Lock,
  Download,
  Sparkles,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
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
        // Update the claim in local state from backend response
        const updated = res.data.data;
        setClaims((prev) =>
          prev.map((c) =>
            c._id === claimId
              ? {
                  ...c,
                  verificationStatus: updated.verificationStatus,
                  verificationNotes: updated.verificationNotes,
                  verifiedAt: updated.verifiedAt,
                  confidenceScore: updated.confidenceScore,
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
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 401) {
        toast.error('Your session has expired. Please log in again.');
      } else if (status === 403) {
        toast.error('You are not authorized to perform this action.');
      } else if (status === 404) {
        toast.error('Employment claim not found.');
      } else if (status === 409) {
        toast.error('This claim has already been processed.');
      } else if (status === 422) {
        toast.error(message || 'Invalid request. Please check your input.');
      } else {
        toast.error(message || 'Unable to process verification. Please try again.');
      }
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
      <FadeIn style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 60 }}>
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
              <AIBadge type="nsqf" label="EMPLOYER VERIFICATION LEDGER" />
              <AIBadge type="verified" label="STATE ACCREDITED OUTCOMES" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Candidate Placement & <span style={{ color: 'var(--gold)' }}>Outcome Validations</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Audit self-reported candidate hiring claims. Verified placements receive immediate state recognition and contribute to institutional ROI scorecards.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {pendingList.length > 0 && (
              <button
                type="button"
                onClick={handleVerifyAll}
                disabled={!!actionLoading}
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, opacity: actionLoading ? 0.6 : 1 }}
              >
                <CheckCircle2 size={14} /> Confirm All ({pendingList.length})
              </button>
            )}
            <button
              type="button"
              onClick={loadPending}
              disabled={loading}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* ── Metric Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Pending Verification', value: `${pendingList.length} Claims`, sub: 'Awaiting Employer Confirmation', color: pendingList.length > 0 ? 'var(--gold)' : '#10b981', icon: Clock },
            { label: 'Confirmed Validations', value: `${verifiedList.length} Placements`, sub: 'Signed on Ledger', color: '#10b981', icon: ShieldCheck },
            { label: 'Total Claims Loaded', value: `${claims.length} Records`, sub: 'From Backend Database', color: '#60a5fa', icon: Sparkles },
            { label: 'Verification Integrity', value: 'Server-Verified', sub: 'Database is Source of Truth', color: '#a855f7', icon: Lock },
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

        {/* ── Tab Switcher & Search Bar ── */}
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
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
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
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
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

          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, role..."
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

        {/* ── Loading State ── */}
        {loading && (
          <div className="card-linear" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: 16 }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--gold)', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading pending claims from database...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="card-linear" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: 16 }}>
            <AlertCircle size={44} style={{ color: '#ef4444', marginBottom: 12 }} />
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              Unable to Load Claims
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 0 16px', lineHeight: 1.5 }}>
              {error}
            </p>
            <button type="button" onClick={loadPending} className="btn-gold" style={{ fontSize: 12.5, padding: '8px 16px' }}>
              <RefreshCw size={14} style={{ marginRight: 6 }} /> Retry
            </button>
          </div>
        )}

        {/* ── Main Verification Queue List ── */}
        {!loading && !error && (
          <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
            {displayedList.length === 0 ? (
              <EmptyState
                illustration="validations"
                title={activeTab === 'PENDING' ? 'No Pending Verification Claims' : 'No Verified Records Yet'}
                description={
                  activeTab === 'PENDING'
                    ? 'There are no pending employment claims from trainees at your organization awaiting verification on the state ledger.'
                    : 'Confirmed placement and 90-day retention records will appear here after you verify claims.'
                }
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {displayedList.map((item) => {
                  const isProcessing = actionLoading === item._id;
                  const isVerified = item.verificationStatus === 'VERIFIED';
                  const isPending = item.verificationStatus === 'PENDING' || item.verificationStatus === 'SELF_REPORTED';

                  return (
                    <div
                      key={item._id}
                      className="card-accent"
                      style={{
                        padding: 20,
                        borderRadius: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                        borderLeft: `4px solid ${isVerified ? '#10b981' : 'var(--gold)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                              {item.traineeName}
                            </h3>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {item.program}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                            Claimed Role: <strong style={{ color: 'var(--gold)' }}>{item.jobRole || 'N/A'}</strong>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            {item.institutionName} · {item.employmentType || 'Full-time'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          {item.currentSalary ? (
                            <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>
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

                      {isVerified && item.verifiedAt && (
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.25)',
                            fontSize: 11.5,
                            color: '#86efac',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={14} color="#10b981" />
                            <span>Verified by Employer</span>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Verified: {new Date(item.verifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      )}

                      {item.verificationStatus === 'REJECTED' && (
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            fontSize: 11.5,
                            color: '#fca5a5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <XCircle size={14} color="#ef4444" />
                          <span>Claim Rejected{item.verificationNotes ? `: ${item.verificationNotes}` : ''}</span>
                        </div>
                      )}

                      {item.verificationStatus === 'CORRECTION_REQUESTED' && (
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: 'rgba(245,158,11,0.08)',
                            border: '1px solid rgba(245,158,11,0.25)',
                            fontSize: 11.5,
                            color: '#fcd34d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <AlertCircle size={14} color="#f59e0b" />
                          <span>Correction Requested{item.verificationNotes ? `: ${item.verificationNotes}` : ''}</span>
                        </div>
                      )}

                      {isPending && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'REJECT')}
                            disabled={isProcessing}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 6,
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.25)',
                              color: '#f87171',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: isProcessing ? 'not-allowed' : 'pointer',
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            {isProcessing ? 'Processing...' : 'Reject Claim'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'CORRECTION_REQUESTED')}
                            disabled={isProcessing}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 6,
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border)',
                              color: '#cbd5e1',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: isProcessing ? 'not-allowed' : 'pointer',
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            {isProcessing ? 'Processing...' : 'Request Correction'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item._id, 'VERIFY')}
                            disabled={isProcessing}
                            className="btn-gold"
                            style={{
                              padding: '6px 18px',
                              fontSize: 12,
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              cursor: isProcessing ? 'not-allowed' : 'pointer',
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            {isProcessing ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                            <span>Confirm Placement (Verify)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
