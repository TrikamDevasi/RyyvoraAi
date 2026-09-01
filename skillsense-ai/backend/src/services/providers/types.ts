// backend/src/services/providers/types.ts
import { z } from 'zod';

// ── Common Provider Interface ──────────────────────────────────────────────────

export interface ProviderHealth {
  name: string;
  configured: boolean;
  healthy: boolean;
  model: string;
  latencyMs: number;
  message: string;
  lastChecked?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
  timeoutMs?: number;
}

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
  healthCheck(): Promise<ProviderHealth>;
  generateCompletion(messages: ChatMessage[], options?: CompletionOptions): Promise<string>;
  generateStream?(messages: ChatMessage[], options?: CompletionOptions): AsyncGenerator<string, void, unknown>;
}

// ── Zod Schemas for Structured AI Outputs ──────────────────────────────────────

// 1. Skill Extraction & Comprehensive Analysis
export const SkillDimensionSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  category: z.enum(['technical', 'soft', 'domain', 'architectural', 'tools']).default('technical'),
  confidence: z.number().min(0).max(1).default(0.85),
  evidence: z.string().default(''),
});

export const CompetencyCategorySchema = z.object({
  category: z.string(),
  score: z.number().min(0).max(100),
  description: z.string().default(''),
});

export const SkillAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1).default(0.9),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  technicalSkills: z.array(SkillDimensionSchema).default([]),
  softSkills: z.array(SkillDimensionSchema).default([]),
  competencies: z.array(CompetencyCategorySchema).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  summary: z.string().default(''),
});
export type SkillAnalysisResult = z.infer<typeof SkillAnalysisSchema>;

// 2. Career Prediction
export const CareerPathSchema = z.object({
  title: z.string(),
  matchPercent: z.number().min(0).max(100),
  salaryRange: z.string().default('₹6,00,000 – ₹14,00,000/year (Model Estimate)'),
  growth: z.enum(['Exponential', 'High', 'Moderate', 'Stable']).default('High'),
  requiredSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  timeToAchieve: z.string().default('2-4 months'),
  roadmap: z.array(z.string()).default([]),
  reasoning: z.string().default(''),
});

export const CareerPredictionSchema = z.object({
  topCareerPaths: z.array(CareerPathSchema).min(1),
  aiExplanation: z.string().default(''),
});
export type CareerPredictionResult = z.infer<typeof CareerPredictionSchema>;

// 3. Skill Gap Analysis
export const CriticalGapSchema = z.object({
  skill: z.string(),
  currentScore: z.number().min(0).max(100),
  requiredScore: z.number().min(0).max(100),
  gap: z.number().min(0).max(100),
  priority: z.enum(['High', 'Medium', 'Low']).default('High'),
  impactReason: z.string().default('Essential for role performance'),
  recommendedAction: z.string().default('Complete hands-on project or certification'),
  estimatedEffort: z.string().default('2-3 weeks'),
});

export const GapRoadmapStepSchema = z.object({
  phase: z.string(),
  timeline: z.string(),
  actions: z.array(z.string()),
  targetSkills: z.array(z.string()),
});

export const GapAnalysisSchema = z.object({
  targetRole: z.string().default('Software Engineer'),
  overallGapScore: z.number().min(0).max(100),
  criticalGaps: z.array(CriticalGapSchema).default([]),
  prioritySkills: z.array(z.string()).default([]),
  roadmap: z.array(GapRoadmapStepSchema).default([]),
  estimatedTimeToClose: z.string().default('2-4 months'),
  confidence: z.number().min(0).max(1).default(0.9),
  aiSummary: z.string().default(''),
});
export type GapAnalysisResult = z.infer<typeof GapAnalysisSchema>;

// 4. Assessment Generation (Multiple Choice Questions)
export const AssessmentQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2),
  correct: z.string(),
  explanation: z.string().optional(),
});

export const AssessmentGenerationSchema = z.object({
  topic: z.string(),
  level: z.string().default('Intermediate'),
  questions: z.array(AssessmentQuestionSchema).min(1),
});
export type AssessmentGenerationResult = z.infer<typeof AssessmentGenerationSchema>;

// 5. Assessment Evaluation
export const AssessmentEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  correct: z.number().min(0),
  total: z.number().min(1),
  level: z.string().default('Intermediate'),
  weakAreas: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  improvementPlan: z.string().default('Continue practicing core concepts with practical projects.'),
  nextSteps: z.array(z.string()).default([]),
});
export type AssessmentEvaluationResult = z.infer<typeof AssessmentEvaluationSchema>;

// 6. Industry Market Demand (Perplexity / Real-time search)
export const IndustryDemandSchema = z.object({
  skill: z.string().default(''),
  demandSummary: z.string().default('High industry demand observed.'),
  trendDirection: z.enum(['rising', 'stable', 'declining']).default('rising'),
  topEmployers: z.array(z.string()).default([]),
  avgSalaryRange: z.string().default('₹6,00,000 – ₹14,00,000 per annum (Estimated)'),
  trendingTopics: z.array(z.string()).default([]),
  jobCount: z.string().default('10,000+ active openings'),
});
export type IndustryDemandResult = z.infer<typeof IndustryDemandSchema>;

// 7. AI Fairness & Bias Report
export const FairnessAuditSchema = z.object({
  isFair: z.boolean().default(true),
  flags: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});
export type FairnessAuditResult = z.infer<typeof FairnessAuditSchema>;
