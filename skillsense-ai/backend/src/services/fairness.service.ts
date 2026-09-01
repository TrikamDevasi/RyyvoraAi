import { aiService } from './ai.service';
import logger from '../utils/logger';


// ── Interfaces ────────────────────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  gender: 'male' | 'female';
  region: 'north' | 'south' | 'east' | 'west' | 'central';
  nsqfLevel: number;
  overallScore: number;
  placementStatus: 'placed' | 'studying' | 'seeking';
  salary?: number;
  category?: 'general' | 'sc' | 'st' | 'obc';
}

export interface FairnessMetricsResult {
  period: string;
  computedAt: string;
  overallFairnessScore: number;

  disparateImpact: {
    genderRatio: number;
    regionWorstRatio: number;
    categoryRatio?: number;
  };

  placementByGender: Record<'male' | 'female', number>;
  placementByRegion: Record<string, number>;
  placementByCategory?: Record<string, number>;

  salaryParity: {
    genderGap: number;
    regionGap: number;
  };

  flags: {
    dimension: string;
    metric: string;
    value: number;
    threshold: number;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }[];

  scoreBreakdown: {
    genderParityScore: number;
    regionParityScore: number;
    salaryParityScore: number;
    categoryParityScore: number;
  };
}

export interface AIFairnessReport {
  isFair: boolean;
  flags: string[];
  recommendations: string[];
}

export interface Intervention {
  type: string;
  message: string;
}

// ── FairnessService Class ─────────────────────────────────────────────────────

export class FairnessService {
  private readonly FAIR_RATIO_THRESHOLD = 0.8;
  private readonly HIGH_GAP_THRESHOLD = 10;
  private readonly MEDIUM_GAP_THRESHOLD = 5;

