'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SignInOverlay from '@/components/SignInOverlay';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                setShowOverlay(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const autofill = (e: string, p: string) => {
        setEmail(e);
        setPassword(p);
    };

    const handleOAuth = () => {
        window.location.href = 'http://localhost:5000/api/v1/auth/google';
    };

    return (
        <div className="min-h-screen bg-[#060b1e] text-white flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Animated Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse-slow" />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }} />

            <div className="nexus-card bg-slate-900/40 backdrop-blur-3xl z-10 transition-transform duration-500 hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        NEXUS <span className="text-violet-500">SIGN IN</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">Enter credentials to access your terminal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Universal Identifier</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-500 transition-colors" size={18} />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="nexus-input pl-12"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
                            <button type="button" onClick={() => router.push('/forgot-password')} className="text-[10px] font-black text-violet-500 hover:text-white transition-colors uppercase tracking-widest">Forgot?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-500 transition-colors" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="nexus-input pl-12 pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 transition-all" />
                        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Keep session persistent</span>
                    </label>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="nexus-btn-primary">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Initialize Session
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or bridge with</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <button 
                        onClick={handleOAuth}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-bold text-slate-300">Continue with Neural Key</span>
                    </button>
                </div>

                {/* Demo Accounts */}
                <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 text-center">Simulation Access Points</p>
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => autofill('admin@nexus.dev', 'Admin@1234')} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-xs">
                            <span className="font-black text-violet-400">ADMIN</span>
                            <span className="text-slate-500">admin@nexus.dev</span>
                        </button>
                        <button onClick={() => autofill('user@nexus.dev', 'User@5678')} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-xs">
                            <span className="font-black text-purple-400">USER</span>
                            <span className="text-slate-500">user@nexus.dev</span>
                        </button>
                        <button onClick={() => autofill('viewer@nexus.dev', 'View@9999')} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-xs">
                            <span className="font-black text-blue-400">VIEWER</span>
                            <span className="text-slate-500">viewer@nexus.dev</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        New entity? <button onClick={() => router.push('/register')} className="font-black text-violet-500 hover:text-white transition-colors uppercase tracking-widest ml-1">Establish Link</button>
                    </p>
                </div>
            </div>

            {showOverlay && (
                <SignInOverlay onComplete={() => router.push('/student/dashboard')} />
            )}
        </div>
    );
}
