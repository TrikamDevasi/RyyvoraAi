'use client';

import React from 'react';
import UploadZone from '@/components/dashboard/UploadZone';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function UploadPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 800 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Upload <span style={{ color: GOLD }}>Data</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Upload student records, assessment results, or placement data
                </p>
            </div>

            {/* Format guide */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { format: 'CSV', description: 'Student records, placement results', icon: 'CSV' },
                    { format: 'XLSX', description: 'Assessment scores, batch data', icon: 'XLS' },
                    { format: 'JSON', description: 'API data exports, system integrations', icon: 'JSON' },
                ].map((f) => (
                    <div
                        key={f.format}
                        style={{
                            flex: 1,
                            minWidth: 180,
                            padding: '14px 18px',
                            background: 'rgba(212,168,67,0.06)',
                            border: '1px solid rgba(212,168,67,0.2)',
                            borderRadius: 10,
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>{f.icon}</span>
                        <p style={{ margin: '8px 0 2px', fontWeight: 700, fontSize: 14, color: GOLD }}>{f.format}</p>
                        <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{f.description}</p>
                    </div>
                ))}
            </div>

            <UploadZone />

            {/* Instructions */}
            <div
                style={{
                    marginTop: 24,
                    padding: '16px 20px',
                    background: 'rgba(59,130,246,0.06)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: 12,
                }}
            >
                <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 13, color: '#60a5fa' }}>
                    Upload Guidelines
                </p>
                <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
                    <li>Maximum file size: 50 MB per upload</li>
                    <li>CSV must include headers: student_id, name, program, state, nsqf_level</li>
                    <li>Dates should be in DD/MM/YYYY or YYYY-MM-DD format</li>
                    <li>Skill scores must be numeric (0–100)</li>
                    <li>All uploaded data is encrypted at rest (AES-256)</li>
                </ul>
            </div>
        </div>
    );
}
