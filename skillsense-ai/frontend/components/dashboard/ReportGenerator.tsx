'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import type { ReportConfig } from '../../types/charts';

interface Props {
    onGenerate?: (config: ReportConfig) => void;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const REPORT_TYPES: { value: ReportConfig['type']; label: string; icon: string }[] = [
    { value: 'placement', label: 'Placement Report', icon: 'PLC' },
    { value: 'fairness', label: 'Fairness Audit', icon: 'FIR' },
    { value: 'roi', label: 'Program ROI', icon: 'ROI' },
    { value: 'skill-gap', label: 'Skill Gap Analysis', icon: 'SKL' },
    { value: 'compliance', label: 'Compliance Report', icon: 'CMP' },
];

function downloadFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function ReportGenerator({ onGenerate }: Props) {
    const [type, setType] = useState<ReportConfig['type']>('compliance');
    const [format, setFormat] = useState<ReportConfig['format']>('csv');
    const [from, setFrom] = useState('2025-04-01');
    const [to, setTo] = useState('2026-03-31');
    const [generating, setGenerating] = useState(false);
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

    const handleGenerate = async () => {
        setGenerating(true);
        setStatus(null);
        const config: ReportConfig = {
            type,
            format,
            dateRange: { from, to },
        };

        try {
            const endpoint =
                type === 'compliance'
                    ? '/governance/compliance'
                    : type === 'fairness'
                        ? '/admin/fairness-dashboard'
                        : '/analytics/dashboard';

            const res = await api.get(endpoint);
            const data = res.data?.data ?? res.data;

            // Build a real CSV from the live API response
            const rows: string[][] = [];
            const cols = (key: string, value: unknown) => [key, String(value ?? '')];

            if (type === 'compliance' && data) {
                rows.push(cols('Report Type', 'Compliance'));
                rows.push(cols('Generated From', from));
                rows.push(cols('Generated To', to));
                rows.push(cols('Verified Institutions', data.verifiedInstitutions ?? '-'));
                rows.push(cols('Total Students', data.totalStudents ?? '-'));
                rows.push(cols('NSQF Coverage', data.compliance?.nsqfCoverage ?? '-'));
                rows.push(cols('Institution Verification Rate', data.compliance?.institutionVerificationRate ?? '-'));
                if (Array.isArray(data.nsqfDistribution)) {
                    data.nsqfDistribution.forEach((d: any) => {
                        rows.push(cols(`NSQF Level ${d._id} Students`, d.count));
                    });
                }
            } else {
                rows.push(cols('Report Type', type));
                rows.push(cols('Generated From', from));
                rows.push(cols('Generated To', to));
                rows.push(cols('Snapshot', JSON.stringify(data)));
            }

            const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
            downloadFile(`skillsense-${type}-report-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');

            onGenerate?.(config);
            setStatus({ ok: true, text: 'Report generated from live system data and downloaded.' });
        } catch (err: any) {
            setStatus({
                ok: false,
                text: err?.response?.data?.message || 'Report generation failed because the analytics service is unavailable. Please try again.',
            });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(145deg, rgba(212,168,67,0.06), rgba(10,8,2,0.98))',
                border: '1px solid rgba(212,168,67,0.2)',
                borderRadius: 14,
                padding: '22px',
                color: WHITE,
            }}
        >
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: WHITE }}>
                Generate Report
            </h3>

            {/* Report type */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Report Type
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {REPORT_TYPES.map((rt) => (
                        <button
                            key={rt.value}
                            onClick={() => setType(rt.value)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 12px',
                                borderRadius: 10,
                                border: `1px solid ${type === rt.value ? GOLD : 'rgba(255,255,255,0.12)'}`,
                                background: type === rt.value ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.03)',
                                color: type === rt.value ? GOLD : MUTED,
                                fontSize: 12,
                                fontWeight: type === rt.value ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {rt.icon} {rt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Format */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                    <label style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                        Format
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['csv', 'excel', 'pdf'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 8,
                                    border: `1px solid ${format === f ? GOLD : 'rgba(255,255,255,0.12)'}`,
                                    background: format === f ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.03)',
                                    color: format === f ? GOLD : MUTED,
                                    fontSize: 12,
                                    fontWeight: format === f ? 700 : 400,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date range */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                    <label style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                        From
                    </label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            padding: '8px 10px',
                            color: WHITE,
                            fontSize: 13,
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                    <label style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                        To
                    </label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            padding: '8px 10px',
                            color: WHITE,
                            fontSize: 13,
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>

            {/* Status message */}
            {status && (
                <div style={{ marginBottom: 12, fontSize: 12, color: status.ok ? '#22c55e' : '#ef4444', lineHeight: 1.4 }}>
                    {status.ok ? '✓ ' : '⚠ '}{status.text}
                </div>
            )}

            {/* Generate button */}
            <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: generating
                        ? 'rgba(212,168,67,0.3)'
                        : `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                    color: generating ? MUTED : '#1a0f00',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: generating ? 'wait' : 'pointer',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}
            >
                {generating ? (
                    <>
                        <span
                            style={{
                                display: 'inline-block',
                                width: 14,
                                height: 14,
                                border: `2px solid ${GOLD}`,
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite',
                            }}
                        />
                        Generating from live data…
                    </>
                ) : (
                    `Generate ${format.toUpperCase()} Report`
                )}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}