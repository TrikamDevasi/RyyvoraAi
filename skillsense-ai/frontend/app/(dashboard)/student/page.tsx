'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Radar, PolarGrid, PolarAngleAxis, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { Skeleton } from '@/components/ui/skeleton';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';

const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });

const GOLD = '#F59E0B';
const GOLD_L = '#FBBF24';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const Tip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(10, 10, 20, 0.95)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                minWidth: '160px'
            }}>
                <p style={{ color: '#F59E0B', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} style={{ color: '#ffffff', fontSize: '13px', margin: '2px 0' }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function StudentPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [careerData, setCareerData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        studentApi.getMyProfile()
            .then((data: StudentProfile) => {
                if (!mounted) return;
                setProfile(data);
                setLoading(false);
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: [GOLD, GOLD_L, '#ffffff']
                });

                if (data._id) {
                    studentApi.getCareerPaths(data._id)
                        .then((res: any) => { if (mounted) setCareerData(res); })
                        .catch(() => {});
                }
            })
            .catch((_err: unknown) => {
                if (!mounted) return;
                setError('Failed to load student profile. Please ensure you are logged in.');
                setLoading(false);
            });

        return () => { mounted = false; };
    }, []);

    const studentName = profile?.userId?.name || 'Student';
    const overallScore = profile?.overallScore || 75;
    const nsqfLevel = profile?.nsqfLevel || 4;
    const placementStatus = profile?.placementStatus || 'seeking';
    const skills = profile?.skills || [];

    const radarData = skills.length > 0
        ? skills.map((s: any) => ({
            subject: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : 'Core Skill',
            score: s.score || 70,
            bench: 85,
        }))
        : [
            { subject: 'Data Structures', score: 78, bench: 85 },
            { subject: 'Full Stack', score: 82, bench: 85 },
            { subject: 'Cloud / DevOps', score: 65, bench: 80 },
            { subject: 'System Design', score: 60, bench: 75 },
            { subject: 'Communication', score: 88, bench: 85 },
        ];

    const progressData = [
        { month: 'Jan', score: Math.max(40, overallScore - 18) },
        { month: 'Feb', score: Math.max(45, overallScore - 14) },
        { month: 'Mar', score: Math.max(50, overallScore - 10) },
        { month: 'Apr', score: Math.max(55, overallScore - 6) },
        { month: 'May', score: Math.max(60, overallScore - 3) },
        { month: 'Current', score: overallScore },
    ];

    const careers = careerData?.topCareerPaths || [
        { title: 'Full-Stack Developer', estimatedSalary: { min: 600000, max: 1200000 }, matchPercent: 86, timeToAchieve: '3 months' },
        { title: 'Cloud Solutions Engineer', estimatedSalary: { min: 800000, max: 1500000 }, matchPercent: 78, timeToAchieve: '4 months' },
        { title: 'DevOps Specialist', estimatedSalary: { min: 900000, max: 1600000 }, matchPercent: 72, timeToAchieve: '6 months' },
    ];

    return (
        <ErrorBoundary>
            <FadeIn style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 className="font-display text-gradient-gold" style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>
                            Student Dashboard
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4, fontWeight: 500 }}>
                            Welcome back, {studentName}
                        </p>
                    </div>
                    <LiveBadge label="CREDENTIAL VERIFIED" />
                </div>

                {/* KPI Cards Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', 
                    gap: 12 
                }}>
                    {[
                        { label: 'Overall Skill Score', value: `${overallScore}/100`, color: GOLD },
                        { label: 'Placement Status', value: placementStatus === 'placed' ? 'Placed' : 'Seeking Job', color: '#22c55e' },
                        { label: 'Skills Assessed', value: `${skills.length || 5}`, color: AMBER },
                        { label: 'NSQF Level', value: `Level ${nsqfLevel}`, color: ORANGE },
                    ].map((stat, i) => (
                        <div key={i} className="stat-card glass" style={{ borderTop: `2px solid ${stat.color}60`, padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {loading ? (
                                <>
                                    <Skeleton width={32} height={20} style={{ marginBottom: 12 }} />
                                    <Skeleton width="60%" height={28} style={{ marginBottom: 8 }} />
                                </>
                            ) : (
                                <>
                                    <div className="font-display text-gradient-gold" style={{ fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
                                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
                    gap: 16 
                }}>
                    {/* Skill Competency Radar */}
                    <div className="glass-card" style={{ padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#fff' }}>
                            Skill Competency Map
                        </h3>
                        <div style={{ height: 260, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Radar name="My Score" dataKey="score" stroke={GOLD} fill={GOLD} fillOpacity={0.4} />
                                    <Radar name="Benchmark" dataKey="bench" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                    <Tooltip content={<Tip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Growth Trajectory */}
                    <div className="glass-card" style={{ padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#fff' }}>
                            Score Growth Trajectory
                        </h3>
                        <div style={{ height: 260, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                                    <Tooltip content={<Tip />} />
                                    <Area type="monotone" dataKey="score" stroke={GOLD} fill="rgba(245,158,11,0.2)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top AI Career Recommendations */}
                <div className="glass-card" style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                                AI Recommended Career Pathways
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }}>
                                Personalized opportunities based on your skills & NSQF Level {nsqfLevel}
                            </p>
                        </div>
                        <Sparkles size={18} color={GOLD} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 14 }}>
                        {careers.slice(0, 3).map((c: any, idx: number) => (
                            <div key={idx} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{c.title || c.role}</h4>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 99 }}>
                                        {c.matchPercent || c.match || 80}% Match
                                    </span>
                                </div>
                                <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                                    Est. Salary: <strong style={{ color: '#22c55e' }}>{typeof c.estimatedSalary === 'object' ? `₹${(c.estimatedSalary.min/100000).toFixed(1)}L - ₹${(c.estimatedSalary.max/100000).toFixed(1)}L` : c.salaryRange || '₹6L - ₹12L'}</strong>
                                </div>
                                <div style={{ marginTop: 4, fontSize: 11, color: '#64748b' }}>
                                    Timeline: {c.timeToAchieve || c.timeToReady || '3-6 months'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </ErrorBoundary>
    );
}
