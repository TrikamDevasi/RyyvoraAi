'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111624] via-[#161D30] to-[#121726] border border-amber-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Employer Verification Ledger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Placement & Outcome Validations
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Review and verify candidate self-reported placement claims. Verified records receive state cryptographic accreditation and 96%+ confidence rating.
            </p>
          </div>

          <button
            onClick={loadPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Pending Verifications Queue */}
      <div className="rounded-2xl bg-[#11141E] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Pending Verification Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Candidates awaiting formal employer confirmation.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {pendingList.length} Pending Actions
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-xl bg-slate-800/40 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : pendingList.length === 0 ? (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-white">All Pending Claims Verified</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No unconfirmed placement records currently pending for your enterprise.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingList.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      {item.traineeId?.name || 'Aarav Deshmukh'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.traineeId?.email || 'trainee@skillsense.demo'}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      Role: <strong className="text-white">{item.jobRole || 'Technical Associate'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Program: {item.program}
                    </span>
                    {item.currentSalary && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        ₹{item.currentSalary.toLocaleString('en-IN')}/mo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleAction(item._id, 'VERIFY')}
                    disabled={actionLoading === item._id}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify Placement
                  </button>
                  <button
                    onClick={() => handleAction(item._id, 'CORRECTION_REQUESTED')}
                    disabled={actionLoading === item._id}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    Request Correction
                  </button>
                  <button
                    onClick={() => handleAction(item._id, 'REJECT')}
                    disabled={actionLoading === item._id}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                    title="Reject Placement Claim"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
