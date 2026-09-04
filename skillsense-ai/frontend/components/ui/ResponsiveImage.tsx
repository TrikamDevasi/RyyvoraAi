'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fallbackIcon?: React.ReactNode;
  fallbackTitle?: string;
  overlayGradient?: 'navy' | 'saffron' | 'subtle' | 'none';
  borderRadius?: number | string;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  aspectRatio = '16 / 9',
  fill = false,
  priority = false,
  className = '',
  style = {},
  fallbackIcon,
  fallbackTitle,
  overlayGradient = 'subtle',
  borderRadius = 12,
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Gradient Overlays designed to unify images into the Sovereign Navy + Saffron design system
  const overlayMap = {
    navy: 'linear-gradient(180deg, rgba(11, 15, 23, 0.2) 0%, rgba(11, 15, 23, 0.85) 100%)',
    saffron: 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(11, 15, 23, 0.9) 100%)',
    subtle: 'linear-gradient(180deg, rgba(11, 19, 43, 0.1) 0%, rgba(11, 15, 23, 0.75) 100%)',
    none: 'transparent',
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius,
    aspectRatio: fill ? undefined : aspectRatio,
    background: 'var(--bg-surface-elevated, #0F172A)',
    border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
    width: fill ? '100%' : (width ? `${width}px` : '100%'),
    height: fill ? '100%' : (height ? `${height}px` : 'auto'),
    ...style,
  };

  if (hasError) {
    return (
      <div
        style={{
          ...containerStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8), rgba(11, 15, 23, 0.95))',
          textAlign: 'center',
          color: 'var(--text-secondary, #94A3B8)',
        }}
        role="img"
        aria-label={alt || 'Visual asset placeholder'}
      >
        {fallbackIcon && <div style={{ marginBottom: 8, color: 'var(--gold, #F59E0B)' }}>{fallbackIcon}</div>}
        {fallbackTitle && (
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)' }}>
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          opacity: isLoaded ? 1 : 0.6,
          filter: 'contrast(1.03) saturate(0.95)',
        }}
      />

      {/* Subtle Brand Overlay Gradient */}
      {overlayGradient !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlayMap[overlayGradient],
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
