'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import '../auth.css';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { request } = useApi();
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }

            try {
                await request('GET', `/auth/verify-email/${token}`);
                setStatus('success');
                setMessage('Email verified successfully! You can now access all features.');
                toast.success('Verification successful');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
                toast.error('Verification failed');
            }
        };

        verify();
    }, [token, request]);

    return (
        <div className="auth-page">
            <div className="auth-bg-canvas">
                <div className="auth-bg-orb auth-bg-orb--1" />
                <div className="auth-bg-orb auth-bg-orb--2" />
                <div className="auth-bg-grid" />
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/logo.png" alt="Ryyvora AI" />
                    </div>
                    <h1 className="auth-title">Email Verification</h1>
                </div>

                <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="animate-spin text-amber-500" size={60} />
                            <p className="text-slate-300">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="text-emerald-500" size={80} />
                            <p className="text-slate-200 text-lg font-medium">{message}</p>
                            <button 
                                onClick={() => router.push('/auth')}
                                className="auth-btn mt-4 w-full"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="text-rose-500" size={80} />
                            <p className="text-slate-200">{message}</p>
                            <div className="flex flex-col gap-3 w-full mt-4">
                                <button 
                                    onClick={() => router.push('/auth')}
                                    className="auth-btn w-full"
                                >
                                    Try Login Anyway
                                </button>
                                <button 
                                    onClick={() => router.push('/auth/forgot-password')}
                                    className="auth-footer-link text-sm"
                                >
                                    Lost access to email?
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
