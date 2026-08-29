import assert from 'assert';
import { fairnessService } from '../src/services/fairness.service';

export async function runFairnessTests() {
  console.log('🧪 Running Fairness & Disparate Impact Calculation Tests...');

  const mockStudents = [
    { id: '1', gender: 'male' as const, region: 'north' as const, nsqfLevel: 4, overallScore: 80, placementStatus: 'placed' as const, salary: 500000 },
    { id: '2', gender: 'male' as const, region: 'north' as const, nsqfLevel: 4, overallScore: 75, placementStatus: 'placed' as const, salary: 480000 },
    { id: '3', gender: 'female' as const, region: 'south' as const, nsqfLevel: 4, overallScore: 82, placementStatus: 'placed' as const, salary: 520000 },
    { id: '4', gender: 'female' as const, region: 'south' as const, nsqfLevel: 4, overallScore: 78, placementStatus: 'seeking' as const, salary: 0 },
  ];

  const metrics = fairnessService.computeFairnessMetrics(mockStudents, 'Test Cohort');

  assert(metrics !== null, 'Fairness metrics should not be null');
  assert(typeof metrics.overallFairnessScore === 'number', 'Fairness score must be a number');
  assert(metrics.overallFairnessScore >= 0 && metrics.overallFairnessScore <= 100, 'Fairness score must be between 0 and 100');
  assert(typeof metrics.disparateImpact.genderRatio === 'number', 'Disparate impact gender ratio should be a number');
  assert(Array.isArray(metrics.flags), 'Flags should be an array');

  console.log(`  ✅ Fairness compute completed with score ${metrics.overallFairnessScore}/100 and ${metrics.flags.length} flags`);
}
