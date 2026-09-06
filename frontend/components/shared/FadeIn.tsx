'use client';

import React, { useRef, useState, useEffect } from 'react';

function useInView(ref: React.RefObject<HTMLElement | null>) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { rootMargin: '-80px' });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return inView;
}

export function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    return (
        <div ref={ref} style={{ 
            opacity: inView ? 1 : 0, 
            transform: inView ? 'translateY(0)' : 'translateY(28px)', 
            transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`, 
            ...style 
        }}>
            {children}
        </div>
    );
}
