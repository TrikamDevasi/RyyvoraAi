'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, Briefcase, Building2, Globe, Factory, Settings } from 'lucide-react';
import './auth.css';

const ROLES = [
    { key: 'student', label: 'Student', desc: 'Passport & AI', icon: GraduationCap, href: '/student' },
    { key: 'employer', label: 'Employer', desc: 'Hiring & Pool', icon: Briefcase, href: '/employer' },
    { key: 'institute', label: 'Institute', desc: 'ROI & Analytics', icon: Building2, href: '/institute' },
    { key: 'government', label: 'Govt', desc: 'Insights & Map', icon: Globe, href: '/government' },
    { key: 'industry', label: 'Industry', desc: 'Market Trends', icon: Factory, href: '/industry' },
    { key: 'admin', label: 'Admin', desc: 'System Mgmt', icon: Settings, href: '/admin' },
];

export default function AuthPage() {
    const router = useRouter();
    const { login, register } = useAuthStore();
    
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOAuth = (provider: 'google' | 'github') => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/v1/auth/${provider}`;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            await login(email, password);
            setTimeout(() => {
                setLoading(false);
                router.push('/student');
            }, 1000);
        } catch (err: any) {
            setLoading(false);
            const status = err.response?.status;
            const message = err.response?.data?.message || 'Authentication failed';

            if (status === 404 || message.toLowerCase().includes('not found')) {
                setError('No account found. Please sign up first.');
                setTimeout(() => {
                    setActiveTab('signup');
                    setError(null);
                }, 1500);
            } else if (status === 401 || message.toLowerCase().includes('incorrect')) {
                setError('Incorrect password. Please try again.');
            } else {
                setError(message);
            }
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedRole) {
            setError('Please select a role');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setLoading(true);
            await register(name, email, password, selectedRole as any);
            const roleData = ROLES.find(r => r.key === selectedRole);
            setTimeout(() => {
                setLoading(false);
                router.push(roleData?.href || '/student');
            }, 1000);
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-canvas">
                <div className="auth-bg-orb auth-bg-orb--1" />
                <div className="auth-bg-orb auth-bg-orb--2" />
                <div className="auth-bg-orb auth-bg-orb--3" />
                <div className="auth-bg-orb auth-bg-orb--4" />
                <div className="auth-bg-grid" />
            </div>

            <div className="auth-card">
                {/* ── HEADER ── */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <img 
                            src="/logo.png" 
                            alt="SkillSense AI" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <p className="auth-tagline">Measuring Skills · Predicting Futures</p>
                    </div>
                    <h1 className="auth-title">
                        {activeTab === 'signin' ? 'Welcome back' : 'Create Account'}
                    </h1>
                    <p className="auth-subtitle">
                        {activeTab === 'signin' ? 'Sign in to your account' : 'Join SkillSense AI today'}
                    </p>
                </div>

                {/* ── TABS ── */}
                <div className="auth-tabs">
                    <button 
                        type="button" 
                        onClick={() => setActiveTab('signin')}
                        className={`auth-tab ${activeTab === 'signin' ? 'auth-tab--active' : ''}`}>
                        Sign In
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setActiveTab('signup')}
                        className={`auth-tab ${activeTab === 'signup' ? 'auth-tab--active' : ''}`}>
                        Sign Up
                    </button>
                </div>

                {/* ── FORM ── */}
                <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp} className="auth-form">
                    
                    {activeTab === 'signup' && (
                        <>
                            <div className="auth-role-label">Select your role</div>
                            <div className="auth-roles-grid">
                                {ROLES.map(({ key, label, icon: Icon }) => (
                                    <div 
                                        key={key}
                                        onClick={() => setSelectedRole(key)}
                                        className={`auth-role-card ${selectedRole === key ? 'auth-role-card--active' : ''}`}>
                                        <Icon className="auth-role-card-icon" />
                                        <span className="auth-role-card-name">{label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="auth-field">
                                <label className="auth-field-label">Full Name</label>
                                <div className="auth-input-wrap">
                                    <User className="auth-input-icon" size={18} />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Skill Sense" 
                                        className="auth-input" 
                                        required 
                                    />
                                </div>
                            </div>
                        </>
                    )}

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

                    <div className="auth-field">
                        <div className="auth-label-row">
                            <label className="auth-field-label">Password</label>
                            {activeTab === 'signin' && (
                                <button 
                                    type="button" 
                                    className="auth-forgot-btn"
                                    onClick={() => router.push('/auth/forgot-password')}>
                                    Forgot?
                                </button>
                            )}
                        </div>
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

                    {activeTab === 'signup' && (
                        <div className="auth-field">
                            <label className="auth-field-label">Confirm Password</label>
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
                    )}

                    {activeTab === 'signin' && (
                        <label className="auth-checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={keepSignedIn} 
                                onChange={e => setKeepSignedIn(e.target.checked)} 
                            />
                            <span>Keep me signed in</span>
                        </label>
                    )}

                    {error && (
                        <div className="auth-error" style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <div className="auth-spinner" />
                        ) : (
                            <>
                                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="auth-socials">
                    <button type="button" onClick={() => handleOAuth('google')} className="auth-social-btn">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                    <button type="button" onClick={() => handleOAuth('github')} className="auth-social-btn">
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub
                    </button>
                </div>

                <div className="auth-footer">
                    {activeTab === 'signin' ? (
                        <>
                            Don't have an account?{' '}
                            <button type="button" onClick={() => setActiveTab('signup')} className="auth-footer-link">
                                Create Account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button type="button" onClick={() => setActiveTab('signin')} className="auth-footer-link">
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
