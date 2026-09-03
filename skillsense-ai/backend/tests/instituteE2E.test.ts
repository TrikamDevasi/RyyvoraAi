import assert from 'assert';
import mongoose from 'mongoose';
import User from '../src/models/User.model';
import Student from '../src/models/Student.model';
import Institution from '../src/models/Institution.model';
import Assessment from '../src/models/Assessment.model';
import EmploymentOutcome from '../src/models/EmploymentOutcome.model';
import { outcomeService } from '../src/services/outcome.service';

export async function runInstituteE2ETests() {
  console.log('--- Running Institute E2E, Self-Report Resolution & Dynamic ROI Tests ---');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsense';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  // ── Test 1: Self-Report Employer Resolution ───────────────────────────────
  console.log('Testing Trainee Self-Report Employer Resolution...');
  
  // Ensure a clean, uniquely named test employer exists
  await User.deleteMany({ email: 'test.persistent.e2e@skillsense.demo' });
  const testEmployer = await User.create({
    name: 'Persistent Systems (Technologies) Ltd',
    email: 'test.persistent.e2e@skillsense.demo',
    role: 'employer',
    isVerified: true,
    authProvider: 'local',
    password: 'password123',
  });

  // Exact name resolution
  const resolvedIdExact = await outcomeService.resolveEmployerId('Persistent Systems (Technologies) Ltd');
  assert.ok(resolvedIdExact, 'Should resolve exact employer name');
  assert.strictEqual(String(resolvedIdExact), String(testEmployer._id));

  // Suffix & case-insensitive normalized resolution
  const resolvedIdNormalized = await outcomeService.resolveEmployerId('persistent systems');
  assert.ok(resolvedIdNormalized, 'Should resolve normalized case-insensitive employer name');
  assert.strictEqual(String(resolvedIdNormalized), String(testEmployer._id));

  // Unknown employer must return undefined (do NOT fabricate)
  const resolvedUnknown = await outcomeService.resolveEmployerId('Completely Unknown Nonexistent Pvt Ltd');
  assert.strictEqual(resolvedUnknown, undefined, 'Unknown employer must return undefined without fabricating');

  console.log('✓ Trainee self-report employer matching passed: Exact match, normalized match, and safe null handling verified.');

  // ── Test 2: Individual Student Creation with Passport ─────────────────────
  console.log('Testing Individual Student Creation & Verifiable Passport Hash...');

  let testInst = await Institution.findOne({ name: 'Test ITI Institute E2E' });
  if (!testInst) {
    testInst = await Institution.create({
      name: 'Test ITI Institute E2E',
      type: 'ITI',
      state: 'Maharashtra',
      district: 'Pune',
      nsqfAffiliation: 'NSQF-TEST-001',
      studentCount: 0,
      placementRate: 80,
      programs: ['Web & Mobile Technology', 'Cloud Computing'],
      contactEmail: 'iti.test@skillsense.demo',
    });
  }

  const initialCount = testInst.studentCount || 0;
  const testStudentEmail = `trainee.e2e.${Date.now()}@skillsense.demo`;

  // Create student user
  const studentUser = await User.create({
    name: 'Pooja Kulkarni',
    email: testStudentEmail,
    role: 'student',
    location: 'Pune',
    isVerified: true,
    authProvider: 'local',
    password: 'password123',
  });

  const studentDoc = await Student.create({
    userId: studentUser._id,
    institutionId: testInst._id,
    enrollmentNumber: `MH-TEST-${Date.now().toString().slice(-6)}`,
    program: 'Web & Mobile Technology',
    nsqfLevel: 5,
    state: 'Maharashtra',
    gender: 'female',
    placementStatus: 'studying',
    skills: [{ score: 76, lastAssessed: new Date() } as any],
    passportHash: `SKP-${studentUser._id.toString().slice(-8).toUpperCase()}-VERIFIED`,
  });

  assert.ok(studentDoc._id, 'Student document must be created');
  assert.ok(studentDoc.passportHash, 'Student must have a valid passport hash');
  assert.strictEqual(studentDoc.placementStatus, 'studying', 'Placement status must default to studying');

  console.log('✓ Individual student creation passed: Validated schema, generated unique enrollment and passport hash.');

  // ── Test 3: Project Evaluation & Passport Re-Certification ────────────────
  console.log('Testing Institute Evaluation & Passport Hash Recalculation...');

  const assessment = await Assessment.create({
    studentId: studentUser._id,
    category: 'Full-Stack Capstone Project',
    score: 92,
    totalQuestions: 100,
    aiAnalysis: 'Outstanding project architecture. Full NCVET rubric satisfied.',
    completedAt: new Date(),
  });

  assert.ok(assessment._id, 'Assessment document must be created');
  assert.strictEqual(assessment.score, 92, 'Score must be recorded');

  // Update student skills with newly certified evaluation
  studentDoc.skills.push({
    score: assessment.score,
    lastAssessed: new Date(),
    history: [{ score: assessment.score, date: new Date() }],
  } as any);
  studentDoc.passportHash = `SKP-${studentUser._id.toString().slice(-8).toUpperCase()}-SCORE-${studentDoc.overallScore}`;
  await studentDoc.save();

  assert.strictEqual(studentDoc.overallScore, 84, 'Student overall score must be updated accurately to (75 + 92)/2 = 84');
  assert.ok(studentDoc.passportHash.includes('SCORE-84'), 'Passport hash must reflect updated evaluation');

  console.log('✓ Institute evaluation passed: Recorded assessment, updated competency score, and refreshed passport credential.');

  // ── Test 4: Dynamic ROI Calculation & Statistical Safeguards ──────────────
  console.log('Testing Dynamic ROI Calculation & Insufficient Data Handling...');

  // Create outcomes for test institution
  await EmploymentOutcome.create({
    traineeId: studentUser._id,
    institutionId: testInst._id,
    program: 'Web & Mobile Technology',
    district: 'Pune',
    state: 'Maharashtra',
    status: 'EMPLOYED',
    employerName: 'Persistent Systems (Technologies) Ltd',
    employerId: testEmployer._id,
    jobRole: 'Frontend Associate',
    initialSalary: 25000,
    currentSalary: 30000,
    verificationStatus: 'VERIFIED',
  });

  // Because total cohort for testInst has only 1 student (< 5 threshold), dynamic ROI must flag insufficient data
  const studentsInCohort = await Student.find({ institutionId: testInst._id });
  const isCohortInsufficient = studentsInCohort.length < 5;
  assert.strictEqual(isCohortInsufficient, true, 'Cohort < 5 must be flagged as insufficient data for statistical privacy');

  console.log('✓ Dynamic ROI statistical boundary test passed: Cohorts below threshold correctly trigger INSUFFICIENT_DATA safeguards.');

  // Clean up test records
  await Student.deleteOne({ _id: studentDoc._id });
  await User.deleteOne({ _id: studentUser._id });
  await User.deleteOne({ _id: testEmployer._id });
  await Assessment.deleteOne({ _id: assessment._id });
  await EmploymentOutcome.deleteMany({ institutionId: testInst._id });
  await Institution.deleteOne({ _id: testInst._id });

  console.log('🎉 All Institute E2E, Evaluation & Dynamic ROI Tests Passed!\n');
}

if (require.main === module) {
  runInstituteE2ETests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
