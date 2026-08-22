'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SignInOverlayProps {
    onComplete: () => void;
}

export default function SignInOverlay({ onComplete }: SignInOverlayProps) {
    const [mounted, setMounted] = useState(false);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        const root = document.createElement('div');
        root.id = 'signin-portal-root';
        document.body.appendChild(root);
        setPortalRoot(root);
        
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            const overlay = document.querySelector('.nexus-overlay');
            if (overlay) {
                overlay.classList.add('nexus-overlay--out');
                setTimeout(() => {
                    onComplete();
                }, 400);
            }
        }, 3000);

        return () => {
            document.body.style.overflow = '';
            if (root && document.body.contains(root)) {
                document.body.removeChild(root);
            }
            clearTimeout(timer);
        };
    }, [onComplete]);

    if (!mounted || !portalRoot) return null;

    const particles = Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2.5 + 1.5,
        left: Math.random() * 96 + 2,
        duration: Math.random() * 7 + 6,
        delay: Math.random() * 5,
        color: [
            'rgba(99,102,241,0.7)',
            'rgba(167,139,250,0.6)',
            'rgba(58,63,212,0.65)',
        ][Math.floor(Math.random() * 3)],
    }));

    const rings = [340, 290, 240, 190, 140, 90, 42];

    return createPortal(
        <div className="nexus-overlay fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden" 
             style={{ 
                 background: 'rgba(10, 15, 44, 0.96)', 
                 backdropFilter: 'blur(10px)',
                 animation: 'overlayIn 0.4s ease-out forwards'
             }}>
            
            {/* Ambient Particles */}
            {particles.map(p => (
                <div 
                    key={p.id}
                    className="absolute bottom-[-10px] rounded-full pointer-events-none"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.left}%`,
                        background: p.color,
                        animation: `particleRise ${p.duration}s linear ${p.delay}s infinite`
                    }}
                />
            ))}

            {/* Ring Stack */}
            <div className="ring-stack relative" style={{ width: 340, height: 340, animation: 'stackSpin 5s linear infinite' }}>
                {rings.map((size, i) => (
                    <div 
                        key={size}
                        className={`auth-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            border: '3px solid transparent',
                            background: `linear-gradient(var(--navy) 0 0) padding-box, conic-gradient(from var(--angle), #3a3fd4, #d4c5f0, #6366f1, #a78bfa, #3a3fd4) border-box`,
                            boxShadow: i % 2 === 0 ? '0 0 20px rgba(99,102,241,0.3)' : '0 0 15px rgba(167,139,250,0.2)',
                            animation: `
                                gradSpin 3s linear ${i * -0.425}s infinite, 
                                ${i % 2 === 0 ? 'ringSpinCW' : 'ringSpinCCW'} 8s linear infinite,
                                ringMorph 2s ease-in-out infinite alternate
                            `,
                            backfaceVisibility: 'hidden'
                        }}
                    />
                ))}
                
                {/* Central Orb */}
                <div 
                    className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] rounded-full"
                    style={{
                        width: 22,
                        height: 22,
                        background: 'radial-gradient(circle, #ffffff 0%, #c4b5fd 45%, #6366f1 100%)',
                        animation: 'orbPulse 1.6s ease-in-out infinite'
                    }}
                />
            </div>

            <div 
                className="signin-label mt-[52px] flex items-center gap-3 text-slate-400 font-medium tracking-[0.12em] uppercase text-xs"
                style={{ animation: 'labelFadeIn 0.6s 0.2s ease-out both' }}
            >
                <Loader2 className="animate-spin text-violet-500" size={16} />
                Signing in...
            </div>
        </div>,
        portalRoot
    );
}