  // ── 1. Compute Full Statistical Fairness Metrics ──────────────────────────
  computeFairnessMetrics(
    students: StudentRecord[],
    period: string
  ): FairnessMetricsResult {
    const placed = students.filter((s) => s.placementStatus === 'placed');

    // --- Gender placement rates ---
    const maleTotal    = students.filter((s) => s.gender === 'male').length;
    const femaleTotal  = students.filter((s) => s.gender === 'female').length;
    const malePlaced   = placed.filter((s) => s.gender === 'male').length;
    const femalePlaced = placed.filter((s) => s.gender === 'female').length;

    const malePlacementRate   = maleTotal   > 0 ? (malePlaced   / maleTotal)   * 100 : 0;
    const femalePlacementRate = femaleTotal > 0 ? (femalePlaced / femaleTotal) * 100 : 0;
    const genderRatio = malePlacementRate > 0 ? femalePlacementRate / malePlacementRate : 1;

    // --- Region placement rates ---
    const regions = ['north', 'south', 'east', 'west', 'central'] as const;
    const placementByRegion: Record<string, number> = {};
    for (const region of regions) {
      const total          = students.filter((s) => s.region === region).length;
      const placedInRegion = placed.filter((s) => s.region === region).length;
      placementByRegion[region] = total > 0 ? (placedInRegion / total) * 100 : 0;
    }
    const regionRates    = Object.values(placementByRegion);
    const maxRate        = Math.max(...regionRates);
    const minRate        = Math.min(...regionRates);
    const regionWorstRatio = maxRate > 0 ? minRate / maxRate : 1;

    // --- Salary parity ---
    const placedWithSalary  = placed.filter((s) => s.salary !== undefined);
    const maleSalaries      = placedWithSalary.filter((s) => s.gender === 'male').map((s) => s.salary!);
    const femaleSalaries    = placedWithSalary.filter((s) => s.gender === 'female').map((s) => s.salary!);
    const avgMaleSalary     = maleSalaries.length   > 0 ? maleSalaries.reduce((a, b)   => a + b, 0) / maleSalaries.length   : 0;
    const avgFemaleSalary   = femaleSalaries.length > 0 ? femaleSalaries.reduce((a, b) => a + b, 0) / femaleSalaries.length : 0;
    const genderSalaryGap   = avgMaleSalary > 0 ? ((avgMaleSalary - avgFemaleSalary) / avgMaleSalary) * 100 : 0;

    const regionSalaries = regions
      .map((r) => {
        const sals = placedWithSalary.filter((s) => s.region === r).map((s) => s.salary!);
        return sals.length > 0 ? sals.reduce((a, b) => a + b, 0) / sals.length : 0;
      })
      .filter((s) => s > 0);
    const maxRegionSal  = Math.max(...regionSalaries);
    const minRegionSal  = Math.min(...regionSalaries);
    const regionSalaryGap = maxRegionSal > 0 ? ((maxRegionSal - minRegionSal) / maxRegionSal) * 100 : 0;

    // --- Category parity ---
    const categories = ['general', 'sc', 'st', 'obc'] as const;
    const placementByCategory: Record<string, number> = {};
    const studentsWithCategory = students.filter((s) => s.category !== undefined);
    if (studentsWithCategory.length > 0) {
      for (const cat of categories) {
        const total    = studentsWithCategory.filter((s) => s.category === cat).length;
        const placedCat = placed.filter((s) => s.category === cat).length;
        placementByCategory[cat] = total > 0 ? (placedCat / total) * 100 : 0;
      }
    }

    // --- Parity scores ---
    const genderParityScore   = Math.min(100, genderRatio * 100);
    const regionParityScore   = Math.min(100, regionWorstRatio * 100);
    const salaryParityScore   = Math.max(0,   100 - genderSalaryGap * 2);
    const categoryRates       = Object.values(placementByCategory);
    const catRatio = categoryRates.length > 1
      ? Math.min(...categoryRates) / Math.max(...categoryRates)
      : 1;
    const categoryParityScore = Math.min(100, catRatio * 100);

    const overallFairnessScore = Math.round(
      genderParityScore   * 0.30 +
      regionParityScore   * 0.35 +
      salaryParityScore   * 0.20 +
      categoryParityScore * 0.15
    );

    // --- Equity flags ---
    const flags: FairnessMetricsResult['flags'] = [];
    const genderGap = Math.abs(malePlacementRate - femalePlacementRate);

    if (genderGap > this.HIGH_GAP_THRESHOLD) {
      flags.push({
        dimension: 'Gender', metric: 'Placement Rate Gap',
        value: genderGap, threshold: this.HIGH_GAP_THRESHOLD, severity: 'high',
        recommendation: 'Introduce female-targeted placement drives and career counseling sessions.',
      });
    } else if (genderGap > this.MEDIUM_GAP_THRESHOLD) {
      flags.push({
        dimension: 'Gender', metric: 'Placement Rate Gap',
        value: genderGap, threshold: this.MEDIUM_GAP_THRESHOLD, severity: 'medium',
        recommendation: 'Monitor gender placement trends monthly; consider mentoring programs.',
      });
    }

    const regionGap = maxRate - minRate;
    if (regionGap > this.HIGH_GAP_THRESHOLD * 1.5) {
      flags.push({
        dimension: 'Region', metric: 'Placement Rate Disparity',
        value: regionGap, threshold: this.HIGH_GAP_THRESHOLD * 1.5, severity: 'high',
        recommendation: 'Redirect training resources to low-performing regions; establish new industry partnerships.',
      });
    }

    if (genderSalaryGap > 8) {
      flags.push({
        dimension: 'Salary', metric: 'Gender Salary Gap',
        value: parseFloat(genderSalaryGap.toFixed(1)), threshold: 8,
        severity: genderSalaryGap > 15 ? 'high' : 'medium',
        recommendation: 'Investigate salary negotiation support for female graduates; audit partner company pay equity.',
      });
    }

    return {
      period,
      computedAt: new Date().toISOString(),
      overallFairnessScore,
      disparateImpact: {
        genderRatio:      parseFloat(genderRatio.toFixed(3)),
        regionWorstRatio: parseFloat(regionWorstRatio.toFixed(3)),
        categoryRatio:    catRatio !== 1 ? parseFloat(catRatio.toFixed(3)) : undefined,
      },
      placementByGender: {
        male:   parseFloat(malePlacementRate.toFixed(1)),
        female: parseFloat(femalePlacementRate.toFixed(1)),
      },
      placementByRegion: Object.fromEntries(
        Object.entries(placementByRegion).map(([k, v]) => [k, parseFloat(v.toFixed(1))])
      ),
      placementByCategory: Object.keys(placementByCategory).length > 0 ? placementByCategory : undefined,
      salaryParity: {
        genderGap: parseFloat(genderSalaryGap.toFixed(1)),
        regionGap: parseFloat(regionSalaryGap.toFixed(1)),
      },
      flags,
      scoreBreakdown: {
        genderParityScore:   Math.round(genderParityScore),
        regionParityScore:   Math.round(regionParityScore),
        salaryParityScore:   Math.round(salaryParityScore),
        categoryParityScore: Math.round(categoryParityScore),
      },
    };
  }

