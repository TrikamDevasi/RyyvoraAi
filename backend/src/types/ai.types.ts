export interface SkillScore {
  skillName: string;
  score: number;
  confidence: number;
}

export interface CareerPrediction {
  likelyRoles: string[];
  matchScores: number[];
  predictedSalaryRange: string;
  timeToPlacement: string;
}

export interface FairnessFlag {
  dimension: string;
  gapPercent: number;
  severity: 'critical' | 'moderate' | 'minor';
}

/**
 * AI-generated fairness report.
 * flags is string[] (plain language from GPT).
 * For statistical fairness metrics, see FairnessMetricsResult in fairness.service.ts.
 */
export interface FairnessReport {
  isFair: boolean;
  flags: string[];
  recommendations: string[];
}

export interface Intervention {
  type: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedImpact: string;
}
