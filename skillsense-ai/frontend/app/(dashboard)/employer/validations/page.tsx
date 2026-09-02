'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerValidationsPage() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/verification/pending');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPendingList(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load pending verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleAction = async (outcomeId: string, action: 'VERIFY' | 'REJECT' | 'CORRECTION_REQUESTED') => {
    setActionLoading(outcomeId);
    try {
      const res = await api.post('/verification/action', {
        outcomeId,
        action,
      });
      if (res.data?.success) {
        toast.success(`Candidate record updated: ${action}`);
        loadPending();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#090A0F',
        color: '#F8FAFC',
        padding: '24px 20px 60px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header Banner ── */}
        <div
          style={{
            borderRadius: 20,
            padding: '28px 32px',
            background: 'linear-gradient(135deg, #111422 0%, #171D30 50%, #101424 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 9px',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <ShieldCheck size={13} /> Employer Verification Ledger
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(22px, 3vw, 30px)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                margin: '4px 0 8px',
              }}
            >
              Candidate Placement & Outcome Validations
            </h1>

            <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>
              Review and verify candidate self-reported placement claims. Verified records receive state cryptographic accreditation and 96%+ confidence rating on state dashboards.
            </p>
          </div>

          <button
            onClick={loadPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Queue
          </button>
        </div>

        {/* ── Pending Verifications Queue ── */}
        <div style={{ background: '#10131E', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px' }}>Pending Verification Queue</h2>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Candidates awaiting formal employer confirmation.</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
              {pendingList.length} Pending Actions
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ height: 120, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : pendingList.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={44} style={{ color: '#10B981' }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Queue is Clear</h3>
              <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 420, margin: 0 }}>
                All candidate claims submitted under your enterprise name have been validated.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pendingList.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                          {item.studentId?.userId?.name || 'Candidate Claim'}
                        </h3>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.studentId?.enrollmentNumber || 'ENR-9921'}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: '#CBD5E1', margin: 0 }}>
                        Claimed Role: <strong style={{ color: '#F59E0B' }}>{item.jobRole || 'Software Engineer'}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        ₹{item.monthlySalary ? item.monthlySalary.toLocaleString('en-IN') : '25,000'}/mo
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                      onClick={() => handleAction(item._id, 'REJECT')}
                      disabled={actionLoading === item._id}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#F87171',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => handleAction(item._id, 'VERIFY')}
                      disabled={actionLoading === item._id}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      Confirm Placement (Verify)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
