export interface PlacementData {
    month: string;
    placedCount: number;
    avgSalary: number;
    topSector?: string;
    placementRate?: number;
    femalePercent?: number;
}

export const samplePlacements: PlacementData[] = [
    {
        month: 'Apr 2025',
        placedCount: 142,
        avgSalary: 42000,
        topSector: 'IT Services',
        placementRate: 58.2,
        femalePercent: 34,
    },
    {
        month: 'May 2025',
        placedCount: 168,
        avgSalary: 44500,
        topSector: 'Software Development',
        placementRate: 61.4,
        femalePercent: 36,
    },
    {
        month: 'Jun 2025',
        placedCount: 195,
        avgSalary: 46000,
        topSector: 'Cloud & DevOps',
        placementRate: 64.7,
        femalePercent: 38,
    },
    {
        month: 'Jul 2025',
        placedCount: 221,
        avgSalary: 48200,
        topSector: 'AI & Data Science',
        placementRate: 66.3,
        femalePercent: 39,
    },
    {
        month: 'Aug 2025',
        placedCount: 248,
        avgSalary: 50500,
        topSector: 'Full-Stack Development',
        placementRate: 68.8,
        femalePercent: 41,
    },
    {
        month: 'Sep 2025',
        placedCount: 272,
        avgSalary: 52000,
        topSector: 'Cybersecurity',
        placementRate: 70.2,
        femalePercent: 42,
    },
    {
        month: 'Oct 2025',
        placedCount: 305,
        avgSalary: 54000,
        topSector: 'Software Development',
        placementRate: 72.5,
        femalePercent: 40,
    },
    {
        month: 'Nov 2025',
        placedCount: 334,
        avgSalary: 55800,
        topSector: 'AI & Data Science',
        placementRate: 74.1,
        femalePercent: 38,
    },
    {
        month: 'Dec 2025',
        placedCount: 312,
        avgSalary: 55200,
        topSector: 'Cloud Computing',
        placementRate: 73.0,
        femalePercent: 44,
    },
    {
        month: 'Jan 2026',
        placedCount: 358,
        avgSalary: 58000,
        topSector: 'Full-Stack Development',
        placementRate: 76.4,
        femalePercent: 43,
    },
    {
        month: 'Feb 2026',
        placedCount: 387,
        avgSalary: 60500,
        topSector: 'Software Engineering',
        placementRate: 78.2,
        femalePercent: 45,
    },
    {
        month: 'Mar 2026',
        placedCount: 421,
        avgSalary: 62000,
        topSector: 'Technology',
        placementRate: 81.0,
        femalePercent: 46,
    },
];
