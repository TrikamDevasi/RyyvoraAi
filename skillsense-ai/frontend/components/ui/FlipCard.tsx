'use client';

import React, { useState } from 'react';

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipOnHover?: boolean;
  minHeight?: number | string;
  style?: React.CSSProperties;
}

export function FlipCard({
  front,
  back,
  className = '',
  flipOnHover = true,
  minHeight = 220,
  style,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label="Interactive 3D Card. Press Enter to flip details."
      onClick={() => setIsFlipped((prev) => !prev)}
      onKeyDown={handleKeyDown}
      className={`flip-card-container ${isFlipped ? 'is-flipped' : ''} ${className}`.trim()}
      style={{
        minHeight,
        cursor: 'pointer',
        outline: 'none',
        ...style,
      }}
    >
      <div className="flip-card-inner" style={{ minHeight }}>
        <div className="flip-card-front card-standard" style={{ padding: 20 }}>
          {front}
        </div>
        <div className="flip-card-back card-accent" style={{ padding: 20 }}>
          {back}
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
