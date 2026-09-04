'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { studentApi, TimelineEvent, PendingFollowUp } from '@/lib/api/student.api';
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
  Calendar,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function TraineeJourneyPage() {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [pendingFollowUps, setPendingFollowUps] = useState<PendingFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelfReportModal, setShowSelfReportModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState<PendingFollowUp | null>(null);

  // Self Report Form State
  const [status, setStatus] = useState('EMPLOYED');
  const [employerName, setEmployerName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [trainingRelevance, setTrainingRelevance] = useState('HIGHLY_RELEVANT');
  const [submitting, setSubmitting] = useState(false);

  // Follow-up Form State
  const [fuEmployed, setFuEmployed] = useState(true);
  const [fuEmployer, setFuEmployer] = useState('');
  const [fuSalary, setFuSalary] = useState('');
  const [fuJobRole, setFuJobRole] = useState('');
  const [fuFeedback, setFuFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [timelineResult, followUpsResult] = await Promise.allSettled([
        studentApi.getMyTimeline(),
        studentApi.getMyPendingFollowUps(),
      ]);

      if (timelineResult.status === 'fulfilled' && Array.isArray(timelineResult.value)) {
        setTimeline(timelineResult.value);
      }
      if (followUpsResult.status === 'fulfilled' && Array.isArray(followUpsResult.value)) {
        setPendingFollowUps(followUpsResult.value);
      }
    } catch {
      setError('Unable to load your training journey data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'report') {
        setShowSelfReportModal(true);
      }
    }
  }, []);

  const handleSelfReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim() && status === 'EMPLOYED') {
      toast.error('Please specify your current job title.');
      return;
    }

    setSubmitting(true);
    try {
      await studentApi.submitSelfReport({
        status,
        employerName: employerName || undefined,
        jobRole: jobRole || undefined,
        monthlySalary: Number(monthlySalary) || undefined,
        trainingRelevance,
      });

      toast.success('Career milestone recorded on your longitudinal ledger.');

      setShowSelfReportModal(false);
      setEmployerName('');
      setJobRole('');
      setMonthlySalary('');
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to record milestone. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFollowUpModal) return;

    setSubmitting(true);
    try {
      await studentApi.submitFollowUp(showFollowUpModal._id, {
        isEmployed: fuEmployed,
        employerName: fuEmployed ? fuEmployer : undefined,
        currentSalary: fuEmployed && fuSalary ? Number(fuSalary) : undefined,
        jobRole: fuEmployed ? fuJobRole : undefined,
        trainingRelevance: 'HIGHLY_RELEVANT',
        feedback: fuFeedback || undefined,
      });

      toast.success('Longitudinal check-in recorded successfully.');

      setShowFollowUpModal(null);
      setFuEmployed(true);
      setFuEmployer('');
      setFuSalary('');
      setFuJobRole('');
      setFuFeedback('');
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to submit check-in. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 60 }}>
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
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <AIBadge type="nsqf" label="NSQF LEVEL 5 CAREER JOURNEY" />
              <AIBadge type="verified" label="LONGITUDINAL TELEMETRY VERIFIED" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Trainee Longitudinal Skilling & <span style={{ color: 'var(--gold)' }}>Outcome Journey</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 6, lineHeight: 1.5, maxWidth: 680 }}>
              Verifiable career milestones tracking your trajectory from enrollment to diagnostic assessment, campus hiring, 90-day retention, and long-term salary progression.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowSelfReportModal(true)}
              className="btn-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={15} />
              <span>Report Milestone</span>
            </button>
          </div>
        </div>

        {/* ── Key Outcome Metrics Banner ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card-linear" style={{ padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ height: 14, width: 100, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 28, width: 140, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 12, width: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Timeline Events', value: `${timeline.length}`, sub: timeline.length > 0 ? 'Milestones Recorded' : 'No events yet', color: '#60a5fa', icon: ShieldCheck },
              { label: 'Pending Check-ins', value: `${pendingFollowUps.length}`, sub: pendingFollowUps.length > 0 ? 'Action Required' : 'All check-ins completed', color: pendingFollowUps.length > 0 ? 'var(--gold)' : '#10b981', icon: Clock },
              { label: 'Latest Event', value: timeline.length > 0 ? timeline[0].eventType.replace(/_/g, ' ') : 'None', sub: timeline.length > 0 ? new Date(timeline[0].date).toLocaleDateString() : 'Start your journey', color: 'var(--gold)', icon: Milestone },
              { label: 'Verification Status', value: timeline.filter((t) => t.verificationStatus === 'VERIFIED').length > 0 ? 'Verified' : 'Pending', sub: `${timeline.filter((t) => t.verificationStatus === 'VERIFIED').length} of ${timeline.length} events verified`, color: '#10b981', icon: CheckCircle2 },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="card-linear" style={{ padding: '18px 20px', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {card.label}
                    </span>
                    <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: card.color }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: card.color, textTransform: 'capitalize' }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {card.sub}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pending Verification Check-ins ── */}
        {pendingFollowUps.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.3)',
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="var(--gold)" />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>
                  {pendingFollowUps[0].title || `Follow-up Check-in (${pendingFollowUps[0].scheduleDays}-day)`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  State government longitudinal outcome verification due by {pendingFollowUps[0].dueDate}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFollowUpModal(pendingFollowUps[0])}
              className="btn-gold"
              style={{ padding: '7px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
            >
              Complete Check-in →
            </button>
          </div>
        )}

        {/* ── Chronological Outcome Journey Timeline ── */}
        <div className="card-linear" style={{ padding: 26, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Milestone size={18} color="var(--gold)" /> Longitudinal Outcome Pathway
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Chronological sequence of verified educational, assessment, hiring, and wage events.
              </p>
            </div>
            <span style={{ fontSize: 11.5, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} /> State Verified Ledger
            </span>
          </div>

          {timeline.length === 0 ? (
            <EmptyState
              illustration="outcomes"
              title="No Milestone Events Recorded Yet"
              description="Your verified journey milestones from enrollment to NSQF certification, campus placement, and wage progression will display chronologically along this timeline."
              actionText="Log Placement / Milestone"
              onAction={() => setShowSelfReportModal(true)}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Timeline Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  left: 19,
                  top: 20,
                  bottom: 20,
                  width: 2,
                  background: 'linear-gradient(180deg, var(--gold) 0%, rgba(245,158,11,0.2) 100%)',
                  zIndex: 0,
                }}
              />

              {timeline.map((event, idx) => {
                const isVerified = event.verificationStatus === 'VERIFIED';
                return (
                  <div
                    key={event._id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 18,
                      marginBottom: 26,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Glowing Node Dot */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--bg-surface)',
                        border: `2px solid ${isVerified ? '#10b981' : 'var(--gold)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isVerified ? '#10b981' : 'var(--gold)',
                        boxShadow: `0 0 12px ${isVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        flexShrink: 0,
                      }}
                    >
                      {isVerified ? <Check size={16} /> : <Clock size={16} />}
                    </div>

                    {/* Event Content Card */}
                    <div
                      style={{
                        flex: 1,
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.background = 'rgba(245,158,11,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                              {event.eventType}
                            </span>
                            <span style={{ color: 'var(--border)' }}>·</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{event.date}</span>
                          </div>
                          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {event.title}
                          </h3>
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 99,
                            background: isVerified ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                            color: isVerified ? '#10b981' : 'var(--gold)',
                            border: `1px solid ${isVerified ? 'rgba(16,185,129,0.25)' : 'var(--gold-border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {isVerified ? <ShieldCheck size={13} /> : <Clock size={13} />}
                          {isVerified ? `Verified (${Math.round(event.confidence * 100)}%)` : 'Self-Reported'}
                        </span>
                      </div>

                      <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: '6px 0 0' }}>
                        {event.description}
                      </p>

                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          {Object.entries(event.metadata).map(([k, v], mIdx) => (
                            <span
                              key={mIdx}
                              style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: 'rgba(255,255,255,0.04)',
                                color: '#94a3b8',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {k}: <strong style={{ color: '#e2e8f0' }}>{String(v)}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── MODAL: Self-Report Milestone ── */}
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
              zIndex: 999,
              padding: 16,
            }}
          >
            <div
              className="card-linear"
              style={{
                maxWidth: 480,
                width: '100%',
                padding: 24,
                borderRadius: 16,
                background: '#0d101c',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={18} color="var(--gold)" />
                  <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Report Career Milestone
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSelfReportModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSelfReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Outcome Type
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  >
                    <option value="EMPLOYED">Full-Time Employment</option>
                    <option value="PROMOTION">Internal Role Promotion</option>
                    <option value="APPRENTICESHIP">Paid Apprenticeship</option>
                    <option value="SELF_EMPLOYED">Independent Freelancing / Startup</option>
                    <option value="HIGHER_EDUCATION">Higher Education / Masters</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Employer / Company Name
                  </label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="e.g. Infosys, Swiggy, Zerodha, Startup"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Job Designation
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. SDE-1, Cloud DevOps Engineer"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Monthly Compensation (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    placeholder="e.g. 65000"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowSelfReportModal(false)}
                    style={{
                      padding: '9px 16px',
                      fontSize: 12.5,
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold"
                    style={{
                      padding: '9px 20px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Record Milestone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: 180-Day Longitudinal Check-in ── */}
        {showFollowUpModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: 16,
            }}
          >
            <div
              className="card-linear"
              style={{
                maxWidth: 480,
                width: '100%',
                padding: 24,
                borderRadius: 16,
                background: '#0d101c',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} color="var(--gold)" />
                  <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {showFollowUpModal.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFollowUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>
                    Are you currently employed / practicing in technology?
                  </label>
                  <input
                    type="checkbox"
                    checked={fuEmployed}
                    onChange={(e) => setFuEmployed(e.target.checked)}
                    style={{ width: 18, height: 18 }}
                  />
                </div>

                {fuEmployed && (
                  <>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                        Current Organization
                      </label>
                      <input
                        type="text"
                        value={fuEmployer}
                        onChange={(e) => setFuEmployer(e.target.value)}
                        placeholder="e.g. Infosys, Swiggy, Zerodha"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--bg-input, #0f111a)',
                          border: '1px solid var(--border)',
                          color: '#fff',
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                        Current Job Role
                      </label>
                      <input
                        type="text"
                        value={fuJobRole}
                        onChange={(e) => setFuJobRole(e.target.value)}
                        placeholder="e.g. SDE-1, Frontend Developer"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--bg-input, #0f111a)',
                          border: '1px solid var(--border)',
                          color: '#fff',
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                        Updated Monthly Salary (INR ₹)
                      </label>
                      <input
                        type="number"
                        value={fuSalary}
                        onChange={(e) => setFuSalary(e.target.value)}
                        placeholder="e.g. 65000"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--bg-input, #0f111a)',
                          border: '1px solid var(--border)',
                          color: '#fff',
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                    Curriculum Feedback & Relevance
                  </label>
                  <textarea
                    value={fuFeedback}
                    onChange={(e) => setFuFeedback(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowFollowUpModal(null)}
                    style={{
                      padding: '9px 16px',
                      fontSize: 12.5,
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold"
                    style={{
                      padding: '9px 20px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Check-in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
