'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import '../../auth.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = useParams();
    const { request } = useApi();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [valid, setValid] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await request('GET', `/auth/reset-password/${token}`);
                setValid(true);
            } catch (err) {
                setValid(false);
                toast.error('Invalid or expired reset link');
            } finally {
                setVerifying(false);
            }
        };
        if (token) verifyToken();
    }, [token, request]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await request('POST', `/auth/reset-password/${token}`, { password });
            setSuccess(true);
            toast.success('Password reset successful');
            setTimeout(() => router.push('/auth'), 3000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

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
                        <p className="auth-tagline">Workforce Outcome Intelligence</p>
                    </div>
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">
                        {verifying ? 'Verifying your link...' : 
                         success ? 'Account secured successfully' :
                         valid ? 'Create a permanent new password' : 
                         'Oops! This link is no longer valid'}
                    </p>
                </div>

                {verifying ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <Loader2 className="animate-spin text-amber-500" size={40} />
                        <p className="text-slate-400 text-sm">One moment please...</p>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <CheckCircle2 className="text-emerald-500" size={60} />
                        <p className="text-slate-300">Your password has been reset successfully.</p>
                        <p className="text-slate-500 text-sm">Redirecting you to login...</p>
                    </div>
                ) : !valid ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <XCircle className="text-rose-500" size={60} />
                        <p className="text-slate-300">This password reset link has expired or is invalid.</p>
                        <button 
                            onClick={() => router.push('/auth/forgot-password')}
                            className="auth-btn mt-4"
                        >
                            Request New Link
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label className="auth-field-label">New Password</label>
                            <div className="auth-input-wrap">
                                <Lock className="auth-input-icon" size={18} />
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="auth-input" 
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="auth-eye-btn" 
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-field-label">Confirm New Password</label>
                            <div className="auth-input-wrap">
                                <Lock className="auth-input-icon" size={18} />
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="auth-input" 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Update Password
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <button 
                        onClick={() => router.push('/auth')} 
                        className="auth-footer-link flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="inline-block" size={16} />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
