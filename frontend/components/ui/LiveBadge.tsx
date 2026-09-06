'use client';

import React from 'react';

export const LiveBadge = ({ label = 'LIVE' }: { label?: string }) => {
    return (
        <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            padding: '2px 8px',
            borderRadius: 99,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: 10,
            fontWeight: 800,
            color: '#ef4444',
            letterSpacing: '0.05em'
        }}>
            <span style={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                background: '#ef4444',
                animation: 'pulse-red 1.5s infinite'
            }} />
            {label}
            <style jsx>{`
                @keyframes pulse-red {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </div>
    );
};
