import mongoose from 'mongoose';
import { outcomeService } from '../src/services/outcome.service';
import { consentService } from '../src/services/consent.service';
import { followUpService } from '../src/services/followup.service';
import { followUpSchedulerService } from '../src/services/followupScheduler.service';
import { retentionService } from '../src/services/retention.service';
import { passportService } from '../src/services/passport.service';
import { dataQualityService } from '../src/services/dataQuality.service';
import { policyCopilotService } from '../src/services/policyCopilot.service';

export async function runOutcomeTests() {
  console.log('--- Running SIH26135 Longitudinal Outcome, Scheduler & Policy Copilot Tests ---');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsense';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  // 1. Test Macro Outcome Funnel
  const funnel = await outcomeService.getOutcomeFunnel();
  if (!funnel || !Array.isArray(funnel.stages) || funnel.stages.length !== 9) {
    throw new Error('Outcome Funnel failed to return 9 longitudinal stages');
  }
  console.log(' [1/8] Macro Outcome Funnel Computed (9 Longitudinal Stages verified)');

  // 2. Test Maharashtra District Intelligence
  const districts = await outcomeService.getDistrictIntelligence();
  if (!Array.isArray(districts) || districts.length === 0) {
    throw new Error('District Intelligence failed to return district data');
  }
  const smallSampleDistrict = districts.find((d) => d.isSmallSample);
  if (smallSampleDistrict && smallSampleDistrict.employmentRate !== null) {
    throw new Error('Small Sample Protection failed: N < 5 must return null employment rate');
  }
  console.log(` [2/8] District Intelligence with Small Sample Protection Verified (${districts.length} districts)`);

  // 3. Test Wage Progression Analytics
  const wage = await outcomeService.getWageProgressionAnalytics();
  if (!wage || !wage.progressionCurve || wage.progressionCurve.length === 0) {
    throw new Error('Wage Progression failed to generate curve');
  }
  console.log(` [3/8] Wage Progression Curve Computed (Initial: ₹${wage.summary.avgInitialSalary.toLocaleString('en-IN')}, Growth: +${wage.summary.wageProgressionPercent}%)`);

  // 4. Test Data Quality Scoring
  const quality = await dataQualityService.calculateDataQualityScore();
  if (typeof quality.overallScore !== 'number' || quality.overallScore < 0 || quality.overallScore > 100) {
    throw new Error('Data Quality score must be 0-100');
  }
  console.log(` [4/8] Data Quality Index Computed (${quality.overallScore}/100, Verification Rate: ${quality.metrics.employerVerificationRate}%)`);

  // 5. Test AI Policy Copilot Grounding
  const copilotRes = await policyCopilotService.queryPolicyCopilot('What are the top skilling outcomes in Maharashtra?');
  if (!copilotRes || !copilotRes.answer || !Array.isArray(copilotRes.citedMetrics)) {
    throw new Error('Policy Copilot failed to return grounded response with cited metrics');
  }
  console.log(` [5/8] AI Policy Copilot Query Verified (${copilotRes.citedMetrics.length} cited database metrics)`);

  // 6. Test Automated Follow-Up Scheduler (Milestone logic & execution)
  const testStartDate = new Date('2024-01-01T00:00:00Z');
  const testAsOfDate = new Date('2024-04-05T00:00:00Z'); // ~95 days elapsed
  const dueMilestones = followUpSchedulerService.calculateDueMilestones(testStartDate, testAsOfDate);
  if (!dueMilestones.includes(30) || !dueMilestones.includes(60) || !dueMilestones.includes(90)) {
    throw new Error('Scheduler due milestone calculation failed for 95 elapsed days');
  }
  const schedulerRun = await followUpSchedulerService.runFollowUpScheduler();
  if (typeof schedulerRun.outcomesInspected !== 'number') {
    throw new Error('Scheduler run did not return valid result');
  }
  console.log(` [6/8] Automated Follow-Up Scheduler Verified (${schedulerRun.outcomesInspected} outcomes inspected, ${schedulerRun.followUpsCreated} scheduled)`);

  // 7. Test Real Retention Calculation
  const cohortRetention = await retentionService.calculateCohortRetention();
  if (typeof cohortRetention.totalPlaced !== 'number' || typeof cohortRetention.rate90d !== 'number') {
    throw new Error('Cohort retention calculation failed');
  }
  console.log(` [7/8] Longitudinal Retention Engine Verified (${cohortRetention.totalPlaced} placed tracked, 90d rate: ${cohortRetention.rate90d}%, 365d rate: ${cohortRetention.rate365d}%)`);

  // 8. Test Cryptographic Skill Passport ID & Verification
  const testPassport = await passportService.generatePassport({
    studentId: '65f0123456789abcdef01234',
    studentName: 'Aarav Deshmukh',
    gender: 'male',
    program: 'MSSDS Advanced Web Engineering',
    institutionId: '65f0123456789abcdef01235',
    institutionName: 'MSSDS Pune Regional Training Center',
    state: 'Maharashtra',
    nsqfLevel: 5,
    batch: '2024-2025',
    skills: [{ skill: 'Node.js', score: 90, assessedOn: '2024-09-15', assessedBy: 'MSSDS', verified: true }],
    overallScore: 90,
    placementStatus: 'placed',
  });
  if (!testPassport.passportId.startsWith('SKP-') || !testPassport.credentialHash) {
    throw new Error('Passport generation failed format check');
  }
  const verification = await passportService.verifyPassport(testPassport.passportId, testPassport.credentialHash, testPassport);
  if (!verification.isValid) {
    throw new Error(`Passport verification failed: ${verification.reason}`);
  }
  console.log(` [8/8] Cryptographic Skill Passport Integrity Verified (Passport: ${testPassport.passportId}, Hash: ${testPassport.credentialHash.slice(0, 12)}...)`);

  console.log('✅ ALL SIH26135 LONGITUDINAL OUTCOME, SCHEDULER & RETENTION TESTS PASSED!');
}
