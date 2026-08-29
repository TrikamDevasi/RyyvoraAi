'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import IndustryPlans from '@/components/IndustryPlans';
import IndustryModal from '@/components/IndustryModal';

/* ── helpers ── */
import { FadeIn } from '@/components/shared/FadeIn';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

/* ── data ── */
const STATS = [
    { value: '2.4M+', label: 'Students Assessed' },
    { value: '94%', label: 'Prediction Accuracy' },
    { value: '340+', label: 'Partner Institutes' },
    { value: '60%', label: 'Faster Hiring' },
];

const FEATURES = [
    { title: 'AI Skill Analyzer', desc: 'Deep analysis of resumes, GitHub repos, and projects using advanced AI to extract real competencies across 50+ dimensions.', color: GOLD },
    { title: 'Skill Score Dashboard', desc: 'Multi-dimensional scoring across technical, soft, and domain-specific competencies with personal growth tracking.', color: GOLD_L },
    { title: 'Gap Analysis Engine', desc: 'Identifies missing skills for target roles and generates personalized upskilling roadmaps with timelines.', color: AMBER },
    { title: 'Career Prediction', desc: 'Predicts best-fit career paths with salary benchmarks and growth forecasts tailored to India\'s job market.', color: GOLD },
    { title: 'Skill Passport', desc: 'Tamper-proof SHA-256 verifiable digital credential that travels with students throughout their career journey.', color: GOLD_L },
    { title: 'Fairness Engine', desc: 'Algorithmic equity monitoring with disparate impact ratios, gender/region parity scores, and correction recommendations.', color: AMBER },
];

const STEPS = [
    { num: '01', title: 'Student Uploads Data', desc: 'Resume, GitHub profile, projects, and certifications submitted through the secure portal.' },
    { num: '02', title: 'AI Analyses Skills', desc: 'Our engine extracts and scores 50+ competencies across technical, soft, and domain skills.' },
    { num: '03', title: 'Score & Insights', desc: 'Personalised Skill Passport, job-readiness score, and gap analysis generated instantly.' },
    { num: '04', title: 'Dashboards Update', desc: 'Institutes, industry, and government dashboards receive real-time aggregated analytics.' },
];

const IMPACTS = [
    { role: 'Students', color: GOLD, bg: 'rgba(212,168,67,0.05)', border: 'rgba(212,168,67,0.18)', points: ['Know your real skill level', 'Get personalised career roadmaps', 'Portable verified Skill Passport', 'AI-powered job matching'] },
    { role: 'Institutes', color: GOLD_L, bg: 'rgba(240,192,90,0.05)', border: 'rgba(240,192,90,0.18)', points: ['Track student outcomes at scale', 'Identify curriculum gaps', 'Boost placement rates', 'Prove program ROI to stakeholders'] },
    { role: 'Industry', color: AMBER, bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.18)', points: ['Access verified skill pools', 'AI-powered candidate matching', 'Forecast talent supply gaps', 'Reduce hiring time by 60%'] },
    { role: 'Government', color: GOLD, bg: 'rgba(212,168,67,0.06)', border: 'rgba(212,168,67,0.2)', points: ['National skill intelligence', 'Policy impact measurement', 'Fairness & equity monitoring', 'Workforce demand forecasting'] },
];

const DASHBOARDS = [
    { label: 'Student Dashboard', href: '/student', desc: 'Skill passport, AI analysis, career paths', color: GOLD },
    { label: 'Institute Dashboard', href: '/institute', desc: 'Analytics, placement trends, curriculum gaps', color: GOLD_L },
    { label: 'Industry Dashboard', href: '/industry', desc: 'Talent pool, skill matching, market trends', color: AMBER },
    { label: 'Government Dashboard', href: '/government', desc: 'National insights, workforce forecasting', color: GOLD },
];

