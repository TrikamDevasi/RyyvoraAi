'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const AMBER = '#F59E0B';

interface TestInfo {
    id: string;
    title: string;
    subject: string;
    duration: number;
    questions: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    skills: string[];
}

const AVAILABLE_TESTS: TestInfo[] = [
    {
        id: 'TEST001', title: 'React.js & Modern Web Architecture', subject: 'Frontend Engineering',
        duration: 30, questions: 20, difficulty: 'Medium',
        description: 'Test your knowledge of React hooks, server components, JSX, and component lifecycle.',
        skills: ['React.js', 'Next.js', 'State Management'],
    },
    {
        id: 'TEST002', title: 'Data Structures & Algorithmic Thinking', subject: 'Computer Science',
        duration: 45, questions: 25, difficulty: 'Hard',
        description: 'Problem solving on trees, graphs, dynamic programming, and complexity optimization.',
        skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    },
    {
        id: 'TEST003', title: 'Node.js, Express & Microservices', subject: 'Backend Engineering',
        duration: 35, questions: 20, difficulty: 'Medium',
        description: 'REST API design, auth middleware, Redis caching, and error resilience in Express.',
        skills: ['Node.js', 'Express', 'JWT', 'Redis'],
    },
    {
        id: 'TEST004', title: 'SQL & Relational Database Design', subject: 'Data Architecture',
        duration: 40, questions: 22, difficulty: 'Medium',
        description: 'Schema indexing, ACID transactions, aggregation queries, and schema normalization.',
        skills: ['SQL', 'MongoDB', 'Indexing'],
    },
];

export default function TestsPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => setProfile(data))
            .catch(() => {});
    }, []);

    const assessedNames = (profile?.skills || [])
        .map((s: any) => (typeof s.skillId === 'object' && s.skillId?.name) ? s.skillId.name.toLowerCase() : String(s.skillId || '').toLowerCase())
        .filter(Boolean);

    const completedScore = (test: TestInfo): number | null => {
        const skills = profile?.skills || [];
        const skill = skills.find((s: any) => {
            const name = (typeof s.skillId === 'object' && s.skillId?.name) ? s.skillId.name : String(s.skillId || '');
            return test.skills.some((ts) => name.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(name.toLowerCase()));
        }) as any;
        return typeof skill?.score === 'number' ? skill.score : null;
    };

    return (
        <ErrorBoundary>
            <div style={{ color: '#fff', maxWidth: 1000 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                        Skill Assessments & <span style={{ color: GOLD }}>Certifications</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        National standard assessment catalogue, calibrated to NSQF Level {profile?.nsqfLevel ? `L${profile.nsqfLevel}` : '(level assigned after first assessment)'}
                    </p>
                </div>

                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.25)', marginBottom: 20, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6 }}>
                    Scores are recorded on your passport only after you complete the full assessment flow — results below reflect your actual verified evaluations.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    {AVAILABLE_TESTS.map(test => {
                        const score = completedScore(test);
                        const done = score != null;
                        return (
                            <div key={test.id} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase' }}>{test.subject}</span>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                            background: done ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)',
                                            color: done ? '#22c55e' : GOLD,
                                        }}>
                                            {done ? `Score: ${score}%` : test.difficulty}
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

                                    {done ? (
                                        <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34,197,94,0.1)', borderRadius: 8, color: '#22c55e', fontSize: 12, fontWeight: 700 }}>
                                            ✓ Verified & Saved to Skill Passport
                                        </div>
                                    ) : (
                                        <Link href="/student/assessment" className="btn-gold" style={{ width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                                            Take Assessment Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ErrorBoundary>
    );
}