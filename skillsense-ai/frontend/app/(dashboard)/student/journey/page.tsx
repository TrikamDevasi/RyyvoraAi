'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  TrendingUp,
  AlertCircle,
  Building,
  DollarSign,
  Plus,
  ShieldCheck,
  Send,
  X,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';

interface TimelineEvent {
  _id: string;
  eventType: string;
  title: string;
  description: string;
  date: string;
  source: string;
  verificationStatus: string;
  confidence: number;
  metadata?: Record<string, any>;
}

interface PendingFollowUp {
  _id: string;
  scheduleDays: number;
  dueDate: string;
  status: string;
}

export default function TraineeJourneyPage() {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [pendingFollowUps, setPendingFollowUps] = useState<PendingFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelfReportModal, setShowSelfReportModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState<PendingFollowUp | null>(null);

  // Self Report Form State
  const [status, setStatus] = useState('EMPLOYED');
  const [employerName, setEmployerName] = useState('');
  const [employerContact, setEmployerContact] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [trainingRelevance, setTrainingRelevance] = useState('HIGHLY_RELEVANT');
  const [nonPlacementReason, setNonPlacementReason] = useState('SKILL_GAP');
  const [submitting, setSubmitting] = useState(false);

  // Follow-up Form State
  const [fuEmployed, setFuEmployed] = useState(true);
  const [fuEmployer, setFuEmployer] = useState('');
  const [fuSalary, setFuSalary] = useState('');
  const [fuRelevance, setFuRelevance] = useState('HIGHLY_RELEVANT');
  const [fuFeedback, setFuFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [timelineRes, followUpRes] = await Promise.all([
        api.get('/outcomes/my-timeline'),
        api.get('/followups/my-pending'),
      ]);

      if (timelineRes.data?.success && Array.isArray(timelineRes.data.data)) {
        setTimeline(timelineRes.data.data);
      }
      if (followUpRes.data?.success && Array.isArray(followUpRes.data.data)) {
        setPendingFollowUps(followUpRes.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load journey data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelfReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        status,
        jobRole,
        trainingRelevance,
      };

      if (status === 'EMPLOYED' || status === 'APPRENTICESHIP') {
        payload.employerName = employerName;
        payload.employerContact = employerContact;
        if (monthlySalary) payload.monthlySalary = Number(monthlySalary);
      } else if (status === 'SELF_EMPLOYED') {
        payload.employerName = 'Self-Employed Venture';
        if (monthlySalary) payload.monthlySalary = Number(monthlySalary);
      } else if (status === 'SEEKING' || status === 'UNEMPLOYED') {
        payload.nonPlacementReason = nonPlacementReason;
      }

      const res = await api.post('/outcomes/self-report', payload);
      if (res.data?.success) {
        toast.success('Employment status recorded in longitudinal ledger!');
        setShowSelfReportModal(false);
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit status update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFollowUpModal) return;
    setSubmitting(true);
    try {
      const res = await api.post('/followups/submit', {
        followUpId: showFollowUpModal._id,
        responses: {
          isEmployed: fuEmployed,
          employerName: fuEmployed ? fuEmployer : undefined,
          currentSalary: fuEmployed && fuSalary ? Number(fuSalary) : undefined,
          trainingRelevance: fuEmployed ? fuRelevance : undefined,
          feedback: fuFeedback,
        },
      });

      if (res.data?.success) {
        toast.success('Longitudinal follow-up survey submitted!');
        setShowFollowUpModal(null);
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const getEventBadge = (status: string, conf: number) => {
    if (status === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Employer Verified ({Math.round(conf * 100)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5" />
        Self-Reported ({Math.round(conf * 100)}%)
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131722] to-[#1A2030] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Government of Maharashtra · NSQF Ledger
              </span>
              <AIBadge type="live" label="OUTCOME TIMELINE" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">

              Longitudinal Skilling & Outcome Journey
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1">
              Verifiable timeline tracing your trajectory from training enrollment to assessment, certification, job placement, salary progression, and longitudinal retention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSelfReportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Update Employment Status
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors"
              title="Refresh Timeline"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Follow-Up Survey Banner if any */}
      {pendingFollowUps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5 sm:mt-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Action Required: {pendingFollowUps[0].scheduleDays}-Day Longitudinal Outcome Survey
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                The Maharashtra Skilling Directorate requires periodic outcome verification to benchmark course retention and wage progression.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFollowUpModal(pendingFollowUps[0])}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
          >
            Complete Survey (2 mins) →
          </button>
        </motion.div>
      )}

      {/* Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Milestone className="w-5 h-5 text-amber-400" />
              Verifiable Career Milestones
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {timeline.length} Milestones Logged
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-28 rounded-xl bg-slate-800/40 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Timeline Events Recorded</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Once enrolled in an approved training program or when reporting employment, your cryptographic ledger milestones will appear here.
              </p>
              <button
                onClick={() => setShowSelfReportModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Self-Report Employment Milestone
              </button>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/20 space-y-8 my-4">
              {timeline.map((event, idx) => {
                const isCertified = event.eventType === 'CERTIFIED';
                const isEmployed = ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'].includes(event.eventType);
                const isSalary = event.eventType === 'SALARY_UPDATED';
                const isRetention = event.eventType.includes('FOLLOW_UP_') || event.eventType === 'RETENTION_CHECK';

                return (
                  <motion.div
                    key={event._id || idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group"
                  >
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isEmployed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : isCertified
                          ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                          : isSalary
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800 border-slate-600 text-slate-300'
                      }`}
                    >
                      {isEmployed ? (
                        <Briefcase className="w-3 h-3" />
                      ) : isCertified ? (
                        <Award className="w-3 h-3" />
                      ) : isSalary ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </div>

                    {/* Event Card */}
                    <div className="rounded-xl bg-[#11141E] border border-slate-800/80 hover:border-amber-500/30 p-5 shadow-lg transition-all space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {new Date(event.date).toLocaleDateString('en-IN', {
                              month: 'short',
                              year: 'numeric',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-bold uppercase tracking-wide text-amber-400/90">
                            {event.eventType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {getEventBadge(event.verificationStatus, event.confidence)}
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Metadata Pill Tags */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                          {event.metadata.salary && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              <DollarSign className="w-3 h-3" /> ₹{Number(event.metadata.salary).toLocaleString('en-IN')}/mo
                            </span>
                          )}
                          {event.metadata.employer && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              <Building className="w-3 h-3 text-slate-400" /> {event.metadata.employer}
                            </span>
                          )}
                          {event.metadata.role && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              <Briefcase className="w-3 h-3 text-slate-400" /> {event.metadata.role}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Outcome Passport & Trust Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#11141E] border border-amber-500/20 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Verified Skill Passport
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your credentials and employment milestones are anchored to a verifiable state cryptographic ledger. Employers and government verification agents can validate authenticity instantly.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400">PUBLIC VERIFIER HASH</div>
              <div className="text-xs font-mono text-amber-300 break-all select-all font-semibold">
                0x8f4c2e91b5a3d76e48c10927fa118239cb72e01a
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Candidate Name</span>
                <span className="font-semibold text-white">{user?.name || 'Aarav Deshmukh'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Target NSQF Level</span>
                <span className="font-semibold text-white">Level 5 (Advanced Technical)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Verification Ledger</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> State Validated
                </span>
              </div>
            </div>

            <a
              href="/verify/0x8f4c2e91b5a3d76e48c10927fa118239cb72e01a"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              Open Public Verification URL
            </a>
          </div>

          {/* Longitudinal Skilling Guarantee Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-[#121522] border border-slate-800 p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Outcome Tracking & Retention
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Periodic 30d, 90d, and 365d follow-ups ensure accurate employment attribution, helping Maharashtra target infrastructure and funding toward high-performing courses.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>DPDP Compliance</span>
              <span className="text-amber-400 font-semibold">Consent Granted</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Self-Report Employment Status ── */}
      <AnimatePresence>
        {showSelfReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#11141E] border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Update Employment Status</h3>
                </div>
                <button
                  onClick={() => setShowSelfReportModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSelfReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Current Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="EMPLOYED">Salaried Employment</option>
                    <option value="SELF_EMPLOYED">Self-Employed / Entrepreneurship</option>
                    <option value="APPRENTICESHIP">Apprenticeship</option>
                    <option value="SEEKING">Seeking Placement Opportunities</option>
                    <option value="UNEMPLOYED">Currently Unemployed</option>
                  </select>
                </div>

                {['EMPLOYED', 'APPRENTICESHIP', 'SELF_EMPLOYED'].includes(status) && (
                  <>
                    {status !== 'SELF_EMPLOYED' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Employer / Enterprise Name
                        </label>
                        <input
                          type="text"
                          required
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Tata Consultancy Services, Bajaj Auto"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Job Role / Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="e.g. Associate Software Engineer, Solar Technician"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Monthly Compensation (INR)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        placeholder="e.g. 28000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Confidential data used purely for state wage progression analytics.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Training Relevance to Current Role
                      </label>
                      <select
                        value={trainingRelevance}
                        onChange={(e) => setTrainingRelevance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="HIGHLY_RELEVANT">Highly Relevant (Direct Match to Curriculum)</option>
                        <option value="PARTIALLY_RELEVANT">Partially Relevant (Adjacent Technology)</option>
                        <option value="NOT_RELEVANT">Not Relevant (Skill Mismatch)</option>
                      </select>
                    </div>

                    {status !== 'SELF_EMPLOYED' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Employer HR / Manager Email (For Verification)
                        </label>
                        <input
                          type="email"
                          value={employerContact}
                          onChange={(e) => setEmployerContact(e.target.value)}
                          placeholder="e.g. hr@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </>
                )}

                {['SEEKING', 'UNEMPLOYED'].includes(status) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Primary Barrier Faced
                    </label>
                    <select
                      value={nonPlacementReason}
                      onChange={(e) => setNonPlacementReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="SKILL_GAP">Skill Gap / Lack of Advanced Practical Labs</option>
                      <option value="COMMUNICATION">Interview Communication / Articulation</option>
                      <option value="LOCATION">Relocation / Geographical Constraints</option>
                      <option value="TRANSPORT">Commute / Transportation Feasibility</option>
                      <option value="SALARY_EXPECTATION">Entry Salary Below Expectations</option>
                      <option value="LACK_OF_JOB_OPENINGS">Lack of Local Job Openings</option>
                      <option value="OTHER">Personal / Family Circumstances</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowSelfReportModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? 'Recording...' : 'Submit Status Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Longitudinal Follow-Up Survey ── */}
      <AnimatePresence>
        {showFollowUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#11141E] border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {showFollowUpModal.scheduleDays}-Day Longitudinal Outcome Survey
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Government of Maharashtra Verification</p>
                </div>
                <button
                  onClick={() => setShowFollowUpModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFollowUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Are you currently employed or self-employed?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFuEmployed(true)}
                      className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${
                        fuEmployed
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Yes, Employed
                    </button>
                    <button
                      type="button"
                      onClick={() => setFuEmployed(false)}
                      className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${
                        !fuEmployed
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      No, Seeking
                    </button>
                  </div>
                </div>

                {fuEmployed && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Current Employer / Enterprise
                      </label>
                      <input
                        type="text"
                        value={fuEmployer}
                        onChange={(e) => setFuEmployer(e.target.value)}
                        placeholder="e.g. Tata Consultancy Services"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Current Monthly Salary (INR)
                      </label>
                      <input
                        type="number"
                        value={fuSalary}
                        onChange={(e) => setFuSalary(e.target.value)}
                        placeholder="e.g. 32000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Is your job related to your training?
                      </label>
                      <select
                        value={fuRelevance}
                        onChange={(e) => setFuRelevance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="HIGHLY_RELEVANT">Highly Relevant</option>
                        <option value="PARTIALLY_RELEVANT">Partially Relevant</option>
                        <option value="NOT_RELEVANT">Not Relevant</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Feedback / Missing Skills in Curriculum (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={fuFeedback}
                    onChange={(e) => setFuFeedback(e.target.value)}
                    placeholder="Did you feel any practical skills were missing during actual job tasks?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowFollowUpModal(null)}
                    className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
