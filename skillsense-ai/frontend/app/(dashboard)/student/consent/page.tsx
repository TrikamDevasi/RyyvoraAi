'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#131722] to-[#1A2030] border border-amber-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> India DPDP Act 2023 Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Consent & Privacy Management Center
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              You maintain sovereign ownership of your skilling and outcome data. Choose transparently how your records are stored, verified, and used.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                isGranted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {isGranted ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Consent Status: GRANTED
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Consent Status: WITHDRAWN
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DPDP 5-Pillar Transparency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-[#11141E] border border-slate-800 p-5 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">WHAT & WHY We Collect</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We store assessment scores, certificate hashes, and voluntary employment milestones to track long-term vocational impact.
          </p>
        </div>

        <div className="rounded-xl bg-[#11141E] border border-slate-800 p-5 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">WHO Has Access</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Only your affiliated training institute and authorized employers verify claims. Government analytics receive masked, aggregated metrics.
          </p>
        </div>

        <div className="rounded-xl bg-[#11141E] border border-slate-800 p-5 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Right to Withdraw</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You can revoke or modify consent at any time. Revocation immediately suspends optional longitudinal follow-up surveys.
          </p>
        </div>
      </div>

      {/* Purpose Toggles Section */}
      <div className="rounded-2xl bg-[#11141E] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Granular Consent Permissions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Toggle specific processing purposes according to your privacy preference.</p>
          </div>
          <button
            onClick={loadConsent}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {PURPOSES.map((purpose) => {
            const isChecked = selectedPurposes.includes(purpose.id);
            return (
              <div
                key={purpose.id}
                onClick={() => handlePurposeToggle(purpose.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isChecked
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${isChecked ? 'text-amber-400' : 'text-slate-600'}`}
                    />
                    <h4 className="text-sm font-bold text-white">{purpose.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">{purpose.desc}</p>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                    isChecked ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isChecked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <button
            onClick={() => handleSaveConsent('WITHDRAWN')}
            disabled={saving || !isGranted}
            className="px-5 py-2.5 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all disabled:opacity-40"
          >
            Withdraw All Consent
          </button>

          <button
            onClick={() => handleSaveConsent('GRANTED')}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Confirm Consent'}
          </button>
        </div>
      </div>

      {/* Audit History Log */}
      {consent?.consentHistory && consent.consentHistory.length > 0 && (
        <div className="rounded-2xl bg-[#11141E] border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Consent Audit Trail
          </h3>
          <div className="divide-y divide-slate-800">
            {consent.consentHistory.map((h, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      h.action === 'GRANT'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : h.action === 'WITHDRAW'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {h.action}
                  </span>
                  <span className="text-slate-300">
                    {h.purposes?.length || 0} Purposes Approved
                  </span>
                </div>
                <span className="text-slate-500 font-mono">
                  {new Date(h.timestamp).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
