'use client';

import React, { useCallback, useState } from 'react';
import type { UploadJob } from '../../types/charts';
import { useDashboardStore } from '../../store/dashboardStore';
import { FolderUp, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const ACCEPTED_TYPES = ['.csv', '.xlsx', '.json'];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone() {
    const { uploadJobs, addUploadJob, updateUploadJob } = useDashboardStore();
    const [dragging, setDragging] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const processFile = useCallback(
        async (file: File) => {
            setErrorMsg(null);
            const job: UploadJob = {
                id: `UPL-${Date.now()}`,
                fileName: file.name,
                fileSize: file.size,
                status: 'processing',
                progress: 25,
                uploadedAt: new Date().toISOString(),
            };
            addUploadJob(job);

            try {
                let institutionId = '';
                try {
                    const stored = localStorage.getItem('ss_user');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        institutionId = parsed._id || parsed.id || parsed.institutionId || '';
                    }
                } catch {}

                if (!institutionId) {
                    setErrorMsg('No institution linked to this account. Please contact an administrator to link an institution before uploading.');
                    updateUploadJob(job.id, {
                        status: 'error',
                        progress: 100,
                        recordsProcessed: 0,
                        errorsFound: 0,
                    });
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);

                updateUploadJob(job.id, { progress: 65 });

                const res = await api.post(`/institutes/${institutionId}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const data = res.data?.data;
                const processed =
                    typeof data?.processed === 'number' ? data.processed :
                    typeof data?.inserted === 'number' ? data.inserted :
                    Array.isArray(data?.results) ? data.results.length :
                    data?.count ?? 0;
                updateUploadJob(job.id, {
                    status: 'complete',
                    progress: 100,
                    recordsProcessed: processed,
                    errorsFound: typeof data?.failed === 'number' ? data.failed : (data?.errors?.length || 0),
                });
            } catch (err: any) {
                const message = err?.response?.data?.message || err?.message || 'Upload failed';
                setErrorMsg(message);
                updateUploadJob(job.id, {
                    status: 'error',
                    progress: 100,
                    recordsProcessed: 0,
                    errorsFound: 1,
                });
            }
        },
        [addUploadJob, updateUploadJob]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            Array.from(e.dataTransfer.files).forEach(processFile);
        },
        [processFile]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(processFile);
        }
    };

    return (
        <div>
            {errorMsg && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, color: '#fca5a5', marginBottom: 16, fontSize: 13 }}>
                    {errorMsg}
                </div>
            )}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${dragging ? GOLD : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 16,
                    padding: '40px 24px',
                    textAlign: 'center',
                    background: dragging ? 'rgba(212,168,67,0.05)' : 'rgba(255,255,255,0.01)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                }}
            >
                <FolderUp size={48} style={{ color: GOLD, margin: '0 auto 16px' }} />
                <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: WHITE }}>
                    Drag and drop student files here
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: MUTED }}>
                    Supports CSV, XLSX, and JSON formatted data files
                </p>
                <label style={{ cursor: 'pointer' }}>
                    <input type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleFileInput} style={{ display: 'none' }} />
                    <span className="btn-gold" style={{ padding: '8px 20px', fontSize: 13, display: 'inline-block' }}>
                        Browse Files
                    </span>
                </label>
            </div>

            {/* Jobs List */}
            {uploadJobs.length > 0 && (
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: WHITE }}>Recent Uploads</h3>
                    {uploadJobs.map((job) => (
                        <div key={job.id} style={{ padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: WHITE }}>{job.fileName}</div>
                                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{formatSize(job.fileSize)} • {new Date(job.uploadedAt).toLocaleTimeString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: job.status === 'complete' ? '#22c55e' : job.status === 'error' ? '#ef4444' : GOLD }}>
                                    {job.status === 'complete'
                                        ? `✓ Ingested (${job.recordsProcessed || 0} records)`
                                        : job.status === 'error'
                                            ? '✕ Upload Failed'
                                            : `${job.progress}%`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
