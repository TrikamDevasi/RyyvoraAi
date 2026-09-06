import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { KPIData, Intervention, AuditLog, UploadJob } from '../types/charts';

interface DashboardFilters {
    dateRange: { from: string; to: string };
    state?: string;
    program?: string;
    gender?: 'all' | 'male' | 'female';
    nsqfLevel?: number;
    institutionId?: string;
}

interface DashboardState {
    // Sidebar
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Active role view
    activeRole: 'student' | 'institute' | 'industry' | 'government' | 'admin';
    setActiveRole: (role: DashboardState['activeRole']) => void;

    // Filters
    filters: DashboardFilters;
    setFilters: (filters: Partial<DashboardFilters>) => void;
    resetFilters: () => void;

    // KPI data
    kpis: KPIData[];
    setKPIs: (kpis: KPIData[]) => void;

    // Interventions feed
    interventions: Intervention[];
    setInterventions: (items: Intervention[]) => void;
    addIntervention: (item: Intervention) => void;
    dismissIntervention: (id: string) => void;

    // Audit logs
    auditLogs: AuditLog[];
    setAuditLogs: (logs: AuditLog[]) => void;

    // Upload jobs
    uploadJobs: UploadJob[];
    addUploadJob: (job: UploadJob) => void;
    updateUploadJob: (id: string, updates: Partial<UploadJob>) => void;

    // UI State
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    selectedStudentId: string | null;
    setSelectedStudentId: (id: string | null) => void;
}

const defaultFilters: DashboardFilters = {
    dateRange: { from: '2025-04-01', to: '2026-03-31' },
    state: undefined,
    program: undefined,
    gender: 'all',
    nsqfLevel: undefined,
    institutionId: undefined,
};

export const useDashboardStore = create<DashboardState>()(
    devtools(
        (set) => ({
            // Sidebar
            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

            // Active role
            activeRole: 'student',
            setActiveRole: (role) => set({ activeRole: role }),

            // Filters
            filters: defaultFilters,
            setFilters: (filters) =>
                set((state) => ({ filters: { ...state.filters, ...filters } })),
            resetFilters: () => set({ filters: defaultFilters }),

            // KPI
            kpis: [],
            setKPIs: (kpis) => set({ kpis }),

            // Interventions
            interventions: [],
            setInterventions: (interventions) => set({ interventions }),
            addIntervention: (item) =>
                set((state) => ({ interventions: [item, ...state.interventions] })),
            dismissIntervention: (id) =>
                set((state) => ({
                    interventions: state.interventions.filter((i) => i.id !== id),
                })),

            // Audit logs
            auditLogs: [],
            setAuditLogs: (auditLogs) => set({ auditLogs }),

            // Upload jobs
            uploadJobs: [],
            addUploadJob: (job) =>
                set((state) => ({ uploadJobs: [job, ...state.uploadJobs] })),
            updateUploadJob: (id, updates) =>
                set((state) => ({
                    uploadJobs: state.uploadJobs.map((j) =>
                        j.id === id ? { ...j, ...updates } : j
                    ),
                })),

            // UI
            isLoading: false,
            setLoading: (isLoading) => set({ isLoading }),
            selectedStudentId: null,
            setSelectedStudentId: (selectedStudentId) => set({ selectedStudentId }),
        }),
        { name: 'dashboard-store' }
    )
);
