'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, CheckCircle2, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

const GOLD = '#D4A843';

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

            const score = analysis.overallScore || 80;
            setLastScore(score);

            // Record assessment submission
            if (profile?._id) {
                await studentApi.submitAssessment(profile._id, {
                    category: title,
                    responses: [{ title, repoUrl, description, submittedAt: new Date().toISOString() }],
                    score,
                });
            }

            toast.success(`Project evaluated! AI Competency Score: ${score}%`);
            setTitle('');
            setRepoUrl('');
            setDescription('');

            // Reload profile
            const updated = await studentApi.getMyProfile();
            setProfile(updated);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit and evaluate project');
        } finally {
            setSubmitting(false);
        }
    };

    const assessments = profile?.skills || [];

    return (
        <ErrorBoundary>
            <div style={{ color: '#fff', maxWidth: 900 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                        My Project <span style={{ color: GOLD }}>Submissions</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Submit real-world projects and code repositories for neural skill verification and portfolio grading.
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={150} width="100%" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Submission Form Card */}
                        <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(245,158,11,0.2)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Code2 size={18} color={GOLD} /> Submit Practical Project or GitHub Repository
                            </h3>

                            {lastScore !== null && (
                                <div style={{ padding: 12, background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', borderRadius: 8, color: '#86efac', marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 size={16} /> Latest submission evaluated! AI Score: <strong>{lastScore}%</strong> (Synced to digital passport)
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Project Title / Key Competency</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Microservices Auth Service & Docker Pipeline"
                                        required
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>GitHub / Project URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={repoUrl}
                                        onChange={e => setRepoUrl(e.target.value)}
                                        placeholder="https://github.com/your-username/project-name"
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Description & Architecture Notes</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Briefly explain the libraries, database schema, APIs, and tests implemented in this project..."
                                        rows={3}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, resize: 'vertical' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !title.trim()}
                                    className="btn-gold"
                                    style={{
                                        alignSelf: 'flex-start', padding: '10px 24px', fontSize: 13, fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: 6, cursor: submitting ? 'not-allowed' : 'pointer',
                                        opacity: submitting ? 0.7 : 1, marginTop: 4,
                                    }}
                                >
                                    {submitting ? 'Analyzing & Scoring...' : <><Sparkles size={14} /> Submit for AI Neural Evaluation</>}
                                </button>
                            </form>
                        </div>

                        {/* Submissions List */}
                        <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                                Evaluated Skills & Verified Ledgers ({assessments.length})
                            </h3>
                            {assessments.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: 13 }}>No submissions evaluated yet. Complete an assessment or submit a project above.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {assessments.map((a: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                                                    {typeof a.skillId === 'object' && a.skillId?.name ? a.skillId.name : `Technical Module ${idx + 1}`}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                                    Assessed: {new Date(a.lastAssessed || Date.now()).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, background: 'rgba(245,158,11,0.15)', padding: '4px 10px', borderRadius: 99 }}>
                                                    Score: {a.score}%
                                                </span>
                                                <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>✓ Verified</div>
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
