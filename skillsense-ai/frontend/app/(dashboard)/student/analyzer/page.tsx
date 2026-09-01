'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { ScanningState } from '@/components/ui/ScanningState';
import { ConfidenceScore } from '@/components/ui/ConfidenceScore';
import { AIBadge } from '@/components/ui/AIBadge';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import {
  Brain,
  Code,
  Github,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIAnalyzerPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [mode, setMode] = useState<'text' | 'github' | 'projects'>('text');
  const [resumeText, setResumeText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    studentApi
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        if (data.program) {
          setResumeText(
            `Candidate studying ${data.program}, NSQF Level ${data.nsqfLevel}. Proficient in full-stack web development, RESTful APIs, database schema modeling, and modern software engineering practices.`
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAnalyzing(true);

    try {
      const payload = {
        text: resumeText.trim(),
        githubUrl: githubUrl.trim() || undefined,
        projects: projectDesc.trim() ? [projectDesc.trim()] : undefined,
        skills: profile?.skills
          ?.map((s: any) => (typeof s.skillId === 'object' ? s.skillId?.name : String(s.skillId)))
          .filter(Boolean),
      };

      const data = await studentApi.analyzeSkills(payload);
      setResult(data);
      toast.success('AI skill competencies extracted & synced with passport!');

      // Refresh local profile
      studentApi.getMyProfile().then((p) => setProfile(p)).catch(() => {});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Skill analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1040, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <AIBadge type="ai" label="NEURAL SKILL ENGINE" />
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            AI Skill Intelligence & Extraction
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
            Extract granular vocational competencies from resumes, GitHub code repositories, and submitted coursework.
          </p>
        </div>

        {/* Input Card */}
        <div className="card-linear" style={{ padding: 22, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            {[
              { key: 'text', label: 'Resume / Bio Text', icon: <FileText size={14} /> },
              { key: 'github', label: 'GitHub Repository URL', icon: <Github size={14} /> },
              { key: 'projects', label: 'Project Architecture', icon: <Code size={14} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: mode === tab.key ? 'rgba(245,158,11,0.12)' : 'transparent',
                  border: `1px solid ${mode === tab.key ? 'var(--gold-border)' : 'transparent'}`,
                  color: mode === tab.key ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'text' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                  Resume Text or Coursework Summary
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your technical resume, coursework summary, project bullet points, or skills overview..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                    lineHeight: 1.5,
                    resize: 'vertical',
                  }}
                />
              </div>
            )}

            {mode === 'github' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                  GitHub Public Repository or Profile URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username/repository-name"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
              </div>
            )}

            {mode === 'projects' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                  Project Technical Architecture Notes
                </label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Describe your technical projects, databases used, API endpoints, system design decisions, and testing setup..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                    lineHeight: 1.5,
                    resize: 'vertical',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Evaluates competencies aligned with NSQF Level {profile?.nsqfLevel || 4}
              </span>

              <button
                type="submit"
                disabled={analyzing}
                className="btn-gold"
                style={{
                  padding: '9px 24px',
                  fontSize: 13,
                  cursor: analyzing ? 'not-allowed' : 'pointer',
                  opacity: analyzing ? 0.7 : 1,
                }}
              >
                <Sparkles size={14} /> Run Live Neural Evaluation
              </button>
            </div>
          </form>
        </div>

        {/* Scanning State during execution */}
        {analyzing && (
          <div style={{ marginBottom: 24 }}>
            <ScanningState
              title="Running Multi-Modal Skill Extraction"
              subtitle="Processing technical keywords, syntax trees, and architecture patterns against NSQF benchmarks..."
              stage="Neural Inference Layer · Llama-3.3-70b-versatile"
            />
          </div>
        )}

        {/* Results View */}
        {result && !analyzing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Score Banner */}
            <div
              className="card-accent"
              style={{
                padding: 22,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AIBadge type="verified" label="EVALUATION VERIFIED" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tier: <strong style={{ color: '#f8fafc' }}>{result.experienceLevel}</strong></span>
                </div>
                <div className="font-display" style={{ fontSize: 30, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                  {result.overallScore}<span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
                  {result.summary}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                {typeof result.confidence === 'number' && <ConfidenceScore score={result.confidence} size="md" /> }
                <div style={{ fontSize: 11, color: '#10b981', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <ShieldCheck size={13} /> Synced to Skill Passport
                </div>
              </div>
            </div>

            {/* Competency Grids */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {/* Technical Skills */}
              <div className="card-linear" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Code size={15} color="var(--gold)" /> Extracted Technical Competencies
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(result.technicalSkills || []).map((s: any, idx: number) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{s.name}</span>
                        <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{s.score}%</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.score}%`, height: '100%', background: 'var(--gold)', borderRadius: 3 }} />
                      </div>
                      {s.evidence && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                          Evidence: {s.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain & Architectural Dimensions */}
              <div className="card-linear" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={15} color="#60a5fa" /> Domain & Architectural Dimensions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(result.competencies || []).map((c: any, idx: number) => (
                    <div key={idx} style={{ padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                        <span style={{ color: '#f8fafc' }}>{c.category}</span>
                        <span style={{ color: '#60a5fa' }}>{c.score}%</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{c.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="card-linear" style={{ padding: 16, borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={15} /> Verified Key Strengths
                </div>
                {(result.strengths || []).map((st: string, idx: number) => (
                  <div key={idx} style={{ fontSize: 12.5, color: '#cbd5e1', marginBottom: 5 }}>• {st}</div>
                ))}
              </div>

              <div className="card-linear" style={{ padding: 16, borderLeft: '3px solid #ef4444' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={15} /> Growth & Upskilling Deficiencies
                </div>
                {(result.weaknesses || []).map((w: string, idx: number) => (
                  <div key={idx} style={{ fontSize: 12.5, color: '#cbd5e1', marginBottom: 5 }}>• {w}</div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <AIInsightCard
                title="Actionable Next Milestones"
                badgeText="AI RECOMMENDED PATH"
                insight={result.recommendations.join(' · ')}
                actionText="Explore Matching Career Opportunities"
                actionHref="/student/career"
                category="NSQF Upskilling"
              />
            )}
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
