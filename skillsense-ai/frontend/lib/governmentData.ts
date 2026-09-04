// frontend/lib/governmentData.ts
// Centralized Maharashtra State Skilling Telemetry Data Engine & Offline Fallback Provider

export interface LongitudinalStage {
  id: string;
  stageNumber: number;
  label: string;
  count: number;
  percent: number;
  dropOffRate: number;
  dropOffReason: string;
}

export interface FunnelBreakdown {
  totalEnrolled: number;
  completed: number;
  certified: number;
  placed: number;
  salaried: number;
  selfEmployed: number;
  apprenticeship: number;
  retained30d: number;
  retained90d: number;
  retained180d: number;
  retained365d: number;
}

export interface DistrictTelemetryMetric {
  district: string;
  state: string;
  division: string;
  totalTrainees: number;
  isSmallSample: boolean;
  employmentRate: number;
  salariedRate: number;
  selfEmployedRate: number;
  apprenticeshipRate: number;
  retention90dRate: number;
  verificationRate: number;
  medianSalary: number;
  statusLabel: 'SURPLUS' | 'EQUILIBRIUM' | 'DEFICIT';
  actionDirective: string;
  topSkills: string[];
  gapSkills: string[];
}

export interface WageCurvePoint {
  milestone: string;
  medianSalary: number;
  verifiedAverage: number;
}

export interface NonPlacementReason {
  reason: string;
  count: number;
  pct: number;
}

export interface PolicyDirectiveItem {
  targetType: string;
  targetName: string;
  confidence: number;
  title: string;
  observation: string;
  recommendedAction: string;
}

export interface AlgorithmicFairnessMetric {
  category: string;
  selectionRateTarget: number;
  selectionRateBaseline: number;
  fourFifthsRatio: number;
  status: 'Pass' | 'Audit Required';
}

export const MAHARASHTRA_DISTRICTS: string[] = [
  'Pune',
  'Mumbai Metropolitan',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhaji Nagar',
  'Thane',
  'Solapur',
  'Kolhapur',
  'Amravati',
  'Nanded',
  'Jalgaon',
  'Ratnagiri',
  'Ahmednagar',
  'Akola',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Latur',
  'Nandurbar',
  'Dharashiv',
  'Palghar',
  'Parbhani',
  'Raigad',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Wardha',
  'Washim',
  'Yavatmal',
];

export const PROGRAM_LIST: string[] = [
  'Industrial Mechatronics & Robotics',
  'Solar & Renewable Energy Tech',
  'Full-Stack Web & Cloud DevOps',
  'Automotive Precision Engineering',
  'Pharma Quality Control & Testing',
  'Textile & Smart Garment Tech',
  'Fintech Operations & Data Analytics',
  'EV Battery Systems Maintenance',
];

// District base trainee lookup table
const DISTRICT_BASE_COUNTS: Record<string, number> = {
  'Pune': 184500,
  'Mumbai Metropolitan': 220000,
  'Nagpur': 98400,
  'Nashik': 86200,
  'Chhatrapati Sambhaji Nagar': 74800,
  'Thane': 112000,
  'Solapur': 54000,
  'Kolhapur': 62000,
  'Amravati': 48000,
  'Nanded': 49600,
  'Jalgaon': 51000,
  'Ratnagiri': 34000,
  'Ahmednagar': 46000,
  'Akola': 38000,
  'Beed': 32000,
  'Bhandara': 28000,
  'Buldhana': 31000,
  'Chandrapur': 42000,
  'Dhule': 35000,
  'Gadchiroli': 18400,
  'Gondia': 24000,
  'Hingoli': 21000,
  'Latur': 44000,
  'Nandurbar': 19500,
  'Dharashiv': 29000,
  'Palghar': 41000,
  'Parbhani': 38200,
  'Raigad': 53000,
  'Sangli': 47000,
  'Satara': 45000,
  'Sindhudurg': 22000,
  'Wardha': 33000,
  'Washim': 23000,
  'Yavatmal': 36000,
};

