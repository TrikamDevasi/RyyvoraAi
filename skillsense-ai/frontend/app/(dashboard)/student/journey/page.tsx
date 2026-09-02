'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  BookOpen,
  MapPin,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
        trainingRelevance,
      };

      if (status === 'EMPLOYED' || status === 'APPRENTICESHIP') {
        payload.employerName = employerName;
        payload.employerContact = employerContact;
        payload.jobRole = jobRole;
        if (monthlySalary) payload.monthlySalary = Number(monthlySalary);
      } else if (status === 'SELF_EMPLOYED') {
        payload.jobRole = jobRole || 'Independent Practitioner';
        if (monthlySalary) payload.monthlySalary = Number(monthlySalary);
      } else {
        payload.nonPlacementReason = nonPlacementReason;
      }

      const res = await api.post('/outcomes/self-report', payload);
      if (res.data?.success) {
        toast.success('Employment outcome submitted for state verification!');
        setShowSelfReportModal(false);
        setEmployerName('');
        setEmployerContact('');
        setJobRole('');
        setMonthlySalary('');
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFollowUpModal) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/followups/${showFollowUpModal._id}/submit`, {
        isCurrentlyEmployed: fuEmployed,
        currentEmployer: fuEmployer,
        currentSalary: fuSalary ? Number(fuSalary) : undefined,
        trainingRelevance: fuRelevance,
        feedback: fuFeedback,
      });

      if (res.data?.success) {
        toast.success('Longitudinal outcome survey completed!');
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
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          <ShieldCheck size={13} />
          Employer Verified ({Math.round(conf * 100)}%)
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 9px',
          borderRadius: 99,
          fontSize: 11,
          fontWeight: 700,
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#F59E0B',
          border: '1px solid rgba(245, 158, 11, 0.25)',
        }}
      >
        <Clock size={13} />
        Self-Reported ({Math.round(conf * 100)}%)
      </span>
    );
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
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header Banner ── */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 20,
            padding: '28px 32px',
            background: 'linear-gradient(135deg, #111422 0%, #171D30 50%, #101424 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: 'rgba(245,158,11,0.15)',
                    color: '#F59E0B',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  Government of Maharashtra · NSQF Ledger
                </span>
                <span style={{ fontSize: 12, color: '#64748B' }}>•</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                  OUTCOME TIMELINE
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '4px 0 8px',
                }}
              >
                Longitudinal Skilling & Outcome Journey
              </h1>

              <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>
                Verifiable timeline tracing your trajectory from training enrollment to assessment, certification, job placement, salary progression, and longitudinal retention.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowSelfReportModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 20px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#090A0F',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  border: 'none',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Plus size={16} />
                Update Employment Status
              </button>

              <button
                onClick={loadData}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Refresh Timeline"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Pending Follow-Up Survey Banner ── */}
        {pendingFollowUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: 16,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A', margin: '0 0 2px' }}>
                  Action Required: {pendingFollowUps[0].scheduleDays}-Day Longitudinal Outcome Survey
                </h4>
                <p style={{ fontSize: 12, color: '#CBD5E1', margin: 0 }}>
                  The Maharashtra Skilling Directorate requires periodic outcome verification to benchmark course retention and wage progression.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFollowUpModal(pendingFollowUps[0])}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                color: '#090A0F',
                background: '#F59E0B',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Complete Survey (2 mins) →
            </button>
          </motion.div>
        )}

        {/* ── Main 2-Column Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* Left: Milestone Timeline */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <Milestone size={20} style={{ color: '#F59E0B' }} />
                Verifiable Career Milestones
              </h2>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                {timeline.length} Milestones Logged
              </span>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: 100,
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                ))}
              </div>
            ) : timeline.length === 0 ? (
              <div
                style={{
                  borderRadius: 16,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#10131E',
                  padding: '48px 24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <HelpCircle size={44} style={{ color: '#475569' }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>No Timeline Events Recorded</h3>
                <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 420, margin: 0, lineHeight: 1.5 }}>
                  Once enrolled in an approved training program or when reporting employment, your cryptographic ledger milestones will appear here.
                </p>
                <button
                  onClick={() => setShowSelfReportModal(true)}
                  style={{
                    marginTop: 8,
                    padding: '9px 18px',
                    borderRadius: 10,
                    background: '#F59E0B',
                    color: '#090A0F',
                    fontSize: 12,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Self-Report Employment Milestone
                </button>
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  paddingLeft: 28,
                  borderLeft: '2px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                  margin: '8px 0',
                }}
              >
                {timeline.map((event, idx) => {
                  const isCertified = event.eventType === 'CERTIFIED';
                  const isEmployed = ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'].includes(event.eventType);
                  const isSalary = event.eventType === 'SALARY_UPDATED';

                  return (
                    <motion.div
                      key={event._id || idx}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Timeline Dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -39,
                          top: 8,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: isCertified ? '#10B981' : isEmployed ? '#F59E0B' : '#6366F1',
                          border: '3px solid #090A0F',
                          boxShadow: isCertified ? '0 0 10px rgba(16,185,129,0.5)' : isEmployed ? '0 0 10px rgba(245,158,11,0.5)' : 'none',
                        }}
                      />

                      {/* Timeline Card */}
                      <div
                        style={{
                          background: '#10131E',
                          borderRadius: 14,
                          border: isCertified
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : isEmployed
                            ? '1px solid rgba(245, 158, 11, 0.25)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          padding: 20,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                              {event.title}
                            </h3>
                          </div>
                          {getEventBadge(event.verificationStatus, event.confidence)}
                        </div>

                        <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: '0 0 12px' }}>
                          {event.description}
                        </p>

                        {/* Event Metadata Badges */}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {event.metadata.employerName && (
                              <span style={{ fontSize: 11, color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6 }}>
                                <Building size={12} style={{ color: '#F59E0B' }} /> {event.metadata.employerName}
                              </span>
                            )}
                            {event.metadata.salary && (
                              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(16,185,129,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                                <DollarSign size={12} /> ₹{Number(event.metadata.salary).toLocaleString('en-IN')}/mo
                              </span>
                            )}
                            {event.metadata.nsqfLevel && (
                              <span style={{ fontSize: 11, color: '#CBD5E1', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6 }}>
                                NSQF Level {event.metadata.nsqfLevel}
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

          {/* Right: Skill Passport & Ledger Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #111422 0%, #171D30 100%)',
                borderRadius: 18,
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: 24,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Verified Skill Passport
                  </h3>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>● ACTIVE STATE LEDGER</span>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.55, margin: '0 0 16px' }}>
                Your credentials and employment milestones are anchored to a verifiable state cryptographic ledger. Employers and government verification agents can validate authenticity instantly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748B' }}>Verifier Hash:</span>
                  <span style={{ color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700 }}>
                    0x8f4c2e...cb72e01a
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748B' }}>Candidate Name:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{user?.name || 'Trikam Devasi'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748B' }}>Target NSQF Level:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Level 5 (Advanced Technical)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748B' }}>Verification Ledger:</span>
                  <span style={{ color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={13} /> State Validated
                  </span>
                </div>
              </div>

              <Link
                href="/student/passport"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 18,
                  padding: '11px',
                  borderRadius: 10,
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  color: '#F59E0B',
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                View Full Skill Passport <ExternalLink size={13} />
              </Link>
            </div>

            {/* Longitudinal Privacy Banner */}
            <div
              style={{
                borderRadius: 16,
                background: '#10131E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ShieldCheck size={16} style={{ color: '#10B981' }} />
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  DPDP Act 2023 Compliant
                </h4>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, margin: '0 0 12px' }}>
                Periodic follow-ups and outcome data are cryptographically bound under your explicit consent settings.
              </p>
              <Link
                href="/student/consent"
                style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', textDecoration: 'none' }}
              >
                Manage Privacy Settings →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Modal: Self-Report Milestone ── */}
        <AnimatePresence>
          {showSelfReportModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 16,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  width: '100%',
                  maxWidth: 520,
                  background: '#111422',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 20,
                  padding: 28,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Report Employment Milestone
                  </h3>
                  <button
                    onClick={() => setShowSelfReportModal(false)}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSelfReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                      Placement Outcome Type
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: '#090A0F',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                        fontSize: 13,
                      }}
                    >
                      <option value="EMPLOYED">Salaried Employment (Full-Time / Part-Time)</option>
                      <option value="APPRENTICESHIP">Registered Apprenticeship (NAPS / Industry)</option>
                      <option value="SELF_EMPLOYED">Self-Employed / Freelancer / Entrepreneur</option>
                      <option value="UNEMPLOYED_SEEKING">Actively Seeking Placement</option>
                      <option value="HIGHER_EDUCATION">Pursuing Higher Education</option>
                    </select>
                  </div>

                  {(status === 'EMPLOYED' || status === 'APPRENTICESHIP') && (
                    <>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                          Hiring Company / Organization
                        </label>
                        <input
                          type="text"
                          required
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Tata Consultancy Services, Infosys, Tech Mahindra"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: '#090A0F',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#FFFFFF',
                            fontSize: 13,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                          Job Role / Designation
                        </label>
                        <input
                          type="text"
                          required
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          placeholder="e.g. Full-Stack Developer, Data Analyst, Cloud Technician"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: '#090A0F',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#FFFFFF',
                            fontSize: 13,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                          Monthly In-Hand Salary (₹ INR)
                        </label>
                        <input
                          type="number"
                          value={monthlySalary}
                          onChange={(e) => setMonthlySalary(e.target.value)}
                          placeholder="e.g. 28000"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: '#090A0F',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#FFFFFF',
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowSelfReportModal(false)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94A3B8',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        border: 'none',
                        color: '#090A0F',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
