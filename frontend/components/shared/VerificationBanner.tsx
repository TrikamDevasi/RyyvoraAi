'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function VerificationBanner() {
    const { user, resendVerification } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (!user || user.isVerified) return null;

    const handleResend = async () => {
        setLoading(true);
        try {
            await resendVerification(user.email);
            setSent(true);
            toast.success('Verification email sent!');
            setTimeout(() => setSent(false), 30000); // Reset after 30s
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Premium Gold Glass Banner */}
            <div className="w-full bg-gradient-to-r from-amber-600/20 via-orange-500/10 to-amber-600/20 backdrop-blur-md border-b border-amber-500/30 px-6 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top duration-700">
                
                {/* Subtle Animated Glow Pulse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <AlertCircle className="text-amber-500" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-amber-50" style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.01em' }}>
                            Email Verification Required
                        </p>
                        <p className="text-amber-200/70" style={{ fontSize: '12px' }}>
                            Your email <span className="text-white font-bold">{user.email}</span> is currently unverified. 
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handleResend}
                    disabled={loading || sent}
                    style={{ 
                        background: sent ? 'rgba(34, 197, 94, 0.15)' : 'linear-gradient(135deg, #F59E0B, #D4A843)',
                        boxShadow: sent ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.3)'
                    }}
                    className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all active:scale-95 disabled:pointer-events-none
                        ${sent ? 'text-emerald-400 border border-emerald-500/30' : 'text-slate-900 border-none hover:brightness-110'}`}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : sent ? (
                        <>
                            <CheckCircle2 size={16} />
                            LINK SENT
                        </>
                    ) : (
                        <>
                            <Mail size={16} />
                            VERIFY NOW
                        </>
                    )}
                </button>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
