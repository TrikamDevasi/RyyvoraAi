'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterItem {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface FilterBarProps {
  filters: FilterItem[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onReset?: () => void;
  isFiltered?: boolean;
  contextTag?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FilterBar({
  filters,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onReset,
  isFiltered = false,
  contextTag,
  className = '',
  style = {},
}: FilterBarProps) {
  return (
    <div
      className={`filter-bar-container ${className}`.trim()}
      style={{
        padding: '10px 14px',
        borderRadius: 'var(--radius-md, 8px)',
        background: 'var(--bg-surface, #111827)',
        border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--brand-gold, #F59E0B)', fontSize: 11, fontWeight: 750, letterSpacing: '0.04em' }}>
          <Filter size={13} />
          <span style={{ color: 'var(--text-muted, #64748B)' }}>FILTERS:</span>
        </div>

        {filters.map((f) => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label htmlFor={f.id} style={{ fontSize: 11.5, color: 'var(--text-secondary, #94A3B8)', fontWeight: 500 }}>
              {f.label}:
            </label>
            <select
              id={f.id}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              disabled={f.disabled}
              style={{
                height: 32,
                background: 'var(--bg-input, #0D131F)',
                color: 'var(--text-primary, #F8FAFC)',
                border: '1px solid var(--border-default, rgba(255, 255, 255, 0.10))',
                borderRadius: 6,
                padding: '0 8px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#111827', color: '#F8FAFC' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onSearchChange && (
          <div style={{ position: 'relative', minWidth: 160, maxWidth: 240, flex: 1 }}>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                height: 32,
                background: 'var(--bg-input, #0D131F)',
                color: 'var(--text-primary, #F8FAFC)',
                border: '1px solid var(--border-default, rgba(255, 255, 255, 0.10))',
                borderRadius: 6,
                padding: '0 10px',
                fontSize: 12,
                outline: 'none',
              }}
            />
          </div>
        )}

        {isFiltered && onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 5,
              background: 'rgba(239, 68, 68, 0.10)',
              color: 'var(--error, #EF4444)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
            }}
          >
            <X size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {contextTag && (
        <div style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontFamily: 'var(--font-mono, monospace)' }}>
          {contextTag}
        </div>
      )}
    </div>
  );
}
