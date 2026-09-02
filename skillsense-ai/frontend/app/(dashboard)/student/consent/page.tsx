'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ConsentHistoryItem {
  action: string;
  timestamp: string;
  purposes: string[];
}

interface ConsentState {
  status: 'GRANTED' | 'PENDING' | 'WITHDRAWN';
  purposes: string[];
  grantedAt?: string;
  withdrawnAt?: string;
  consentHistory: ConsentHistoryItem[];
}

const PURPOSES = [
  {
    id: 'outcome_tracking',
    title: 'Longitudinal Skilling & Outcome Tracking',
    desc: 'Allows tracking your progress from enrollment to certification, placement, and job milestones.',
  },
  {
    id: 'employer_verification',
    title: 'Employer Verification Ledger',
    desc: 'Enables authorized hiring enterprises to verify your skills, placement claims, and certificate hash.',
  },
  {
    id: 'longitudinal_followup',
    title: 'Post-Certification Follow-Up Surveys',
    desc: 'Enables sending periodic 30d, 90d, and 365d surveys to benchmark career progression.',
  },
  {
    id: 'salary_benchmarking',
    title: 'Aggregated Wage Progression Analytics',
    desc: 'Uses anonymized compensation figures to calculate district and course ROI benchmarks without revealing PII.',
  },
  {
    id: 'policy_analytics',
    title: 'State Policy & Curriculum Feedback',
    desc: 'Contributes to macro workforce data helping Maharashtra optimize vocational funding.',
  },
];

export default function TraineeConsentPage() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConsent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/consent/status');
      if (res.data?.success && res.data.data) {
        setConsent(res.data.data);
        setSelectedPurposes(res.data.data.purposes || []);
      }
    } catch (err: any) {
      console.error('Failed to load consent:', err);
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

  const handleSaveConsent = async (newStatus: 'GRANTED' | 'WITHDRAWN') => {
    setSaving(true);
    try {
      const res = await api.post('/consent/update', {
        status: newStatus,
        purposes: newStatus === 'WITHDRAWN' ? [] : selectedPurposes,
      });

      if (res.data?.success) {
        setConsent(res.data.data);
        if (newStatus === 'GRANTED') {
          toast.success('DPDP Consent Preferences Saved!');
        } else {
          toast.success('Consent Withdrawn. Optional data tracking suspended.');
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update consent');
    } finally {
      setSaving(false);
    }
  };

  const isGranted = consent?.status === 'GRANTED';

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
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Top Nav ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="/student/journey"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <ArrowLeft size={14} /> Back to Outcome Journey
          </Link>
        </div>

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
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <Lock size={12} /> India DPDP Act 2023 Compliant
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
              Consent & Privacy Management Center
            </h1>

            <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>
              You maintain sovereign ownership of your skilling and outcome data. Choose transparently how your records are stored, verified, and used across the state ecosystem.
            </p>
          </div>

          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 800,
                background: isGranted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: isGranted ? '#10B981' : '#F87171',
                border: isGranted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {isGranted ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              Consent Status: {isGranted ? 'GRANTED' : 'WITHDRAWN'}
            </span>
          </div>
        </div>

        {/* ── DPDP 3-Pillar Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <div style={{ background: '#10131E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Eye size={17} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>WHAT & WHY We Collect</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
              We store assessment scores, certificate hashes, and voluntary employment milestones to track long-term vocational impact.
            </p>
          </div>

          <div style={{ background: '#10131E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <UserCheck size={17} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>WHO Has Access</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
              Only your affiliated training institute and authorized employers verify claims. Government analytics receive masked, aggregated metrics.
            </p>
          </div>

          <div style={{ background: '#10131E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99,102,241,0.12)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Lock size={17} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>Right to Revoke</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
              You can revoke or modify consent at any time. Revocation immediately suspends optional longitudinal follow-up surveys.
            </p>
          </div>
        </div>

        {/* ── Granular Consent Permissions ── */}
        <div style={{ background: '#10131E', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16, marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px' }}>Granular Consent Permissions</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Toggle specific processing purposes according to your privacy preferences.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                    border: isChecked ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: isChecked ? '#F59E0B' : 'rgba(255,255,255,0.05)',
                      border: isChecked ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#090A0F',
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>

                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: isChecked ? '#FFFFFF' : '#CBD5E1', margin: '0 0 4px' }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => handleSaveConsent('WITHDRAWN')}
              disabled={saving}
              style={{
                padding: '11px 20px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#F87171',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Withdraw All Consent
            </button>

            <button
              onClick={() => handleSaveConsent('GRANTED')}
              disabled={saving}
              style={{
                padding: '11px 24px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#090A0F',
                fontSize: 13,
                fontWeight: 800,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.3)',
              }}
            >
              {saving ? 'Saving...' : 'Save DPDP Preferences'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
