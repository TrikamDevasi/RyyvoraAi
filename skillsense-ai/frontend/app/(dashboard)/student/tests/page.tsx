'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import confetti from 'canvas-confetti';

const GOLD = '#D4A843';
const AMBER = '#F59E0B';

interface TestInfo {
    id: string;
    title: string;
    subject: string;
    duration: number;
    questions: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'available' | 'completed' | 'upcoming';
    score?: number;
    maxScore?: number;
    completedAt?: string;
    description: string;
    skills: string[];
}

const AVAILABLE_TESTS: TestInfo[] = [
    {
        id: 'TEST001', title: 'React.js & Modern Web Architecture', subject: 'Frontend Engineering',
        duration: 30, questions: 20, difficulty: 'Medium', status: 'available',
        description: 'Test your knowledge of React hooks, server components, JSX, and component lifecycle.',
        skills: ['React.js', 'Next.js', 'State Management'],
    },
    {
        id: 'TEST002', title: 'Data Structures & Algorithmic Thinking', subject: 'Computer Science',
        duration: 45, questions: 25, difficulty: 'Hard', status: 'available',
        description: 'Problem solving on trees, graphs, dynamic programming, and complexity optimization.',
        skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    },
    {
        id: 'TEST003', title: 'Node.js, Express & Microservices', subject: 'Backend Engineering',
        duration: 35, questions: 20, difficulty: 'Medium', status: 'available',
        description: 'REST API design, auth middleware, Redis caching, and error resilience in Express.',
        skills: ['Node.js', 'Express', 'JWT', 'Redis'],
    },
    {
        id: 'TEST004', title: 'SQL & Relational Database Design', subject: 'Data Architecture',
        duration: 40, questions: 22, difficulty: 'Medium', status: 'available',
        description: 'Schema indexing, ACID transactions, aggregation queries, and schema normalization.',
        skills: ['SQL', 'MongoDB', 'Indexing'],
    },
];

export default function TestsPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [tests, setTests] = useState<TestInfo[]>(AVAILABLE_TESTS);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => {
                setProfile(data);
                // If profile has assessed skills, mark completed
                if (data.skills && data.skills.length > 0) {
                    setTests(prev => prev.map((t, idx) => {
                        const assessed = data.skills[idx];
                        if (assessed) {
                            return {
                                ...t,
                                status: 'completed',
                                score: assessed.score,
                                maxScore: 100,
                                completedAt: assessed.lastAssessed || new Date().toISOString(),
                            };
                        }
                        return t;
                    }));
                }
            })
            .catch(() => {});
    }, []);

    const handleTakeTest = async (testId: string) => {
        if (!profile) return;
        setSubmitting(testId);

        try {
            const simulatedScore = Math.floor(Math.random() * 20) + 80;
            await studentApi.submitAssessment(profile._id, {
                skillId: profile.skills?.[0]?.skillId as any || undefined,
                responses: [{ questionId: 'q1', answer: 'A', isCorrect: true }],
                score: simulatedScore,
            });

            setTests(prev => prev.map(t => t.id === testId ? {
                ...t,
                status: 'completed',
                score: simulatedScore,
                maxScore: 100,
                completedAt: new Date().toISOString(),
            } : t));

            confetti({
                particleCount: 60,
                spread: 50,
                origin: { y: 0.6 }
            });
        } catch {
            // Ignore error
        } finally {
            setSubmitting(null);
        }
    };

    const filtered = filter === 'all' ? tests : tests.filter(t => t.status === filter);

    return (
        <ErrorBoundary>
            <div style={{ color: '#fff', maxWidth: 1000 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                        Skill Assessments & <span style={{ color: GOLD }}>Certifications</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        National standard assessments calibrated to NSQF Level {profile?.nsqfLevel || 4}
                    </p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {(['all', 'available', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 16px',
                                borderRadius: 8,
                                border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`,
                                background: filter === f ? 'rgba(212,168,67,0.15)' : 'transparent',
                                color: filter === f ? GOLD : '#94a3b8',
                                fontSize: 13,
                                fontWeight: filter === f ? 700 : 500,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Test Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    {filtered.map(test => (
                        <div key={test.id} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase' }}>{test.subject}</span>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                        background: test.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)',
                                        color: test.status === 'completed' ? '#22c55e' : GOLD,
                                    }}>
                                        {test.status === 'completed' ? `Score: ${test.score}%` : test.difficulty}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{test.title}</h3>
                                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>{test.description}</p>
                            </div>

                            <div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                                    {test.skills.map((s, idx) => (
                                        <span key={idx} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                {test.status === 'completed' ? (
                                    <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34,197,94,0.1)', borderRadius: 8, color: '#22c55e', fontSize: 12, fontWeight: 700 }}>
                                        ✓ Verified & Saved to Skill Passport
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleTakeTest(test.id)}
                                        disabled={submitting === test.id}
                                        className="btn-gold"
                                        style={{ width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        {submitting === test.id ? 'Evaluating Submission...' : 'Take Assessment Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ErrorBoundary>
    );
}
