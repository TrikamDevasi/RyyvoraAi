'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import '../auth.css';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { request } = useApi();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await request('POST', '/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send reset link');
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
                        <img src="/logo.png" alt="SkillSense AI" />
                        <p className="auth-tagline">Measuring Skills · Predicting Futures</p>
                    </div>
                    <h1 className="auth-title">Forgot Password</h1>
                    <p className="auth-subtitle">
                        {submitted 
                            ? "Check your inbox for the reset link" 
                            : "Enter your email to receive a password reset link"}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label className="auth-field-label">Email Address</label>
                            <div className="auth-input-wrap">
                                <Mail className="auth-input-icon" size={18} />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com" 
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
                                    Send Reset Link
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center mt-6">
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="auth-footer-link text-sm"
                        >
                            Refill email address
                        </button>
                    </div>
                )}

                <div className="auth-footer">
                    <button 
                        onClick={() => router.push('/auth')} 
                        className="auth-footer-link flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
