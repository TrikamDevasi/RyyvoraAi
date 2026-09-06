'use client';

import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, className = '', style }: SkeletonProps) => {
    return (
        <div 
            className={`skeleton-shimmer ${className}`}
            style={{ 
                width, 
                height, 
                borderRadius, 
                background: 'rgba(212,168,67,0.05)',
                position: 'relative',
                overflow: 'hidden',
                ...style 
            }}
        >
            <style jsx>{`
                .skeleton-shimmer::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(212,168,67,0.08),
                        transparent
                    );
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};
