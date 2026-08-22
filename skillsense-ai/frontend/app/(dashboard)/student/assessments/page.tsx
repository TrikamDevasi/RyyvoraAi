'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, RotateCcw, Lock, Play } from 'lucide-react';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface MockAssessment {
    id: string;
    title: string;
    skill: string;
    durationMin: number;
    questions: number;
    status: 'completed' | 'available' | 'locked';
    score?: number;
    completedDate?: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const assessments: MockAssessment[] = [
    { id: 'A1', title: 'React.js Fundamentals', skill: 'React.js', durationMin: 30, questions: 25, status: 'completed', score: 82, completedDate: '2026-02-15', difficulty: 'Intermediate' },
    { id: 'A2', title: 'Node.js API Development', skill: 'Node.js', durationMin: 25, questions: 20, status: 'completed', score: 74, completedDate: '2026-02-22', difficulty: 'Intermediate' },
    { id: 'A3', title: 'TypeScript Advanced Patterns', skill: 'TypeScript', durationMin: 45, questions: 35, status: 'available', difficulty: 'Advanced' },
    { id: 'A4', title: 'MongoDB Certification', skill: 'MongoDB', durationMin: 20, questions: 15, status: 'completed', score: 88, completedDate: '2026-03-01', difficulty: 'Beginner' },
    { id: 'A5', title: 'Docker & Kubernetes Essentials', skill: 'Docker/K8s', durationMin: 35, questions: 28, status: 'available', difficulty: 'Intermediate' },
    { id: 'A6', title: 'System Design Patterns', skill: 'System Design', durationMin: 40, questions: 30, status: 'locked', difficulty: 'Advanced' },
];

const DIFF_COLORS = { Beginner: '#22c55e', Intermediate: GOLD, Advanced: '#ef4444' };

export default function AssessmentsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'completed' | 'available' | 'locked'>('all');

    const filtered = assessments.filter((a) => filter === 'all' || a.status === filter);
    const completed = assessments.filter((a) => a.status === 'completed');
    const avgScore = Math.round(completed.length > 0 ? (completed.reduce((s, a) => s + (a.score ?? 0), 0) / completed.length) : 0);

    return (
        <div style={{ color: WHITE, maxWidth: 960 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                    <FileCheck size={28} style={{ color: GOLD, marginRight: 10 }} /> <span style={{ color: GOLD }}>Assessments</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Skill assessments & certification progress
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Completed', value: completed.length, total: assessments.length, color: '#22c55e' },
                    { label: 'Avg Score', value: `${avgScore}/100`, color: GOLD },
                    { label: 'Available', value: assessments.filter((a) => a.status === 'available').length, color: '#3b82f6' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            padding: '14px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${stat.color}33`,
                            borderRadius: 12,
                            minWidth: 120,
                        }}
                    >
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: stat.color }}>
                            {stat.value}
                            {stat.total && <span style={{ fontSize: 14, color: MUTED }}>/{stat.total}</span>}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {(['all', 'completed', 'available', 'locked'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '7px 16px',
                            borderRadius: 8,
                            border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.12)'}`,
                            background: filter === f ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.03)',
                            color: filter === f ? GOLD : MUTED,
                            fontSize: 12,
                            fontWeight: filter === f ? 700 : 400,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Assessment cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((assessment) => (
                    <div
                        key={assessment.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${assessment.status === 'completed' ? 'rgba(34,197,94,0.25)' : assessment.status === 'locked' ? 'rgba(255,255,255,0.06)' : 'rgba(212,168,67,0.2)'}`,
                            borderRadius: 12,
                            padding: '16px 20px',
                            opacity: assessment.status === 'locked' ? 0.6 : 1,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: WHITE }}>
                                        {assessment.title}
                                    </h3>
                                    <span style={{ fontSize: 10, color: DIFF_COLORS[assessment.difficulty], background: `${DIFF_COLORS[assessment.difficulty]}18`, padding: '2px 8px', borderRadius: 20, border: `1px solid ${DIFF_COLORS[assessment.difficulty]}40`, fontWeight: 700 }}>
                                        {assessment.difficulty}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: MUTED }}>
                                    {assessment.questions} questions • {assessment.durationMin} min • {assessment.skill}
                                    {assessment.completedDate && ` • Completed ${new Date(assessment.completedDate).toLocaleDateString('en-IN')}`}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                {assessment.score !== undefined && (
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            border: `2px solid ${assessment.score >= 80 ? '#22c55e' : GOLD}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: assessment.score >= 80 ? '#22c55e' : GOLD,
                                        }}
                                    >
                                        {assessment.score}
                                    </div>
                                )}
                                <button
                                    disabled={assessment.status === 'locked'}
                                    onClick={() => router.push(`/student/assessment?topic=${encodeURIComponent(assessment.skill)}&level=${encodeURIComponent(assessment.difficulty)}`)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        border: 'none',
                                        background: assessment.status === 'completed'
                                            ? 'rgba(34,197,94,0.15)'
                                            : assessment.status === 'locked'
                                                ? 'rgba(255,255,255,0.06)'
                                                : `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                                        color: assessment.status === 'completed' ? '#22c55e' : assessment.status === 'locked' ? MUTED : '#1a0f00',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        cursor: assessment.status === 'locked' ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {assessment.status === 'completed' ? <><RotateCcw size={12} style={{ marginRight: 6 }}/> Retake</> : assessment.status === 'locked' ? <><Lock size={12} style={{ marginRight: 6 }}/> Locked</> : <><Play size={12} style={{ marginRight: 6 }} fill="currentColor" /> Start</>}
                                </button>
                            </div>
                        </div>

                        {/* Progress bar for completed */}
                        {assessment.score !== undefined && (
                            <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${assessment.score}%`, background: `linear-gradient(90deg, ${assessment.score >= 80 ? '#22c55e' : GOLD}, rgba(212,168,67,0.4))`, transition: 'width 0.8s ease' }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
