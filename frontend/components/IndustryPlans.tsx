'use client';

import React, { useRef, useState, useEffect } from 'react';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';

function useInView(ref: React.RefObject<HTMLElement | null>) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { rootMargin: '-80px' });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return inView;
}

const plans = [
    {
        name: 'Starter',
        price: '\u20B99,999',
        period: '/month',
        highlighted: false,
        features: [
            'Skill gap analysis for teams',
            'AI candidate screening',
            'Basic workforce insights',
            'Company dashboard',
            'Up to 50 employees',
            'Email support',
        ],
    },
    {
        name: 'Professional',
        price: '\u20B924,999',
        period: '/month',
        highlighted: true,
        badge: 'Most Popular',
        features: [
            'Everything in Starter',
            'Advanced AI skill analysis',
            'Industry benchmarking',
            'Smart hiring recommendations',
            'Skill Passport verification',
            'Up to 500 employees',
            'Priority support',
        ],
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: ' Pricing',
        highlighted: false,
        features: [
            'Everything in Professional',
            'National workforce intelligence',
            'Government integrations',
            'AI predictive analytics',
            'Custom dashboards + white-labeling',
            'Unlimited employees',
            'Dedicated account manager',
        ],
    },
];

export default function IndustryPlans({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef);

    return (
        <section ref={sectionRef} id="pricing" style={{ padding: '100px 24px', background: '#08060f' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center', marginBottom: 64,
                    opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)',
                        borderRadius: 99, padding: '5px 14px', marginBottom: 20,
                    }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Revenue Model
                        </span>
                    </div>
                    <h2 className="font-display" style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                        Industry <span className="gradient-text">Solutions</span>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
                        AI-powered skill intelligence for companies, institutions, and governments.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            style={{
                                position: 'relative',
                                background: plan.highlighted
                                    ? 'linear-gradient(145deg, #1c1505 0%, #111 70%)'
                                    : '#111',
                                border: `1px solid ${plan.highlighted ? 'rgba(212,168,67,0.5)' : 'rgba(212,168,67,0.08)'}`,
                                borderRadius: '1.5rem',
                                padding: '32px 28px',
                                transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s',
                                opacity: inView ? 1 : 0,
                                transitionDelay: `${i * 150}ms`,
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = plan.highlighted ? 'scale(1.05) translateY(-10px)' : 'translateY(-10px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = plan.highlighted
                                    ? `0 20px 60px rgba(212,168,67,0.2)`
                                    : `0 20px 60px rgba(212,168,67,0.08)`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = plan.highlighted ? 'scale(1.05)' : 'scale(1)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div style={{
                                    position: 'absolute', top: -12, right: 20,
                                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
                                    color: '#08060f', fontSize: 10, fontWeight: 800,
                                    padding: '5px 14px', borderRadius: 99,
                                    letterSpacing: '0.03em',
                                }}>
                                    {plan.badge}
                                </div>
                            )}

                            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                                {plan.name}
                            </h3>

                            <div style={{ marginBottom: 24 }}>
                                <span className="font-display" style={{ fontSize: 36, fontWeight: 800, color: plan.highlighted ? GOLD : '#fff' }}>
                                    {plan.price}
                                </span>
                                <span style={{ fontSize: 14, color: '#64748b' }}>{plan.period}</span>
                            </div>

                            {/* Features */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                                {plan.features.map((f, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                                            <circle cx="12" cy="12" r="10" stroke={plan.highlighted ? GOLD : '#334155'} strokeWidth="1.5" />
                                            <polyline points="9 12 11 14 15 10" stroke={plan.highlighted ? GOLD : '#64748b'} strokeWidth="2" fill="none" />
                                        </svg>
                                        <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.4 }}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => onSelectPlan(plan.name)}
                                style={{
                                    width: '100%', padding: '12px 0', borderRadius: 12,
                                    background: plan.highlighted
                                        ? `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`
                                        : 'transparent',
                                    border: plan.highlighted ? 'none' : `1px solid ${GOLD}`,
                                    color: plan.highlighted ? '#08060f' : GOLD,
                                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Industry Access'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
