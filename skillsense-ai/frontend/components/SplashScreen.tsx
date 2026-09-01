'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Only show a brief splash once per tab session (first render), never on route changes.
        // Respect prefers-reduced-motion by skipping the animation entirely.
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const alreadyShown = sessionStorage.getItem('ss_splash_shown');

        if (prefersReducedMotion || alreadyShown === 'true') {
            setVisible(false);
            return;
        }

        sessionStorage.setItem('ss_splash_shown', 'true');
        setVisible(true);

        const timer1 = setTimeout(() => setFadeOut(true), 500);
        const timer2 = setTimeout(() => setVisible(false), 1100);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    if (!visible) return <>{children}</>;

    return (
        <>
            {/* Splash overlay - non-blocking, dismissible */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: '#050a14',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: fadeOut ? 0 : 1,
                    transition: 'opacity 0.6s ease-out',
                    pointerEvents: 'none',
                }}
            >
                {/* Logo */}
                <img
                    src="/logo.png"
                    alt=""
                    style={{
                        width: 160,
                        height: 160,
                        objectFit: 'contain',
                        animation: 'splashLogo 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        filter: 'drop-shadow(0 0 40px rgba(212,168,67,0.3))',
                        position: 'relative',
                        zIndex: 1,
                    }}
                />
            </div>

            {/* Page content */}
            {children}

            <style>{`
                @keyframes splashLogo {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
}
