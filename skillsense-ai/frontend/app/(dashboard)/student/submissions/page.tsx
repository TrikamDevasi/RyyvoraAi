'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Code2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentSubmissionsPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [lastScore, setLastScore] = useState<number | null>(null);

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true);

        try {
            const analysis = await studentApi.analyzeSkills({
                text: `${title}: ${description}`,
                githubUrl: repoUrl.trim() || undefined,
                projects: [title, description].filter(Boolean),
            });

            const score = analysis.overallScore;
            if (typeof score !== 'number') {
                toast.error('The analysis did not return a competency score. Please try again.');
                setSubmitting(false);
                return;
            }
            setLastScore(score);

            // Record assessment submission
            await studentApi.submitAssessmentDirect({
                category: title,
                score,
                totalQuestions: 10,
                aiAnalysis: analysis,
            });

            toast.success(`Assessment submitted! Score: ${score}% recorded to Skill Passport.`);
            setTitle('');
            setRepoUrl('');
            setDescription('');

            // Reload profile
            const updated = await studentApi.getMyProfile();
            setProfile(updated);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || 'Failed to submit project for evaluation.');
        } finally {
            setSubmitting(false);
        }
    };
    const assessments = (profile?.skills as any[]) || [];

    return (
        <ErrorBoundary>
            <div style={{ color: 'var(--text-primary)', maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Header */}
                <div>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        Project & Practical Submissions
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
                        Submit practical projects and code repositories for objective skill verification and credential assessment.
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={150} width="100%" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Submission Form Card */}
                        <div style={{ padding: 22, background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Code2 size={18} color="var(--gold)" /> Submit Practical Project or Repository
                            </h3>

                            {lastScore !== null && (
                                <div style={{ padding: 12, background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 8, color: 'var(--success)', marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 size={16} /> Latest submission evaluated: Score <strong>{lastScore}%</strong> (Synced to digital passport)
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>Project Title / Key Competency</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Solar PV Microgrid Synchronization Controller"
                                        required
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>Repository / Project URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={repoUrl}
                                        onChange={e => setRepoUrl(e.target.value)}
                                        placeholder="https://github.com/your-username/project-name"
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>Description & Implementation Notes</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Explain the technical specifications, standards, and tests implemented..."
                                        rows={3}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !title.trim()}
                                    className="btn-gold"
                                    style={{
                                        alignSelf: 'flex-start', padding: '8px 20px', fontSize: 12.5, fontWeight: 650,
                                        display: 'flex', alignItems: 'center', gap: 6, cursor: submitting ? 'not-allowed' : 'pointer',
                                        opacity: submitting ? 0.7 : 1, marginTop: 4, borderRadius: 6,
                                    }}
                                >
                                    {submitting ? 'Evaluating Submission...' : <><Send size={14} /> Submit Assessment for Automated Grading</>}
                                </button>
                            </form>
                        </div>

                        {/* Submissions List */}
                        <div style={{ padding: 22, background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                                Evaluated Skills & Verified Ledgers ({assessments.length})
                            </h3>
                            {assessments.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No submissions evaluated yet. Complete an assessment or submit a project above.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {assessments.map((a: any, idx: number) => (
                                        <div
                                            key={a._id || idx}
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: 6,
                                                background: 'var(--bg-surface-elevated)',
                                                border: '1px solid var(--border)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 12,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 650, fontSize: 13, color: 'var(--text-primary)' }}>
                                                    {a.title || (typeof a.skillId === 'object' && a.skillId?.name ? a.skillId.name : `Technical Module ${idx + 1}`)}
                                                </div>
                                                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {a.date || a.lastAssessed ? new Date(a.date || a.lastAssessed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Credential'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        padding: '2px 8px',
                                                        borderRadius: 4,
                                                        background: a.status === 'PASSED' ? 'var(--success-bg)' : 'var(--error-bg)',
                                                        color: a.status === 'PASSED' ? 'var(--success)' : 'var(--error)',
                                                        border: `1px solid ${a.status === 'PASSED' ? 'var(--success-border)' : 'var(--error-border)'}`,
                                                    }}
                                                >
                                                    {a.status}
                                                </span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', fontVariantNumeric: 'tabular-nums' }}>
                                                    {a.score}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
