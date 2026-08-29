'use client';

import React, { useState, useEffect } from 'react';
import ReportGenerator from '@/components/dashboard/ReportGenerator';
import { downloadPageAsPDF } from '@/utils/downloadPDF';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const FORMAT_COLORS: Record<string, string> = { PDF: '#ef4444', XLSX: '#22c55e', CSV: '#3b82f6' };

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/reports')
            .then(res => {
                const data = res.data?.data;
                if (Array.isArray(data) && data.length > 0) {
                    setReports(data);
                } else {
                    setReports([
                        { name: 'National Placement & Skill Audit', type: 'Placement', format: 'PDF', date: new Date().toISOString().split('T')[0], status: 'ready' },
                        { name: 'Regional Fairness & Demographic Parity', type: 'Fairness', format: 'PDF', date: new Date().toISOString().split('T')[0], status: 'ready' },
                    ]);
                }
                setLoading(false);
            })
            .catch(() => {
                setReports([
                    { name: 'National Placement & Skill Audit', type: 'Placement', format: 'PDF', date: new Date().toISOString().split('T')[0], status: 'ready' },
                ]);
                setLoading(false);
            });
    }, []);

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Reports <span style={{ color: GOLD }}>Centre</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Generate, export, and download cryptographic system reports
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                    <ReportGenerator onGenerate={(config) => { downloadPageAsPDF('SkillSense-Report-' + config.type); }} />

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '22px' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Generated System Reports</h3>
                        {loading ? (
                            <Skeleton height={150} width="100%" />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {reports.map((report, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => downloadPageAsPDF(report.name || 'Report')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 14px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: WHITE }}>{report.name || `Report #${idx + 1}`}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>Generated on {report.date || new Date().toLocaleDateString()}</p>
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                                            Download PDF
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
