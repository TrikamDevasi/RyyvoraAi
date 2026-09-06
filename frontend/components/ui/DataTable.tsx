'use client';

import React from 'react';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyField?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  style?: React.CSSProperties;
  stickyHeader?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  loading = false,
  emptyMessage = 'No records found matching your criteria.',
  onRowClick,
  className = '',
  style = {},
  stickyHeader = false,
}: DataTableProps<T>) {
  return (
    <div
      className={`data-table-container ${className}`.trim()}
      style={{
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12.5,
          color: 'var(--text-secondary, #94A3B8)',
          textAlign: 'left',
        }}
      >
        <thead
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
            position: stickyHeader ? 'sticky' : 'static',
            top: stickyHeader ? 0 : undefined,
            zIndex: stickyHeader ? 10 : undefined,
          }}
        >
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  padding: '10px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted, #64748B)',
                  textAlign: col.align || 'left',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: 'var(--text-muted, #64748B)',
                  fontSize: 12.5,
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(245, 158, 11, 0.25)',
                      borderTopColor: 'var(--brand-gold, #F59E0B)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <span>Loading records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: 'var(--text-muted, #64748B)',
                  fontSize: 12.5,
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const rowKey = row[keyField] !== undefined ? row[keyField] : rowIdx;
              const isClickable = !!onRowClick;

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.04))',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'background-color 150ms ease',
                  }}
                  className={isClickable ? 'hover:bg-[rgba(255,255,255,0.03)]' : undefined}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      style={{
                        padding: '10px 12px',
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.cell ? col.cell(row, rowIdx) : col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