/* ── Navbar ── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled || mobileOpen ? 'rgba(8,6,15,0.95)' : 'transparent',
            backdropFilter: scrolled || mobileOpen ? 'blur(16px)' : 'none',
            borderBottom: scrolled || mobileOpen ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>SkillSense AI</span>
                </div>
                <div className="hidden md:flex" style={{ gap: 24, alignItems: 'center' }}>
                    {['Features', 'How It Works', 'Impact', 'Pricing', 'Dashboards'].map(l => (
                        <a key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`} style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>{l}</a>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Link href="/auth" className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>Login</Link>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                        className="md:hidden"
                        style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 16,
                        }}
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden" style={{ padding: '16px 20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,6,15,0.98)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {['Features', 'How It Works', 'Impact', 'Pricing', 'Dashboards'].map(l => (
                        <a key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`} onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                            {l}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}

/* ── Page ── */
export default function LandingPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('Professional');

    const handleSelectPlan = (plan: string) => {
        setSelectedPlan(plan);
        setModalOpen(true);
    };

    return (
        <div className="grid-bg" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '25%', left: '20%', width: 400, height: 400, background: 'rgba(212,168,67,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 350, height: 350, background: 'rgba(212,168,67,0.04)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ textAlign: 'center', maxWidth: 800, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 32 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, animation: 'pulse-slow 2s infinite' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: GOLD }}>AI-Powered Skill Intelligence Platform</span>
                    </div>
                    <h1 className="font-display text-gradient-gold" style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.04em' }}>
                        Measuring Skills,<br />
                        Predicting Futures
                    </h1>
                    <p style={{ fontSize: 19, color: '#94a3b8', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.8, letterSpacing: '0.01em' }}>
                        SkillSense AI goes beyond certificates to measure real-world competencies, predict employability, and provide intelligence to institutions, industry, and government.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                        <Link href="/auth" className="btn-primary btn-shimmer" style={{ fontSize: 15, padding: '12px 28px' }}>
                            Start Free Assessment
                        </Link>
                        <Link href="/auth" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>
                            Explore Platform
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                        {STATS.map((s, i) => (
                            <FadeIn key={s.label} delay={0.4 + i * 0.1}>
                                <div className="glass gradient-border-gold" style={{ padding: '20px 14px', borderRadius: 16, textAlign: 'center' }}>
                                    <div className="font-display text-gradient-gold" style={{ fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))' }}>{s.value}</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem + Features */}
            <section style={{ padding: '100px 24px' }} id="features">
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Problem</span>
                        </div>
                        <h2 className="font-display text-gradient-gold" style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 14 }}>
                            Certificates Don&apos;t Tell the Whole Story
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>The global skills gap costs economies $8.5 trillion annually. Traditional credentials fail to capture real competencies employers need.</p>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 80 }}>
                        {[
                            { stat: '68%', desc: 'of graduates are underemployed despite having degrees', color: AMBER },
                            { stat: '82%', desc: 'of employers say certificates don\'t reflect actual job readiness', color: GOLD },
                            { stat: '$8.5T', desc: 'annual economic loss from the global skills mismatch crisis', color: GOLD_L },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="stat-card" style={{ textAlign: 'center' }}>
                                    <div className="font-display" style={{ fontSize: 48, fontWeight: 800, color: item.color, marginBottom: 12 }}>{item.stat}</div>
                                    <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Features */}
                    <FadeIn style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.08)', border: `1px solid rgba(212,168,67,0.2)`, borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Features</span>
                        </div>
                        <h2 className="font-display text-gradient-gold" style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>
                            Everything You Need to Measure What Matters
                        </h2>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
                        {FEATURES.map((f, i) => (
                            <FadeIn key={i} delay={i * 0.07}>
                                <div className="stat-card" style={{ cursor: 'default' }}>
                                    <div style={{ width: 4, height: 28, borderRadius: 2, background: f.color, marginBottom: 14 }} />
                                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: '100px 24px', background: 'rgba(212,168,67,0.015)' }} id="how-it-works">
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How It Works</span>
                        </div>
                        <h2 className="font-display text-gradient-gold" style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>
                            From Raw Data to Actionable Intelligence
                        </h2>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                        {STEPS.map((step, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="stat-card" style={{ textAlign: 'center' }}>
                                    <div className="font-display" style={{ 
                                        fontSize: 40, 
                                        fontWeight: 800, 
                                        color: 'rgba(212,168,67,0.55)', 
                                        marginBottom: 14,
                                        textShadow: '0 0 40px rgba(212,168,67,0.3)'
                                    }}>{step.num}</div>
                                    <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{step.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.2} style={{ marginTop: 48 }}>
                        <div className="glass-bright" style={{ borderRadius: 18, padding: '28px 32px' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Student Data', sub: 'Resume + GitHub + Projects' },
                                    null,
                                    { label: 'AI Analysis', sub: '50+ skill dimensions' },
                                    null,
                                    { label: 'Smart Insights', sub: 'Dashboards + Predictions' },
                                ].map((item, i) => !item ? (
                                    <span key={i} style={{ color: 'rgba(212,168,67,0.4)', fontSize: 22, fontWeight: 700 }}>→</span>
                                ) : (
                                    <div key={i} className="glass" style={{ padding: '16px 24px', borderRadius: 12, textAlign: 'center', minWidth: 160 }}>
                                        <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{item.label}</div>
                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Impact */}
            <section style={{ padding: '100px 24px' }} id="impact">
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</span>
                        </div>
                        <h2 className="font-display text-gradient-gold" style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>Built for Every Stakeholder</h2>
                        <p style={{ color: '#64748b', fontSize: 16, marginTop: 12 }}>SkillSense AI creates value across the entire education-to-employment ecosystem.</p>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 18 }}>
                        {IMPACTS.map((imp, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div style={{ background: imp.bg, border: `1px solid ${imp.border}`, borderRadius: 14, padding: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                        <div style={{ width: 4, height: 24, borderRadius: 2, background: imp.color }} />
                                        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>For {imp.role}</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {imp.points.map((p, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ color: imp.color, flexShrink: 0, fontWeight: 700 }}>+</span>
                                                <span style={{ color: '#cbd5e1', fontSize: 14 }}>{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Industry Plans (Pricing) ── */}
            <IndustryPlans onSelectPlan={handleSelectPlan} />

            {/* ── Industry Modal ── */}
            <IndustryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedPlan={selectedPlan} />

            {/* Dashboards */}
            <section style={{ padding: '100px 24px', background: 'rgba(212,168,67,0.015)' }} id="dashboards">
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 className="font-display text-gradient-gold" style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                            Explore the Dashboards
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 16 }}>Role-specific analytics for every stakeholder in the ecosystem.</p>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        {DASHBOARDS.map((d, i) => (
                            <FadeIn key={i} delay={i * 0.09}>
                                <Link href={d.href} style={{ display: 'block', textDecoration: 'none' }}>
                                    <div className="stat-card" style={{ 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        gap: '12px'
                                    }}>
                                        <div style={{ 
                                            width: '3px', 
                                            height: 'auto', 
                                            minHeight: '40px',
                                            alignSelf: 'stretch',
                                            borderRadius: 2, 
                                            background: d.color, 
                                            flexShrink: 0 
                                        }} />
                                        <div>
                                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{d.label}</h3>
                                            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>{d.desc}</p>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: d.color, display: 'flex', alignItems: 'center', gap: 4 }}>Explore →</div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h2 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
                            Smart <span className="gradient-text">Data Architecture</span>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 14 }}>Secure, scalable, and privacy-first by design</p>
                    </FadeIn>
                    <FadeIn>
                        <div className="glass-bright" style={{ borderRadius: 18, padding: 32 }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                                {[
                                    { label: 'Student Data' }, null,
                                    { label: 'Secure Storage' }, null,
                                    { label: 'AI Analytics' }, null,
                                    { label: 'Insights API' }, null,
                                    { label: 'Dashboards' },
                                ].map((item, i) => !item ? (
                                    <span key={i} style={{ color: 'rgba(212,168,67,0.4)', fontWeight: 700 }}>→</span>
                                ) : (
                                    <div key={i} className="glass" style={{ padding: '12px 18px', borderRadius: 10, textAlign: 'center', minWidth: 110 }}>
                                        <div style={{ fontSize: 12, color: '#cbd5e1' }}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                                {[
                                    { title: 'JWT Authentication', desc: 'Role-based access control for all user types' },
                                    { title: 'End-to-End Encryption', desc: 'All student data encrypted at rest and in transit' },
                                    { title: 'NSQF Compliance', desc: 'Aligned to India\'s National Skills Qualification Framework' },
                                ].map((item, i) => (
                                    <div key={i} className="glass" style={{ padding: '14px 16px', borderRadius: 10, display: 'flex', gap: 10 }}>
                                        <span style={{ color: '#22c55e', flexShrink: 0, fontWeight: 700 }}>+</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.title}</div>
                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <FadeIn>
                        <div className="glass-bright" style={{ borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(212,168,67,0.04), rgba(212,168,67,0.08))', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                                    Ready to Measure What <span className="gradient-text">Actually Matters?</span>
                                </h2>
                                <p style={{ color: '#64748b', fontSize: 16, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
                                    Join 340+ institutes and 2.4M+ students already using SkillSense AI to bridge the skills gap.
                                </p>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Link href="/auth" className="btn-primary btn-shimmer" style={{ fontSize: 15, padding: '12px 28px' }}>Start Free</Link>
                                    <Link href="/auth" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>Contact Sales</Link>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(212,168,67,0.1)', padding: '32px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span className="font-display" style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>SkillSense AI</span>
                    </div>
                    <p style={{ color: '#334155', fontSize: 12 }}>© 2026 SkillSense AI · Measuring Skills, Predicting Futures</p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
