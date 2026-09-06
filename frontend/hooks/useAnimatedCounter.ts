'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to the target value over the given duration.
 * Useful for KPI cards and dashboard counters.
 */
export function useAnimatedCounter(
    target: number,
    duration: number = 1500,
    startOnMount: boolean = true
): number {
    const [current, setCurrent] = useState(0);
    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!startOnMount && !hasStarted.current) return;
        hasStarted.current = true;

        const animate = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * target));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [target, duration, startOnMount]);

    return current;
}

/**
 * Formats a number for display (e.g. 25000 → "25,000" or "25K")
 */
export function formatCounterValue(
    value: number,
    compact: boolean = false
): string {
    if (compact) {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toString();
    }
    return value.toLocaleString('en-IN');
}
