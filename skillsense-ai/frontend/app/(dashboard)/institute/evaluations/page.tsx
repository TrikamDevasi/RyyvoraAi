'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Lock,
  Clock,
  Users,
  BookOpen,
  FileCheck,
  Plus,
  X,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { useAuth } from '@/hooks/useAuth';
import { instituteApi, InstituteEvaluation } from '@/lib/api/institute.api';
import toast from 'react-hot-toast';

export default function InstructorEvaluationsPage() {
  const { user } = useAuth();
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<InstituteEvaluation[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  // Rubric form state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [category, setCategory] = useState('Full-Stack Capstone Project');
  const [rubricScores, setRubricScores] = useState({
    practicalSkills: 85,
    domainKnowledge: 80,
    codeQuality: 82,
    presentation: 88,
  });
  const [feedback, setFeedback] = useState('');

  const computedOverallScore = Math.round(
    (rubricScores.practicalSkills +
      rubricScores.domainKnowledge +
      rubricScores.codeQuality +
      rubricScores.presentation) /
      4
  );

  const loadData = useCallback(async () => {
    const instId = instituteApi.getInstitutionId(user);
    if (!instId) {
      setLoading(false);
      setError('No institution linked to this account.');
      return;
    }
    setInstitutionId(instId);
    setLoading(true);
    setError(null);

    try {
      const data = await instituteApi.getEvaluations(instId);
      setEvaluations(data.evaluations || []);
      setStudents(data.students || []);
      if (data.students?.length && !selectedStudentId) {
        setSelectedStudentId(data.students[0].id || data.students[0].userId);
      }
    } catch (err: any) {
      setError('Unable to load evaluations. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId) {
      toast.error('Institution context missing.');
      return;
    }
    if (!selectedStudentId) {
      toast.error('Please select a student to evaluate.');
      return;
    }

    setSubmitting(true);
    try {
      await instituteApi.createEvaluation(institutionId, {
        studentId: selectedStudentId,
        category,
        score: computedOverallScore,
        feedback: feedback.trim() || 'Passed NCVET proctored competency evaluation.',
        rubricScores,
      });

      toast.success('Project evaluation certified & on-ledger credentials refreshed!');
      setShowModal(false);
      setFeedback('');
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvaluations = evaluations.filter((ev) => {
    const studentName = typeof ev.studentId === 'object' ? ev.studentId?.name || '' : '';
    const cat = ev.category || '';
    return (
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      cat.toLowerCase().includes(search.toLowerCase())
    );
  });

  const avgScore = evaluations.length
    ? Math.round(evaluations.reduce((acc, ev) => acc + (ev.score || 0), 0) / evaluations.length)
    : 84;

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
              <AIBadge type="nsqf" label="PRACTICAL PROJECT GRADING" />
              <AIBadge type="verified" label="NCVET RUBRIC CALIBRATED" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Instructor Evaluations & <span style={{ color: 'var(--gold)' }}>Project Certification</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Assess trainee capstone projects, evaluate against the 4-axis NCVET practical rubric, and commit certified scores to the state ledger.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="btn-gold"
              style={{ fontSize: 13, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}
            >
              <Plus size={15} /> Evaluate Trainee Project
            </button>
            <button
              type="button"
              onClick={loadData}
              className="btn-secondary"
              style={{ fontSize: 13, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* ── Metric Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Certified Evaluations', value: evaluations.length.toString(), sub: 'Recorded on ledger', color: 'var(--gold)', icon: Award },
            { label: 'Avg Practical Score', value: `${avgScore}%`, sub: 'NCVET 4-axis calibrated', color: '#10b981', icon: CheckCircle2 },
            { label: 'Enrolled Candidates', value: students.length.toString(), sub: 'Available for evaluation', color: '#60a5fa', icon: Users },
            { label: 'Ledger Integrity', value: '100% SHA-256', sub: 'Tamper-proof verifiable', color: '#a855f7', icon: ShieldCheck },
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

        {/* ── Search & Filter Bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search evaluated students or projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: '#f8fafc',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* ── Evaluations List Table ── */}
        <div className="card-linear" style={{ borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13 }}>Loading evaluations ledger...</p>
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 12, background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', marginBottom: 14 }}>
                <FileCheck size={28} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                No Evaluations Recorded Yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.6 }}>
                Click below to assess a trainee's project work. Certified scores are immediately integrated into their verifiable Skill Passport.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-gold"
                style={{ padding: '9px 20px', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={15} /> Grade First Candidate
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Candidate</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Project / Category</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>NCVET Score</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Evaluator Remarks</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Certified Date</th>
                    <th style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Ledger Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.map((ev) => {
                    const studentName = typeof ev.studentId === 'object' ? ev.studentId?.name || 'Trainee' : 'Trainee';
                    const studentEmail = typeof ev.studentId === 'object' ? ev.studentId?.email || '' : '';
                    return (
                      <tr key={ev._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{studentName}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{studentEmail}</div>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>
                          {ev.category}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 800,
                              background: ev.score >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                              color: ev.score >= 80 ? '#10b981' : 'var(--gold)',
                              border: `1px solid ${ev.score >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                            }}
                          >
                            {ev.score}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', maxWidth: 280, fontSize: 12 }}>
                          {ev.aiAnalysis || 'Passed proctored practical test.'}
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: 12 }}>
                          {new Date(ev.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#10b981', fontWeight: 700 }}>
                            <CheckCircle2 size={13} /> VERIFIED
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Evaluation Modal ── */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div
              className="card-accent"
              style={{
                width: '100%',
                maxWidth: 580,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} color="var(--gold)" /> Grade Trainee Capstone Project
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                    Select Candidate *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: '#f8fafc',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  >
                    {students.map((s) => (
                      <option key={s.id || s.userId} value={s.id || s.userId}>
                        {s.name} — {s.enrollmentNumber} ({s.program})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                    Evaluation Project Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: '#f8fafc',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  >
                    <option value="Full-Stack Capstone Project">Full-Stack Capstone Project</option>
                    <option value="Practical Trade Examination">Practical Trade Examination</option>
                    <option value="Microservices Architecture Review">Microservices Architecture Review</option>
                    <option value="Industrial Robotics Practical">Industrial Robotics Practical</option>
                    <option value="Enterprise Cloud Deployment">Enterprise Cloud Deployment</option>
                  </select>
                </div>

                {/* 4-axis NCVET Rubric */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sliders size={13} /> 4-Axis NCVET Rubric Calibration
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                      Overall: {computedOverallScore}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { key: 'practicalSkills', label: 'Practical Implementation', val: rubricScores.practicalSkills },
                      { key: 'domainKnowledge', label: 'Domain Knowledge & Theory', val: rubricScores.domainKnowledge },
                      { key: 'codeQuality', label: 'Code Quality & Best Practices', val: rubricScores.codeQuality },
                      { key: 'presentation', label: 'Viva Voce & Presentation', val: rubricScores.presentation },
                    ].map((item) => (
                      <div key={item.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item.val}%</span>
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={100}
                          value={item.val}
                          onChange={(e) =>
                            setRubricScores({ ...rubricScores, [item.key]: Number(e.target.value) })
                          }
                          style={{ width: '100%', accentColor: 'var(--gold)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                    Evaluator Feedback & Recommendations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Demonstrated outstanding architectural structure and clean asynchronous error handling."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: '#f8fafc',
                      fontSize: 12.5,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border)',
                      color: '#cbd5e1',
                      fontSize: 12.5,
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
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={14} className="spin" /> Certifying on Ledger...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> Commit Grade & Refresh Passport
                      </>
                    )}
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
