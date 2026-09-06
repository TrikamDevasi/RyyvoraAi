'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#08060f',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                gap: 16,
                padding: 24,
            }}
        >
            <div style={{ fontSize: 48, color: '#ef4444' }}>!</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Something went wrong</h2>
            <p style={{ color: '#A0A0A0', fontSize: 14, margin: 0, textAlign: 'center', maxWidth: 400 }}>
                {error.message ?? 'An unexpected error occurred. Please try again.'}
            </p>
            <button
                onClick={reset}
                style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #D4A843, #8b6512)',
                    color: '#1a0f00',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 8,
                }}
            >
                Try again
            </button>
        </div>
    );
}
