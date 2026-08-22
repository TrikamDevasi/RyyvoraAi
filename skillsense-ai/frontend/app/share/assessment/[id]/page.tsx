'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Loader2, CheckCircle2, AlertTriangle, TrendingUp, User, Calendar, Share2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SharedAssessment() {
    const params = useParams();
    const { request } = useApi();
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState<any>(null);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const res = await request('GET', `/ai/assessment/${params.id}`);
                if (res.data.success) {
                    setAssessment(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchAssessment();
    }, [params.id, request]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#08060f] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-500" size={48} />
                <p className="text-slate-400 font-medium">Loading Verifiable Skill Record...</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen bg-[#08060f] flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <AlertTriangle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-white">Assessment Not Found</h1>
                <p className="text-slate-400 max-w-md">The skill record you are looking for might have been removed or the link is incorrect.</p>
                <a href="/" className="mt-6 px-8 py-3 bg-amber-500 text-amber-950 font-bold rounded-xl">Go Home</a>
            </div>
        );
    }

    const GOLD = '#D4A843';

    return (
        <div className="min-h-screen bg-[#08060f] py-12 px-4 selection:bg-amber-500/30">
            <div className="max-w-3xl mx-auto">
                {/* Header / Brand */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
                        <Award size={14} /> Verifiable Skill Passport
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">SkillSense <span className="text-amber-500">AI</span></h1>
                    <p className="text-slate-400">Official AI-Verified Assessment Record</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
                >
                    {/* User Card */}
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-amber-500/5 to-transparent">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-amber-500 shadow-inner overflow-hidden">
                            {assessment.student?.profilePicture ? (
                                <img src={assessment.student.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-white">{assessment.student?.name || 'SkillSense Learner'}</h2>
                            <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                                <Calendar size={14} />
                                Completed on {new Date(assessment.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="text-center bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl">
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Score</p>
                            <p className="text-3xl font-black text-white">{assessment.score}%</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Topic Banner */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{assessment.category} Proficiency</h3>
                                <p className="text-sm text-slate-500">Assessment Level: <span className="text-amber-500 font-bold">{assessment.level}</span></p>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-tighter">
                                Verified
                            </div>
                        </div>

                        {/* Analysis Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Verified Strengths
                                </h4>
                                <ul className="space-y-3">
                                    {assessment.strengths?.map((s: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} /> Growth Areas
                                </h4>
                                <ul className="space-y-3">
                                    {assessment.weakAreas?.map((w: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Share2 size={80} />
                            </div>
                            <h4 className="text-white font-bold text-sm mb-3">AI Competency Insight</h4>
                            <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-amber-500 pl-4 py-1">
                                "{assessment.improvementPlan}"
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-white/[0.03] border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500 mb-6">
                            This record is cryptographically tied to the SkillSense AI platform and represents a legitimate skill assessment event. 
                            ID: <span className="font-mono text-[10px]">{assessment.id}</span>
                        </p>
                        <button className="px-8 py-3 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-all active:scale-95 text-sm uppercase tracking-tight">
                            Create Your Own Passport
                        </button>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="text-center mt-12 opacity-40">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">© 2026 SkillSense AI • Digital Skill Infrastructure</p>
                </div>
            </div>
        </div>
    );
}