  // ── 2. AI-Powered Bias Analysis (OpenAI) ──────────────────────────────────
  async runAIFairnessAnalysis(
    cohortData: any[]
  ): Promise<AIFairnessReport | null> {
    if (!cohortData || cohortData.length === 0) return null;

    try {
      const prompt = `You are an AI bias auditor for a vocational education platform in India.
Analyse the following cohort data for potential biases in skill scores or placements across demographics (gender, region, institution type, social category).

Cohort Data (sample of ${Math.min(cohortData.length, 50)} records):
${JSON.stringify(cohortData.slice(0, 50))}

Return ONLY valid JSON:
{
  "isFair": boolean,
  "flags": ["<specific disparity identified, e.g. Gender gap in digital literacy scores>"],
  "recommendations": ["<actionable step to mitigate each bias>"]
}`.trim();

      const content = await aiService.chatWithFallback(
        [
          { role: 'system', content: 'You are an objective AI fairness and bias auditor. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        {
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 500,
        }
      );

      if (!content) throw new Error('AI fairness analysis unavailable (empty provider response)');
      const parsed = JSON.parse(content);

      return {
        isFair:          parsed.isFair          ?? null,
        flags:           Array.isArray(parsed.flags) ? parsed.flags : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      };
    } catch (err) {
      logger.error('AI fairness analysis error:', err);
      return null;
    }
  }

  // ── 3. Validate Recommendation Fairness ───────────────────────────────────
  validateRecommendationFairness(
    recommendationScores: Record<string, number>,
    protectedAttribute: string
  ): { isFair: boolean; ratio: number; message: string } {
    const values = Object.values(recommendationScores);
    if (values.length < 2) {
      return { isFair: true, ratio: 1, message: 'Insufficient groups to compare.' };
    }

    const max    = Math.max(...values);
    const min    = Math.min(...values);
    const ratio  = max > 0 ? min / max : 1;
    const isFair = ratio >= this.FAIR_RATIO_THRESHOLD;

    return {
      isFair,
      ratio: parseFloat(ratio.toFixed(3)),
      message: isFair
        ? `✓ Recommendation is fair for ${protectedAttribute} (ratio: ${ratio.toFixed(2)} ≥ 0.8).`
        : `⚠ Fairness violation for ${protectedAttribute}: ratio ${ratio.toFixed(2)} < 0.8. Review model outputs.`,
    };
  }

  // ── 4. Equity Gap Report (Government Dashboard) ───────────────────────────
  computeEquityGapReport(
    groups: { name: string; avgScore: number; placementRate: number }[]
  ): {
    maxGap: number;
    worstGroup: string;
    bestGroup: string;
    equityIndex: number;
  } {
    if (groups.length === 0) {
      return { maxGap: 0, worstGroup: '', bestGroup: '', equityIndex: 1 };
    }

    const sorted      = [...groups].sort((a, b) => a.avgScore - b.avgScore);
    const worst       = sorted[0];
    const best        = sorted[sorted.length - 1];
    const maxGap      = best.avgScore - worst.avgScore;
    const equityIndex = best.avgScore > 0 ? worst.avgScore / best.avgScore : 1;

    return {
      maxGap:      parseFloat(maxGap.toFixed(1)),
      worstGroup:  worst.name,
      bestGroup:   best.name,
      equityIndex: parseFloat(equityIndex.toFixed(3)),
    };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const fairnessService = new FairnessService();