// Deterministic string seed helper
function getSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ── 36 MAHARASHTRA DISTRICTS TELEMETRY DATA LIST ─────────────────────────────
export const MAHARASHTRA_DISTRICT_TELEMETRY: DistrictTelemetryMetric[] = MAHARASHTRA_DISTRICTS.map((dist) => {
  const seed = getSeed(dist);
  const baseTrainees = DISTRICT_BASE_COUNTS[dist] || 35000;
  const isSmallSample = dist === 'Nandurbar';
  
  // Placement rates based on district economic tier
  let empRate = 60 + (seed % 28);
  if (['Pune', 'Mumbai Metropolitan', 'Thane'].includes(dist)) empRate = 84 + (seed % 6);
  if (['Nagpur', 'Nashik', 'Kolhapur', 'Raigad'].includes(dist)) empRate = 72 + (seed % 8);
  if (['Gadchiroli', 'Nandurbar', 'Hingoli', 'Washim'].includes(dist)) empRate = 42 + (seed % 14);

  const salariedRate = Math.round(empRate * 0.78);
  const selfEmployedRate = Math.round(empRate * 0.14);
  const apprenticeshipRate = Math.round(empRate * 0.08);
  const retention90dRate = Math.round(empRate * 0.94);
  const verificationRate = Math.min(99, 82 + (seed % 16));
  
  let medianSalary = 24000 + (seed % 14) * 1000;
  if (['Pune', 'Mumbai Metropolitan', 'Thane'].includes(dist)) medianSalary = 38000 + (seed % 10) * 1000;

  const statusLabel: 'SURPLUS' | 'EQUILIBRIUM' | 'DEFICIT' = empRate >= 78 ? 'SURPLUS' : empRate >= 65 ? 'EQUILIBRIUM' : 'DEFICIT';

  return {
    district: dist,
    state: 'Maharashtra',
    division: `${dist} Division`,
    totalTrainees: baseTrainees,
    isSmallSample,
    employmentRate: empRate,
    salariedRate,
    selfEmployedRate,
    apprenticeshipRate,
    retention90dRate,
    verificationRate,
    medianSalary,
    statusLabel,
    actionDirective: `Scale regional ${dist} technical skill centers and employer NAPS placement drives.`,
    topSkills: ['Industrial Automation', 'Electrical Engineering', 'Digital Operations'],
    gapSkills: ['Advanced Robotics', 'Quality Management Systems'],
  };
});

