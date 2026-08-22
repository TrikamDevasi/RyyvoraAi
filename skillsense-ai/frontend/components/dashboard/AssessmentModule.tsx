'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Loader2, CheckCircle2, AlertTriangle, TrendingUp, Info, ArrowRight, RotateCcw, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { downloadPageAsPDF } from '@/utils/downloadPDF';

interface Question {
    question: string;
    options: string[];
    correct: string;
}

interface AssessmentResults {
    id?: string;
    score: number;
    correct: number;
    total: number;
    level: string;
    weakAreas: string[];
    strengths: string[];
    improvementPlan: string;
    nextSteps: string[];
}

interface AssessmentModuleProps {
    topic: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    onClose: () => void;
}

export default function AssessmentModule({ topic, difficulty, onClose }: AssessmentModuleProps) {
    const { request } = useApi();
    const [step, setStep] = useState<'loading' | 'quiz' | 'evaluating' | 'results'>('loading');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<AssessmentResults | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await request('POST', '/ai/assess-skill', { topic, level: difficulty });
                if (res.data.success && res.data.data.questions.length > 0) {
                    setQuestions(res.data.data.questions);
                    setStep('quiz');
                } else {
                    throw new Error('No questions generated');
                }
            } catch (err) {
                toast.error('Failed to generate assessment. Please try again.');
                onClose();
            }
        };
        fetchQuestions();
    }, [topic, difficulty, request, onClose]);

    useEffect(() => {
        if (step === 'quiz' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && step === 'quiz') {
            handleSubmit();
        }
    }, [step, timeLeft]);

    const handleAnswer = (optionChar: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentIdx] = optionChar;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setStep('evaluating');
        try {
            const answersToEval = questions.map((q, i) => ({
                question: q.question,
                userAnswer: userAnswers[i] || '',
                correctAnswer: q.correct
            }));

            const res = await request('POST', '/ai/assess-skill/evaluate', { topic, answers: answersToEval });
            setResults(res.data.data);
            setStep('results');
            
            if (res.data.data.score >= 70) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D4A843', '#FBBF24', '#ffffff']
                });
            }
        } catch (err) {
            toast.error('Failed to evaluate assessment.');
            setStep('quiz');
        }
    };

    if (step === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <Loader2 className="animate-spin text-amber-500" size={48} />
                <div>
                    <h2 className="text-xl font-bold text-white">Generating Your AI Assessment</h2>
                    <p className="text-slate-400 mt-1">Creating a custom skill test for {topic} ({difficulty})</p>
                </div>
            </div>
        );
    }

    if (step === 'evaluating') {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="relative">
                    <Loader2 className="animate-spin text-amber-500" size={64} />
                    <div className="absolute inset-0 flex items-center justify-center text-amber-500 font-bold text-xs">
                        {Math.round((userAnswers.filter(a => a).length / questions.length) * 100)}%
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI is Evaluating...</h2>
                    <p className="text-slate-400 mt-1">Calculating your score and generating insights</p>
                </div>
            </div>
        );
    }

    if (step === 'quiz') {
        const q = questions[currentIdx];
        const progress = ((currentIdx + 1) / questions.length) * 100;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <div className="max-w-2xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-amber-500 uppercase tracking-wider">{topic}</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">{difficulty} Level</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border font-mono text-sm ${timeLeft < 60 ? 'border-red-500/50 text-red-400 animate-pulse' : 'border-slate-700 text-slate-300'}`}>
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>Question {currentIdx + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="mb-10 min-h-[100px]">
                    <h3 className="text-xl font-medium text-white leading-relaxed">{q.question}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-10">
                    {q.options.map((option, idx) => {
                        const char = option.charAt(0);
                        const isSelected = userAnswers[currentIdx] === char;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(char)}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all group
                                    ${isSelected 
                                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(212,168,67,0.15)]' 
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.08]'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                                    ${isSelected ? 'bg-amber-500 text-amber-950' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}
                                `}>
                                    {char}
                                </div>
                                <span className="text-sm md:text-base">{option.slice(3)}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-between">
                    <button 
                        onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentIdx === 0}
                        className="px-6 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-0 transition-all font-medium text-sm"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={nextQuestion}
                        disabled={!userAnswers[currentIdx]}
                        className="px-8 py-2 rounded-lg bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 text-sm shadow-sm"
                    >
                        {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Test'}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    if (results) {
        return (
            <div className="max-w-3xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-slate-900 to-[#0c0a16] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 text-center border-b border-white/5">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 mb-4">
                            <span className="text-3xl font-black text-amber-500">{results.score}%</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Assessment Results</h2>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <span className="text-slate-400">Skill Level:</span>
                            <span className={`px-3 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[10px] border 
                                ${results.level === 'Advanced' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                                  results.level === 'Intermediate' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                                  'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                                {results.level}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                                    <CheckCircle2 size={16} />
                                    Strengths
                                </div>
                                <ul className="space-y-2">
                                    {results.strengths.map((s, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                                    <AlertTriangle size={16} />
                                    Gaps Identified
                                </div>
                                <ul className="space-y-2">
                                    {results.weakAreas.map((w, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Plan */}
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                                <TrendingUp size={16} className="text-indigo-400" />
                                AI Personalized Plan
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4 py-1">
                                "{results.improvementPlan}"
                            </p>
                            <div className="mt-6 grid grid-cols-1 gap-2">
                                {results.nextSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] text-xs text-slate-400 hover:text-slate-200 transition-colors">
                                        <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 shrink-0">
                                            0{i + 1}
                                        </div>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white/[0.03] border-t border-white/5 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                        >
                            Back to Library
                        </button>
                        <button 
                            onClick={() => downloadPageAsPDF(`Assessment-Report-${topic}`)}
                            className="flex-1 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 border border-white/10"
                        >
                            <Download size={18} />
                            PDF
                        </button>
                        {results.id && (
                            <button 
                                onClick={() => {
                                    const url = `${window.location.origin}/share/assessment/${results.id}`;
                                    navigator.clipboard.writeText(url);
                                    toast.success('Share link copied to clipboard!');
                                }}
                                className="flex-1 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                setStep('loading');
                                setQuestions([]);
                                setCurrentIdx(0);
                                setUserAnswers([]);
                                setResults(null);
                                setTimeLeft(300);
                            }}
                            className="flex-1 px-6 py-3 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 transition-all shadow-[0_4px_15px_rgba(212,168,67,0.3)] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
