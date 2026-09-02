import mongoose from 'mongoose';
import { outcomeService } from '../src/services/outcome.service';
import { consentService } from '../src/services/consent.service';
import { followUpService } from '../src/services/followup.service';
import { dataQualityService } from '../src/services/dataQuality.service';
import { policyCopilotService } from '../src/services/policyCopilot.service';

export async function runOutcomeTests() {
  console.log('--- Running SIH26135 Longitudinal Outcome & Policy Copilot Tests ---');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsense';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  // 1. Test Macro Outcome Funnel
  const funnel = await outcomeService.getOutcomeFunnel();
  if (!funnel || !Array.isArray(funnel.stages) || funnel.stages.length !== 9) {
    throw new Error('Outcome Funnel failed to return 9 longitudinal stages');
  }
  console.log(' [1/5] Macro Outcome Funnel Computed (9 Longitudinal Stages verified)');

  // 2. Test Maharashtra District Intelligence
  const districts = await outcomeService.getDistrictIntelligence();
  if (!Array.isArray(districts) || districts.length === 0) {
    throw new Error('District Intelligence failed to return district data');
  }
  const smallSampleDistrict = districts.find((d) => d.isSmallSample);
  if (smallSampleDistrict && smallSampleDistrict.employmentRate !== null) {
    throw new Error('Small Sample Protection failed: N < 5 must return null employment rate');
  }
  console.log(` [2/5] District Intelligence with Small Sample Protection Verified (${districts.length} districts)`);

  // 3. Test Wage Progression Analytics
  const wage = await outcomeService.getWageProgressionAnalytics();
  if (!wage || !wage.progressionCurve || wage.progressionCurve.length === 0) {
    throw new Error('Wage Progression failed to generate curve');
  }
  console.log(` [3/5] Wage Progression Curve Computed (Initial: ₹${wage.summary.avgInitialSalary.toLocaleString('en-IN')}, Growth: +${wage.summary.wageProgressionPercent}%)`);

  // 4. Test Data Quality Scoring
  const quality = await dataQualityService.calculateDataQualityScore();
  if (typeof quality.overallScore !== 'number' || quality.overallScore < 0 || quality.overallScore > 100) {
    throw new Error('Data Quality score must be 0-100');
  }
  console.log(` [4/5] Data Quality Index Computed (${quality.overallScore}/100, Verification Rate: ${quality.metrics.employerVerificationRate}%)`);

  // 5. Test AI Policy Copilot Grounding
  const copilotRes = await policyCopilotService.queryPolicyCopilot('What are the top skilling outcomes in Maharashtra?');
  if (!copilotRes || !copilotRes.answer || !Array.isArray(copilotRes.citedMetrics)) {
    throw new Error('Policy Copilot failed to return grounded response with cited metrics');
  }
  console.log(` [5/5] AI Policy Copilot Query Verified (${copilotRes.citedMetrics.length} cited database metrics)`);

  console.log('✅ ALL SIH26135 LONGITUDINAL OUTCOME & POLICY COPILOT TESTS PASSED!');
}