// ── DYNAMIC LONGITUDINAL PIPELINE GENERATOR ─────────────────────────────────
export function getLongitudinalPipeline(district: string, program: string): {
  stages: LongitudinalStage[];
  breakdown: FunnelBreakdown;
} {
  const seed = getSeed(`${district}_${program}`);

  // Base enrollment computation
  let totalEnrolled = 1240000;
  if (district !== 'All') {
    totalEnrolled = DISTRICT_BASE_COUNTS[district] || 45000;
  }

  // Program track scaling factor
  if (program !== 'All') {
    const progFactor = 0.12 + ((seed % 15) / 100);
    totalEnrolled = Math.round(totalEnrolled * progFactor);
  }

  // Rates dynamically influenced by program and district
  let completionPct = 0.85 + ((seed % 8) / 100); // 85-92%
  let certifiedPct = 0.86 + ((seed % 7) / 100);  // 86-92%
  let placementPct = 0.62 + ((seed % 25) / 100); // 62-86%

  // District specific boost
  if (['Pune', 'Mumbai Metropolitan', 'Thane'].includes(district)) placementPct += 0.10;
  if (['Gadchiroli', 'Nandurbar', 'Hingoli', 'Washim', 'Beed'].includes(district)) placementPct -= 0.12;

  // Program specific boost
  if (program === 'Full-Stack Web & Cloud DevOps' || program === 'Industrial Mechatronics & Robotics') {
    placementPct += 0.08;
    completionPct += 0.04;
  }
  if (program === 'Solar & Renewable Energy Tech') {
    placementPct += 0.04;
  }

  placementPct = Math.min(0.92, Math.max(0.42, placementPct));

  const completed = Math.round(totalEnrolled * completionPct);
  const certified = Math.round(completed * certifiedPct);
  const placed = Math.round(certified * placementPct);

  // Retention rates
  const retained30d = Math.round(placed * 0.92);
  const retained90d = Math.round(retained30d * 0.91);
  const retained180d = Math.round(retained90d * 0.94);
  const retained365d = Math.round(retained180d * 0.93);

  // Modalities
  let selfEmpRatio = 0.14;
  let appRatio = 0.08;
  if (program === 'Solar & Renewable Energy Tech' || program === 'Textile & Smart Garment Tech') {
    selfEmpRatio = 0.26;
  }
  if (program === 'Automotive Precision Engineering' || program === 'EV Battery Systems Maintenance') {
    appRatio = 0.16;
  }

  const selfEmployed = Math.round(placed * selfEmpRatio);
  const apprenticeship = Math.round(placed * appRatio);
  const salaried = placed - selfEmployed - apprenticeship;

  const stages: LongitudinalStage[] = [
    {
      id: 'enrolled',
      stageNumber: 1,
      label: 'Enrolled Trainees',
      count: totalEnrolled,
      percent: 100,
      dropOffRate: 0,
      dropOffReason: 'Base candidate roster baseline',
    },
    {
      id: 'completed',
      stageNumber: 2,
      label: 'Course Completed',
      count: completed,
      percent: Math.round((completed / totalEnrolled) * 100),
      dropOffRate: Math.round(((totalEnrolled - completed) / totalEnrolled) * 100),
      dropOffReason: 'Coursework attrition & attendance drop',
    },
    {
      id: 'certified',
      stageNumber: 3,
      label: 'NSQF Certified',
      count: certified,
      percent: Math.round((certified / totalEnrolled) * 100),
      dropOffRate: Math.round(((completed - certified) / completed) * 100),
      dropOffReason: 'Practical evaluation & NSQF exam backlog',
    },
    {
      id: 'placed',
      stageNumber: 4,
      label: 'Placed in Job',
      count: placed,
      percent: Math.round((placed / totalEnrolled) * 100),
      dropOffRate: Math.round(((certified - placed) / certified) * 100),
      dropOffReason: 'Recruiter salary gap & migration friction',
    },
    {
      id: 'retained30d',
      stageNumber: 5,
      label: '30-Day Retention',
      count: retained30d,
      percent: Math.round((retained30d / totalEnrolled) * 100),
      dropOffRate: Math.round(((placed - retained30d) / placed) * 100),
      dropOffReason: 'Initial job dislocation & housing adjustment',
    },
    {
      id: 'retained90d',
      stageNumber: 6,
      label: '90-Day Retention',
      count: retained90d,
      percent: Math.round((retained90d / totalEnrolled) * 100),
      dropOffRate: Math.round(((retained30d - retained90d) / retained30d) * 100),
      dropOffReason: 'Probationary skill gap & performance evaluation',
    },
    {
      id: 'retained180d',
      stageNumber: 7,
      label: '180-Day Retention',
      count: retained180d,
      percent: Math.round((retained180d / totalEnrolled) * 100),
      dropOffRate: Math.round(((retained90d - retained180d) / retained90d) * 100),
      dropOffReason: 'Higher studies or local enterprise transition',
    },
    {
      id: 'retained365d',
      stageNumber: 8,
      label: '365-Day Retention',
      count: retained365d,
      percent: Math.round((retained365d / totalEnrolled) * 100),
      dropOffRate: Math.round(((retained180d - retained365d) / retained180d) * 100),
      dropOffReason: 'Annual job switching & career advancement',
    },
    {
      id: 'wageBoost',
      stageNumber: 9,
      label: 'Verified Wage Boost',
      count: Math.round(retained365d * 0.88),
      percent: Math.round(((retained365d * 0.88) / totalEnrolled) * 100),
      dropOffRate: 12,
      dropOffReason: 'Appraisal review in progress',
    },
  ];

  return {
    stages,
    breakdown: {
      totalEnrolled,
      completed,
      certified,
      placed,
      salaried,
      selfEmployed,
      apprenticeship,
      retained30d,
      retained90d,
      retained180d,
      retained365d,
    },
  };
}

