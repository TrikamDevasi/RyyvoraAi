export interface FairnessFlag {
    dimension: string;
    gapPercent: number;
    severity: 'high' | 'medium' | 'low';
}

export interface FairnessMetrics {
    period: string;
    overallFairnessScore: number;
    genderGap: {
        male: number;
        female: number;
    };
    regionGap: {
        north: number;
        south: number;
        east: number;
        west: number;
        central: number;
    };
    flags: FairnessFlag[];
    lastAuditDate: string;
}

export const sampleFairnessMetrics: FairnessMetrics = {
    period: 'Q4 FY 2025-26',
    overallFairnessScore: 74.8,
    genderGap: {
        male: 78.4,
        female: 71.2,
    },
    regionGap: {
        north: 76.3,
        south: 80.1,
        east: 68.5,
        west: 82.7,
        central: 65.9,
    },
    flags: [
        {
            dimension: 'Gender – Female Placement Rate',
            gapPercent: 9.1,
            severity: 'high',
        },
        {
            dimension: 'Region – Central vs West Skill Score',
            gapPercent: 16.8,
            severity: 'high',
        },
        {
            dimension: 'Region – East vs South Avg Salary',
            gapPercent: 11.6,
            severity: 'medium',
        },
        {
            dimension: 'NSQF Level 3 vs Level 5 ROI',
            gapPercent: 8.4,
            severity: 'medium',
        },
        {
            dimension: 'Rural vs Urban Institution Quality',
            gapPercent: 6.2,
            severity: 'low',
        },
        {
            dimension: 'SC/ST Enrollment in Technical Programs',
            gapPercent: 4.7,
            severity: 'low',
        },
    ],
    lastAuditDate: '2026-03-01',
};

export const sampleFairnessHistory: { period: string; score: number }[] = [
    { period: 'Q1 FY24', score: 64.2 },
    { period: 'Q2 FY24', score: 66.8 },
    { period: 'Q3 FY24', score: 68.5 },
    { period: 'Q4 FY24', score: 70.1 },
    { period: 'Q1 FY25', score: 71.3 },
    { period: 'Q2 FY25', score: 72.4 },
    { period: 'Q3 FY25', score: 73.6 },
    { period: 'Q4 FY25', score: 74.8 },
];
