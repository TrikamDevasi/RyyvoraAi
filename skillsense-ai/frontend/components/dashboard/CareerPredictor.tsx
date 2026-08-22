'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Loader2, Sparkles, Brain, Briefcase, TrendingUp, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import CareerPathwayCard from './CareerPathwayCard';
import type { CareerPathway } from '@/types/charts';

export default function CareerPredictor() {
    const { request } = useApi();
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [skills, setSkills] = useState<string>('');
    const [interests, setInterests] = useState<string>('');
    const [education, setEducation] = useState<string>('');
    const [step, setStep] = useState<'form' | 'results'>('form');

    useEffect(() => {
        // Pre-fill skills from localStorage if available
        try {
            const stored = localStorage.getItem('ss_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.program) setEducation(parsed.program);
                // In a real app, we'd fetch skills from the user profile API
            }
        } catch {}
    }, []);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skills.trim()) {
            toast.error('Please enter at least some skills');
            return;
        }

        setLoading(true);
        try {
            const res = await request('POST', '/ai/predict-career', {
                skills: skills.split(',').map(s => s.trim()),
                interests: interests.split(',').map(i => i.trim()),
                education
            });

            if (res.data.success && res.data.data.careers) {
                setPredictions(res.data.data.careers);
                setStep('results');
                toast.success('Career paths predicted!');
            } else {
                throw new Error('Failed to get predictions');
            }
        } catch (err) {
            toast.error('Failed to predict careers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="relative">
                    <Loader2 className="animate-spin text-amber-500" size={64} />
                    <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI is Mapping Your Future</h2>
                    <p className="text-slate-400 mt-1">Analyzing market trends and matching your skills...</p>
                </div>
            </div>
        );
    }

    if (step === 'results') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Brain className="text-amber-500" size={24} />
                            Your AI Career Match
                        </h2>
                        <p className="text-slate-400 text-sm">Top pathways based on your unique profile</p>
                    </div>
                    <button 
                        onClick={() => setStep('form')}
                        className="text-amber-500 text-sm font-bold hover:underline"
                    >
                        Refine Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {predictions.map((career, idx) => {
                        // Adapt the API data to CareerPathway interface if needed
                        const pathway: CareerPathway = {
                            id: `P-${idx}`,
                            title: career.title,
                            role: career.title,
                            organization: 'Top Companies (AI Suggestion)',
                            requiredSkills: career.missingSkills || [],
                            matchPercent: career.match || 0,
                            salaryRange: { min: 0, max: 0 }, // We can parse career.salaryRange if needed
                            salaryLabel: career.salaryRange,
                            timeToAchieve: career.timeToReady,
                            isRecommended: idx === 0,
                            growth: career.growth,
                            roadmap: career.roadmap
                        };
                        return <CareerPathwayCard key={idx} pathway={pathway} />;
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Career Predictor</h2>
                <p className="text-slate-400 mt-2">Enter your background to discover high-growth career paths</p>
            </div>

            <form onSubmit={handlePredict} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
                <div>
                    <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Skills (comma separated)</label>
                    <textarea 
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. React, Node.js, Python, Digital Marketing"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-all h-24 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Interests</label>
                    <input 
                        type="text"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="e.g. FinTech, Healthcare, Open Source, AI"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Current Education / Program</label>
                    <input 
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-all"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-amber-500 text-amber-950 font-bold rounded-xl hover:bg-amber-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,168,67,0.3)]"
                >
                    Predict Career Paths
                    <ChevronRight size={20} />
                </button>
            </form>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 items-start">
                <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-slate-400 leading-relaxed">
                    Our AI cross-references your profile with over 500,000 real-world job postings across India to find the best market fit for your skills.
                </p>
            </div>
        </div>
    );
}
