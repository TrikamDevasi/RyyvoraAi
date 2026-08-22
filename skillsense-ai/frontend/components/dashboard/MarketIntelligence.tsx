'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { 
    Search, TrendingUp, BarChart3, Globe, Zap, 
    Briefcase, Building2, Wallet, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketIntelligence() {
    const { request } = useApi();
    const [skill, setSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetchTrends = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!skill.trim()) return;

        setLoading(true);
        try {
            const res = await request('GET', `/ai/market-trends?skill=${encodeURIComponent(skill)}`);
            if (res.data.success) {
                setData(res.data.data);
                toast.success(`Market research for ${skill} completed!`);
            } else {
                throw new Error('Failed to fetch market data');
            }
        } catch (err) {
            toast.error('Could not retrieve market intelligence. Try another skill.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Header */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Globe size={120} className="text-amber-500" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Zap className="text-amber-500" fill="currentColor" />
                        AI Market Intelligence
                    </h2>
                    <p className="text-slate-400 mb-6 font-medium">
                        Real-time demand signals, salary benchmarks, and emerging industry trends powered by Perplexity AI.
                    </p>

                    <form onSubmit={fetchTrends} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input 
                                type="text"
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                placeholder="Search a skill (e.g. Next.js, Generative AI, Cloud)"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-all shadow-inner"
                            />
                        </div>
                        <button 
                            disabled={loading || !skill.trim()}
                            className="bg-amber-500 text-amber-950 font-bold px-8 rounded-xl hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 whitespace-nowrap shadow-[0_4px_20px_rgba(212,168,67,0.3)]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
                        </button>
                    </form>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {data ? (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Summary Card */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-amber-500" />
                                    Demand Analysis: {data.skill}
                                </h3>
                                <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/50 p-4 rounded-xl border border-white/5 italic">
                                    "{data.summary}"
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Growth Curve</p>
                                        <p className="text-xl font-black text-amber-500">{data.demand}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Avg Salary</p>
                                        <p className="text-xl font-black text-white">{data.avgSalary}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Open Positions</p>
                                        <p className="text-xl font-black text-blue-400">{data.jobCount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Keywords / Trending Subtopics */}
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">Trending Sub-specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.trendingTopics.map((topic: string) => (
                                        <span key={topic} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold hover:bg-amber-500/20 cursor-default transition-colors">
                                            #{topic.replace(/\s+/g, '').toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Side Panels */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Building2 className="text-blue-400" />
                                    Top Employers
                                </h3>
                                <div className="space-y-3">
                                    {data.topCompanies.map((company: string) => (
                                        <div key={company} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs">
                                                {company[0]}
                                            </div>
                                            <span className="text-sm text-slate-200 font-medium">{company}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6 rounded-2xl">
                                <div className="flex items-center gap-2 text-amber-500 mb-2">
                                    <Zap size={20} fill="currentColor" />
                                    <span className="font-bold text-sm">AI Opportunity</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    The demand for <strong>{data.skill}</strong> expertise is currently outpacing available talent by 40% in tier-1 Indian cities.
                                </p>
                                <button className="w-full py-2 bg-amber-500 text-amber-950 text-xs font-black rounded-lg hover:bg-amber-400 transition-all">
                                    FIND JOBS NOW
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : !loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl"
                    >
                        <BarChart3 className="mx-auto text-slate-700 mb-4" size={48} />
                        <h3 className="text-slate-500 font-bold">Search for a skill to see live market intelligence</h3>
                        <p className="text-slate-600 text-xs mt-1">Get salary data, employer demand, and trending insights</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
