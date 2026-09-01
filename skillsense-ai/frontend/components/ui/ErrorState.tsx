'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Service Temporarily Unavailable',
  error = 'Unable to synchronize telemetry with backend API service.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        padding: '32px 24px',
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 14,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(239,68,68,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          color: '#ef4444',
        }}
      >
        <AlertTriangle size={22} />
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
        {title}
      </h4>
      <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 4, maxWidth: 460, marginInline: 'auto' }}>
        {error}
      </p>

      {onRetry && (
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={onRetry}
            className="btn-secondary"
            style={{ fontSize: 12.5, padding: '6px 16px' }}
          >
            <RefreshCw size={13} /> Retry Telemetry Sync
          </button>
        </div>
      )}
    </div>
  );
}
