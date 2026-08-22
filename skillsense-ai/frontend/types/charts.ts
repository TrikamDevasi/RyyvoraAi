// Re-export from data files for convenience
export type { SampleStudent } from '../data/sampleStudents';
export type { IndustryDemandData } from '../data/sampleIndustryDemand';
export type { PlacementData } from '../data/samplePlacements';
export type { SampleInstitution, ProgramROI } from '../data/sampleInstitutions';
export type { FairnessMetrics, FairnessFlag } from '../data/sampleFairnessMetrics';

// Chart-specific types
export interface SkillGapEntry {
    skill: string;
    myLevel: number;
    industryReq: number;
}

export interface ForecastEntry {
    month: string;
    actual?: number;
    forecast?: number;
}

export interface KPIData {
    label: string;
    value: number | string;
    unit?: string;
    trend?: number; // percentage change
    trendDirection?: 'up' | 'down' | 'neutral';
    icon?: string;
}

export interface CareerPathway {
    id: string;
    title: string;
    role: string;
    organization: string;
    requiredSkills: string[];
    matchPercent: number;
    salaryRange: { min: number; max: number };
    salaryLabel?: string;
    timeToAchieve: string;
    isRecommended: boolean;
    growth?: string;
    roadmap?: string[];
}

export interface Intervention {
    id: string;
    studentId?: string;
    studentName?: string;
    type: 'skill-gap' | 'placement-alert' | 'dropout-risk' | 'achievement';
    message: string;
    severity: 'high' | 'medium' | 'low' | 'success';
    timestamp: string;
    actionRequired: boolean;
}

export interface AuditLog {
    id: string;
    action: string;
    actor: string;
    role: string;
    resourceType: string;
    resourceId?: string;
    timestamp: string;
    ipAddress: string;
    status: 'success' | 'failure' | 'warning';
    details?: string;
}

export interface ReportConfig {
    type: 'placement' | 'fairness' | 'roi' | 'skill-gap' | 'compliance';
    format: 'pdf' | 'excel' | 'csv';
    dateRange: { from: string; to: string };
    filters?: Record<string, string>;
}

export interface UploadJob {
    id: string;
    fileName: string;
    fileSize: number;
    status: 'pending' | 'processing' | 'complete' | 'error';
    progress: number;
    recordsProcessed?: number;
    errorsFound?: number;
    uploadedAt: string;
}

export interface RegionData {
    region: string;
    state: string;
    lat: number;
    lng: number;
    skillScore: number;
    placementRate: number;
    studentCount: number;
    criticalGaps: string[];
}

export interface ComplianceStatus {
    framework: string;
    totalRequirements: number;
    met: number;
    partial: number;
    notMet: number;
    lastChecked: string;
    score: number;
}