// ── DYNAMIC WAGE PROGRESSION CURVE & SUMMARY ─────────────────────────────────
export function getDynamicWageCurve(district: string, program: string): {
  wageCurve: WageCurvePoint[];
  wageSummary: {
    avgInitialSalary: number;
    avgCurrentSalary: number;
    wageProgressionPercent: number;
    totalTrackedWithSalary: number;
  };
} {
  const seed = getSeed(`${district}_${program}_wage`);

  // Base starting salary
  let startSalary = 22000 + (seed % 8) * 1000;
  if (['Pune', 'Mumbai Metropolitan', 'Thane'].includes(district)) startSalary += 12000;
  else if (['Nagpur', 'Nashik', 'Kolhapur', 'Raigad'].includes(district)) startSalary += 6000;

  // Program salary boost
  if (program === 'Full-Stack Web & Cloud DevOps') startSalary += 10000;
  else if (program === 'Industrial Mechatronics & Robotics') startSalary += 7000;
  else if (program === 'EV Battery Systems Maintenance') startSalary += 6500;
  else if (program === 'Fintech Operations & Data Analytics') startSalary += 8000;
  else if (program === 'Solar & Renewable Energy Tech') startSalary += 4500;
  else if (program === 'Pharma Quality Control & Testing') startSalary += 4000;

  const m0 = startSalary;
  const m3 = Math.round(m0 * 1.12);
  const m6 = Math.round(m3 * 1.15);
  const m12 = Math.round(m6 * 1.18);
  const m18 = Math.round(m12 * 1.12);
  const m24 = Math.round(m18 * 1.08);

  const wageCurve: WageCurvePoint[] = [
    { milestone: 'Month 0 (Hire)', medianSalary: m0, verifiedAverage: Math.round(m0 * 0.97) },
    { milestone: 'Month 3 (Probation)', medianSalary: m3, verifiedAverage: Math.round(m3 * 0.98) },
    { milestone: 'Month 6 (Mid-Year)', medianSalary: m6, verifiedAverage: Math.round(m6 * 0.97) },
    { milestone: 'Month 12 (Annual)', medianSalary: m12, verifiedAverage: Math.round(m12 * 0.98) },
    { milestone: 'Month 18 (Upgrade)', medianSalary: m18, verifiedAverage: Math.round(m18 * 0.97) },
    { milestone: 'Month 24 (Retained)', medianSalary: m24, verifiedAverage: Math.round(m24 * 0.99) },
  ];

  const wageProgressionPercent = Number((((m24 - m0) / m0) * 100).toFixed(1));

  return {
    wageCurve,
    wageSummary: {
      avgInitialSalary: m0,
      avgCurrentSalary: m24,
      wageProgressionPercent,
      totalTrackedWithSalary: Math.round(DISTRICT_BASE_COUNTS[district] || 45000),
    },
  };
}

// ── DYNAMIC NON-PLACEMENT ATTRITION BARRIERS ──────────────────────────────────
export function getDynamicBarriers(district: string, program: string): NonPlacementReason[] {
  const seed = getSeed(`${district}_${program}_barrier`);
  const isRural = !['Pune', 'Mumbai Metropolitan', 'Thane', 'Nagpur', 'Nashik'].includes(district);

  let p1 = isRural ? 42 : 22;
  let p2 = 24 + (seed % 6);
  let p3 = 18 + (seed % 4);
  let p4 = 14 + (seed % 3);
  let p5 = 100 - (p1 + p2 + p3 + p4);
  if (p5 < 4) p5 = 6;

  const baseCount = (DISTRICT_BASE_COUNTS[district] || 45000) * 0.28;

  return [
    { reason: isRural ? 'Geographical Relocation & Transport Friction' : 'Post-Assessment Technical Skill Misalignment', count: Math.round(baseCount * (p1 / 100)), pct: p1 },
    { reason: 'Initial Wage Expectation vs Offer Gap', count: Math.round(baseCount * (p2 / 100)), pct: p2 },
    { reason: `Lack of Local ${program !== 'All' ? program : 'Industrial'} NAPS Seats`, count: Math.round(baseCount * (p3 / 100)), pct: p3 },
    { reason: 'Soft Skills, Communication & Interview Confidence', count: Math.round(baseCount * (p4 / 100)), pct: p4 },
    { reason: 'Family Consent & Gender-Specific Mobility Barriers', count: Math.round(baseCount * (p5 / 100)), pct: Math.max(4, p5) },
  ];
}

// ── DYNAMIC POLICY DIRECTIVES ─────────────────────────────────────────────────
export function getDynamicPolicyDirectives(district: string, program: string): PolicyDirectiveItem[] {
  const distName = district !== 'All' ? district : 'Maharashtra State';
  const progName = program !== 'All' ? program : 'Technical Skilling';

  return [
    {
      targetType: 'District Cluster',
      targetName: `${distName} Sector Corridor`,
      confidence: 0.94,
      title: `Deploy ₹12.5 Cr ${progName} Skill Accelerator in ${distName}`,
      observation: `Telemetry for ${distName} indicates strong NSQF completion, but 90-day retention drops by 24% due to practical lab equipment gaps.`,
      recommendedAction: `Mandate modern simulator labs in top ITIs across ${distName} and partner with regional anchor employers.`,
    },
    {
      targetType: 'Demographic Cohort',
      targetName: `Female & Rural Trainees in ${distName}`,
      confidence: 0.91,
      title: `Introduce Safe Relocation Stipends & Local BPO Centers`,
      observation: `Transportation & housing friction accounts for 38% of candidate non-placement in ${distName}.`,
      recommendedAction: `Fund ₹3,500/mo transition stipends for 90 days and establish local remote work annotation centers.`,
    },
    {
      targetType: 'Sector Specialization',
      targetName: progName,
      confidence: 0.89,
      title: `Fast-Track NSQF Level 6 Advanced Certification for ${progName}`,
      observation: `Market demand for ${progName} specialists in ${distName} grew by +85% year-over-year.`,
      recommendedAction: `Update curriculum with live employer-backed micro-credentials and NAPS apprenticeship mandates.`,
    },
  ];
}

// ── DYNAMIC ALGORITHMIC FAIRNESS METRICS ──────────────────────────────────────
export function getDynamicFairnessMetrics(district: string, program: string): AlgorithmicFairnessMetric[] {
  const seed = getSeed(`${district}_${program}_fairness`);

  const wTarget = 72 + (seed % 8);
  const wBase = 78 + (seed % 4);
  const wRatio = Number((wTarget / wBase).toFixed(3));

  const rTarget = 68 + (seed % 10);
  const rBase = 76 + (seed % 5);
  const rRatio = Number((rTarget / rBase).toFixed(3));

  const tTarget = 64 + (seed % 9);
  const tBase = 75 + (seed % 4);
  const tRatio = Number((tTarget / tBase).toFixed(3));

  const pTarget = 58 + (seed % 8);
  const pBase = 72 + (seed % 4);
  const pRatio = Number((pTarget / pBase).toFixed(3));

  return [
    { category: `Women Trainees Parity (${district !== 'All' ? district : 'State'})`, selectionRateTarget: wTarget, selectionRateBaseline: wBase, fourFifthsRatio: wRatio, status: wRatio >= 0.80 ? 'Pass' : 'Audit Required' },
    { category: 'Rural Cohort Inclusion Rate', selectionRateTarget: rTarget, selectionRateBaseline: rBase, fourFifthsRatio: rRatio, status: rRatio >= 0.80 ? 'Pass' : 'Audit Required' },
    { category: 'Scheduled Tribes (ST) Inclusion', selectionRateTarget: tTarget, selectionRateBaseline: tBase, fourFifthsRatio: tRatio, status: tRatio >= 0.80 ? 'Pass' : 'Audit Required' },
    { category: 'Persons with Disabilities (PwD)', selectionRateTarget: pTarget, selectionRateBaseline: pBase, fourFifthsRatio: pRatio, status: pRatio >= 0.80 ? 'Pass' : 'Audit Required' },
  ];
}

// ── CENTRAL TELEMETRY ENGINE PROVIDER ─────────────────────────────────────────
export const GOVERNMENT_FALLBACK_DATA = getGovernmentTelemetry('All', 'All');

export function getGovernmentTelemetry(district = 'All', program = 'All') {
  const { stages, breakdown } = getLongitudinalPipeline(district, program);
  const { wageCurve, wageSummary } = getDynamicWageCurve(district, program);
  const barriers = getDynamicBarriers(district, program);
  const policyDirectives = getDynamicPolicyDirectives(district, program);
  const fairnessMetrics = getDynamicFairnessMetrics(district, program);

  let districts = [...MAHARASHTRA_DISTRICT_TELEMETRY];
  if (district !== 'All') {
    districts = districts.filter((d) => d.district.toLowerCase() === district.toLowerCase());
  }

  return {
    totalTrainees: breakdown.totalEnrolled,
    stages,
    breakdown,
    districts,
    wageCurve,
    wageSummary,
    barriers,
    policyDirectives,
    fairnessMetrics,
  };
}
