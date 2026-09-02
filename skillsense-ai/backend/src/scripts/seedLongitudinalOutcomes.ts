// backend/src/scripts/seedLongitudinalOutcomes.ts
// Seeds realistic longitudinal skilling outcome dataset for Government of Maharashtra (SIH26135)
// Run: npx ts-node -r tsconfig-paths/register src/scripts/seedLongitudinalOutcomes.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEMO_USERS = [
  {
    name: 'Maharashtra Skilling Directorate',
    email: 'government@skillsense.demo',
    password: 'Demo@1234',
    role: 'government',
    location: 'Mumbai',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'MSSDS Pune Regional Training Center',
    email: 'provider@skillsense.demo',
    password: 'Demo@1234',
    role: 'institute',
    location: 'Pune',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Aarav Deshmukh',
    email: 'trainee@skillsense.demo',
    password: 'Demo@1234',
    role: 'student',
    location: 'Pune',
    isVerified: true,
    isActive: true,
    skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Git'],
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    email: 'employer@skillsense.demo',
    password: 'Demo@1234',
    role: 'employer',
    location: 'Pune',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'System Admin',
    email: 'admin@skillsense.demo',
    password: 'Demo@1234',
    role: 'admin',
    location: 'Mumbai',
    isVerified: true,
    isActive: true,
  },
];

const DISTRICTS = [
  { name: 'Pune', count: 30, empRate: 0.88, avgSalary: 28000 },
  { name: 'Mumbai Suburban', count: 24, empRate: 0.85, avgSalary: 32000 },
  { name: 'Nagpur', count: 18, empRate: 0.76, avgSalary: 22000 },
  { name: 'Nashik', count: 14, empRate: 0.72, avgSalary: 20000 },
  { name: 'Chhatrapati Sambhaji Nagar', count: 12, empRate: 0.65, avgSalary: 18500 },
  { name: 'Thane', count: 10, empRate: 0.82, avgSalary: 26000 },
  { name: 'Solapur', count: 6, empRate: 0.58, avgSalary: 16000 },
  { name: 'Kolhapur', count: 6, empRate: 0.64, avgSalary: 17500 },
  { name: 'Amravati', count: 4, empRate: 0.50, avgSalary: 15000 }, // Small sample test
];

const PROGRAMMES = [
  { name: 'MSSDS Advanced Web Engineering', nsqf: 5, domain: 'Information Technology' },
  { name: 'PMKVY Industrial Automation & Robotics', nsqf: 5, domain: 'Manufacturing & Automation' },
  { name: 'Solar PV Installation & Grid Tech', nsqf: 4, domain: 'Renewable Energy' },
  { name: 'Healthcare & Emergency Medical Tech', nsqf: 4, domain: 'Healthcare' },
  { name: 'Cloud Infrastructure & Cyber DevOps', nsqf: 6, domain: 'Cloud & Cyber' },
];

const EMPLOYERS = [
  'Tata Consultancy Services',
  'Infosys BPM',
  'Bajaj Auto Pune',
  'L&T Technology Services',
  'Mahindra & Mahindra',
  'Kirloskar Brothers',
  'KPIT Technologies',
  'Persistent Systems',
  'Tata Solar Maharashtra',
  'Apollo Clinics Maharashtra',
];

const FIRST_NAMES = ['Rohan', 'Pooja', 'Aditya', 'Neha', 'Siddharth', 'Tanvi', 'Omkar', 'Snehal', 'Pratik', 'Ananya', 'Vaibhav', 'Shruti', 'Nikhil', 'Gauri', 'Amit', 'Sayali', 'Kunal', 'Divya', 'Mayur', 'Kavita'];
const LAST_NAMES = ['Patil', 'Kulkarni', 'Jadhav', 'Shinde', 'Pawar', 'More', 'Chavan', 'Deshmukh', 'Gaikwad', 'Bhosale', 'Kadam', 'Wagh', 'Sawant', 'Mane', 'Bichitkar', 'Surve', 'Tambe', 'Salunkhe'];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsense';
  await mongoose.connect(uri);
  console.log(' Connected to MongoDB:', uri);

  // Lazy import models
  const User = (await import('../models/User.model')).default;
  const Student = (await import('../models/Student.model')).default;
  const Institution = (await import('../models/Institution.model')).default;
  const OutcomeTimeline = (await import('../models/OutcomeTimeline.model')).default;
  const EmploymentOutcome = (await import('../models/EmploymentOutcome.model')).default;
  const FollowUp = (await import('../models/FollowUp.model')).default;
  const Consent = (await import('../models/Consent.model')).default;
  const PolicyIntervention = (await import('../models/PolicyIntervention.model')).default;

  // Clear existing outcome collections for clean demo state
  await OutcomeTimeline.deleteMany({});
  await EmploymentOutcome.deleteMany({});
  await FollowUp.deleteMany({});
  await PolicyIntervention.deleteMany({});

  console.log(' Cleared previous outcome timeline, employment, followup, and policy data');

  // 1. Create or Update Core Demo Users
  const userMap: Record<string, any> = {};
  for (const acc of DEMO_USERS) {
    const hashed = await bcrypt.hash(acc.password, 12);
    let user = await User.findOne({ email: acc.email });
    if (user) {
      user.password = hashed;
      user.role = acc.role as any;
      user.isActive = true;
      user.isVerified = true;
      user.location = acc.location;
      user.skills = acc.skills || [];
      await user.save();
    } else {
      user = await User.create({
        name: acc.name,
        email: acc.email,
        password: hashed,
        role: acc.role as any,
        location: acc.location,
        isVerified: true,
        isActive: true,
        authProvider: 'local',
        skills: acc.skills || [],
      });
    }
    userMap[acc.email] = user;
    console.log(` User Ready: ${acc.email} (${acc.role})`);
  }

  // 2. Ensure Primary Training Provider Institution exists
  let primaryInst = await Institution.findOne({ name: 'MSSDS Pune Regional Training Center' });
  if (!primaryInst) {
    primaryInst = await Institution.create({
      name: 'MSSDS Pune Regional Training Center',
      type: 'Vocational',
      state: 'Maharashtra',
      district: 'Pune',
      nsqfAffiliation: 'NSQF-MSSDS-MH-2024',
      contactEmail: 'provider@skillsense.demo',
      studentCount: 120,
      placementRate: 85,
      isVerified: true,
      programs: PROGRAMMES.map((p) => p.name),
    });
  }


  // 3. Setup Aarav Deshmukh (Primary Trainee Demo)
  const primaryTraineeUser = userMap['trainee@skillsense.demo'];
  const passportHash = '0x8f4c2e91b5a3d76e48c10927fa118239cb72e01a';

  let primaryStudent = await Student.findOne({ userId: primaryTraineeUser._id });
  if (!primaryStudent) {
    primaryStudent = await Student.create({
      userId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      enrollmentNumber: 'MH-MSSDS-2024-0101',
      program: 'MSSDS Advanced Web Engineering',
      nsqfLevel: 5,
      batch: '2024-2025',
      state: 'Maharashtra',
      gender: 'male',
      skills: [
        { score: 88, lastAssessed: new Date('2024-09-15') },
        { score: 82, lastAssessed: new Date('2024-09-15') },
        { score: 90, lastAssessed: new Date('2024-09-15') },
      ],
      placementStatus: 'placed',
      placedAt: new Date('2024-11-01'),
      placedRole: 'Associate Software Engineer',
      salary: 384000,
      passportHash,
    });
  } else {
    primaryStudent.passportHash = passportHash;
    primaryStudent.placementStatus = 'placed';
    primaryStudent.placedRole = 'Associate Software Engineer';
    primaryStudent.salary = 384000;
    await primaryStudent.save();
  }

  // Create Consent for Primary Trainee
  await Consent.findOneAndUpdate(
    { userId: primaryTraineeUser._id },
    {
      userId: primaryTraineeUser._id,
      status: 'GRANTED',
      purposes: [
        'outcome_tracking',
        'employer_verification',
        'longitudinal_followup',
        'salary_benchmarking',
        'policy_analytics',
      ],
      grantedAt: new Date('2024-06-01'),
      consentHistory: [
        {
          action: 'GRANT',
          timestamp: new Date('2024-06-01'),
          purposes: [
            'outcome_tracking',
            'employer_verification',
            'longitudinal_followup',
            'salary_benchmarking',
            'policy_analytics',
          ],
        },
      ],
    },
    { upsert: true }
  );

  // Complete Longitudinal Timeline for Aarav Deshmukh
  const aaravMilestones = [
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-06-05'),
      eventType: 'ENROLLED',
      title: 'Enrolled in Maharashtra Skilling Initiative',
      description: 'Candidate admitted to MSSDS Advanced Web Engineering batch at Pune Regional Center.',
      source: 'TRAINING_PROVIDER',
      verificationStatus: 'VERIFIED',
      confidence: 1.0,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-06-12'),
      eventType: 'TRAINING_STARTED',
      title: 'Vocational Curriculum Commenced',
      description: 'Started NSQF Level 5 modular full-stack web and cloud curriculum.',
      source: 'TRAINING_PROVIDER',
      verificationStatus: 'VERIFIED',
      confidence: 1.0,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-09-18'),
      eventType: 'ASSESSMENT_COMPLETED',
      title: 'NSQF Proctored Competency Exam Completed',
      description: 'Completed standardized vocational examination with aggregate score 86.6/100.',
      source: 'TRAINING_PROVIDER',
      verificationStatus: 'VERIFIED',
      confidence: 0.98,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-09-24'),
      eventType: 'CERTIFIED',
      title: 'State Vocational Certificate Issued',
      description: 'Cryptographically anchored Skill Passport generated with hash ' + passportHash.slice(0, 10) + '...',
      source: 'TRAINING_PROVIDER',
      verificationStatus: 'VERIFIED',
      confidence: 1.0,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-10-10'),
      eventType: 'PLACEMENT_ASSISTANCE',
      title: 'Campus Placement Drive Attendance',
      description: 'Profile submitted to hiring partners including TCS, KPIT, and Persistent Systems.',
      source: 'TRAINING_PROVIDER',
      verificationStatus: 'VERIFIED',
      confidence: 0.95,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-11-01'),
      eventType: 'EMPLOYED',
      title: 'Employed at Tata Consultancy Services',
      description: 'Joined as Associate Software Engineer with initial monthly compensation of ₹28,000.',
      source: 'EMPLOYER_VERIFICATION',
      verificationStatus: 'VERIFIED',
      confidence: 0.98,
      metadata: { role: 'Associate Software Engineer', employer: 'Tata Consultancy Services', salary: 28000 },
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2024-12-01'),
      eventType: 'FOLLOW_UP_30D',
      title: '30-Day Longitudinal Follow-up Verified',
      description: 'Trainee confirmed successful onboarding and role alignment with web curriculum.',
      source: 'FOLLOW_UP',
      verificationStatus: 'VERIFIED',
      confidence: 0.95,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2025-02-05'),
      eventType: 'FOLLOW_UP_90D',
      title: '90-Day Retention Milestone Achieved',
      description: 'Continued employment confirmed by employer verification ledger.',
      source: 'EMPLOYER_VERIFICATION',
      verificationStatus: 'VERIFIED',
      confidence: 0.98,
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2025-05-10'),
      eventType: 'SALARY_UPDATED',
      title: 'Annual Wage Progression Incremented',
      description: 'Monthly compensation progressed from ₹28,000 to ₹32,000 following performance review.',
      source: 'EMPLOYER_VERIFICATION',
      verificationStatus: 'VERIFIED',
      confidence: 0.96,
      metadata: { previousSalary: 28000, newSalary: 32000 },
    },
    {
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      program: 'MSSDS Advanced Web Engineering',
      district: 'Pune',
      state: 'Maharashtra',
      date: new Date('2025-11-01'),
      eventType: 'FOLLOW_UP_365D',
      title: '365-Day Longitudinal Job Retention Verified',
      description: 'Trainee completed 1 full year of continuous employment in direct alignment with training.',
      source: 'EMPLOYER_VERIFICATION',
      verificationStatus: 'VERIFIED',
      confidence: 0.99,
    },
  ];

  await OutcomeTimeline.insertMany(aaravMilestones);

  // Primary Employment Outcome for Aarav
  await EmploymentOutcome.create({
    traineeId: primaryTraineeUser._id,
    institutionId: primaryInst._id,
    program: 'MSSDS Advanced Web Engineering',
    district: 'Pune',
    state: 'Maharashtra',
    status: 'EMPLOYED',
    employerName: 'Tata Consultancy Services',
    employerContact: 'campus.hiring@tcs.com',
    employerId: userMap['employer@skillsense.demo']._id,
    jobRole: 'Associate Software Engineer',
    industryDomain: 'Information Technology',
    employmentType: 'full_time',
    startDate: new Date('2024-11-01'),
    initialSalary: 28000,
    currentSalary: 32000,
    salaryHistory: [
      { date: new Date('2024-11-01'), amount: 28000, source: 'EMPLOYER_VERIFICATION', verified: true, role: 'Associate Software Engineer' },
      { date: new Date('2025-05-10'), amount: 32000, source: 'EMPLOYER_VERIFICATION', verified: true, role: 'Software Engineer' },
    ],
    trainingRelevance: 'HIGHLY_RELEVANT',
    retentionDays: 480,
    retained30d: true,
    retained90d: true,
    retained180d: true,
    retained365d: true,
    verificationStatus: 'VERIFIED',
    verificationSource: 'EMPLOYER_VERIFICATION',
    confidenceScore: 0.98,
    verifiedBy: userMap['employer@skillsense.demo']._id,
    verifiedAt: new Date('2024-11-05'),
  });

  // Schedule Follow-Ups for Aarav
  const intervals = [30, 60, 90, 180, 365];
  for (const days of intervals) {
    const due = new Date('2024-11-01');
    due.setDate(due.getDate() + days);
    await FollowUp.create({
      traineeId: primaryTraineeUser._id,
      institutionId: primaryInst._id,
      scheduleDays: days,
      dueDate: due,
      status: 'COMPLETED',
      responseDate: due,
      responses: {
        isEmployed: true,
        employmentType: 'full_time',
        employerName: 'Tata Consultancy Services',
        jobRole: 'Associate Software Engineer',
        currentSalary: days >= 180 ? 32000 : 28000,
        trainingRelevance: 'HIGHLY_RELEVANT',
        feedback: 'Training curriculum covered modern full-stack requirements accurately.',
      },
    });
  }

  // 4. Generate 120 Realistic Longitudinal Trainees Across Maharashtra Districts
  let globalStudentCount = 0;
  const hashedPass = await bcrypt.hash('Demo@1234', 12);

  for (const dist of DISTRICTS) {
    for (let i = 1; i <= dist.count; i++) {
      globalStudentCount++;
      const firstName = FIRST_NAMES[globalStudentCount % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(globalStudentCount + i) % LAST_NAMES.length];
      const fullName = `${firstName} ${lastName}`;
      const email = `trainee_${dist.name.toLowerCase().replace(/\s+/g, '_')}_${i}@skillsense.demo`;
      const prog = PROGRAMMES[globalStudentCount % PROGRAMMES.length];
      const enrollmentNo = `MH-${dist.name.slice(0, 3).toUpperCase()}-2024-${String(100 + i).padStart(4, '0')}`;

      // Random outcome decision based on district employment rate
      const rand = Math.random();
      const isPlaced = rand < dist.empRate;
      let status = 'SEEKING';
      let selfEmployed = false;
      let apprenticeship = false;

      if (isPlaced) {
        if (rand < dist.empRate * 0.15) {
          status = 'SELF_EMPLOYED';
          selfEmployed = true;
        } else if (rand < dist.empRate * 0.3) {
          status = 'APPRENTICESHIP';
          apprenticeship = true;
        } else {
          status = 'EMPLOYED';
        }
      }

      // Create User
      const user = await User.create({
        name: fullName,
        email,
        password: hashedPass,
        role: 'student',
        location: dist.name,
        isVerified: true,
        isActive: true,
        authProvider: 'local',
        skills: ['Technical Competency', 'Problem Solving', 'Communication'],
      });

      // Create Student Record
      const initialSalary = Math.round(dist.avgSalary * (0.85 + Math.random() * 0.3));
      const currentSalary = isPlaced ? Math.round(initialSalary * (1.1 + Math.random() * 0.25)) : undefined;

      const student = await Student.create({
        userId: user._id,
        institutionId: primaryInst._id,
        enrollmentNumber: enrollmentNo,
        program: prog.name,
        nsqfLevel: prog.nsqf,
        batch: '2024-2025',
        state: 'Maharashtra',
        gender: i % 3 === 0 ? 'female' : 'male',
        skills: [
          { score: Math.round(70 + Math.random() * 25), lastAssessed: new Date('2024-09-20') },
          { score: Math.round(65 + Math.random() * 30), lastAssessed: new Date('2024-09-20') },
        ],
        placementStatus: isPlaced ? 'placed' : 'seeking',
        placedAt: isPlaced ? new Date('2024-11-15') : undefined,
        placedRole: isPlaced ? (selfEmployed ? 'Entrepreneur / Freelancer' : apprenticeship ? 'Industrial Apprentice' : 'Junior Technical Associate') : undefined,
        salary: currentSalary ? currentSalary * 12 : undefined,
        passportHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      });

      // Consent
      await Consent.create({
        userId: user._id,
        status: 'GRANTED',
        purposes: ['outcome_tracking', 'employer_verification', 'longitudinal_followup'],
      });

      const enrollDate = new Date('2024-06-10');
      const certDate = new Date('2024-09-25');
      const placeDate = new Date('2024-11-15');

      // Timeline milestones
      const milestones: any[] = [
        {
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          date: enrollDate,
          eventType: 'ENROLLED',
          title: 'Enrolled in ' + prog.name,
          description: `Admitted under state skilling cohort in ${dist.name}.`,
          source: 'TRAINING_PROVIDER',
          verificationStatus: 'VERIFIED',
          confidence: 1.0,
        },
        {
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          date: certDate,
          eventType: 'CERTIFIED',
          title: 'NSQF Level ' + prog.nsqf + ' Certified',
          description: 'Passed state proctored evaluation and issued verifiable credential.',
          source: 'TRAINING_PROVIDER',
          verificationStatus: 'VERIFIED',
          confidence: 1.0,
        },
      ];


      if (isPlaced) {
        const empName = EMPLOYERS[globalStudentCount % EMPLOYERS.length];
        const role = selfEmployed ? 'Founder / Consultant' : apprenticeship ? 'Trade Apprentice' : 'Technical Associate';
        const isVerifiedEmployer = i % 4 !== 0; // 75% verified

        milestones.push({
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          date: placeDate,
          eventType: selfEmployed ? 'SELF_EMPLOYED' : apprenticeship ? 'APPRENTICESHIP' : 'EMPLOYED',
          title: selfEmployed ? 'Self-Employment Registered' : apprenticeship ? 'Apprenticeship Commenced' : 'Employed at ' + empName,
          description: `Placement confirmed with initial monthly compensation of ₹${initialSalary.toLocaleString('en-IN')}.`,
          source: isVerifiedEmployer ? 'EMPLOYER_VERIFICATION' : 'TRAINEE_SELF_REPORT',
          verificationStatus: isVerifiedEmployer ? 'VERIFIED' : 'SELF_REPORTED',
          confidence: isVerifiedEmployer ? 0.96 : 0.70,
        });

        // Retention milestones
        const isRetained90 = Math.random() > 0.15;
        const isRetained180 = isRetained90 && Math.random() > 0.15;
        const isRetained365 = isRetained180 && Math.random() > 0.2;

        await EmploymentOutcome.create({
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          status,
          employerName: selfEmployed ? 'Independent Enterprise' : empName,
          jobRole: role,
          industryDomain: prog.domain,
          employmentType: 'full_time',
          startDate: placeDate,
          initialSalary,
          currentSalary,
          salaryHistory: [
            { date: placeDate, amount: initialSalary, source: 'TRAINEE_SELF_REPORT', verified: isVerifiedEmployer, role },
            { date: new Date('2025-06-01'), amount: currentSalary || initialSalary, source: 'EMPLOYER_VERIFICATION', verified: isVerifiedEmployer, role },
          ],
          trainingRelevance: i % 5 === 0 ? 'PARTIALLY_RELEVANT' : 'HIGHLY_RELEVANT',
          retentionDays: isRetained365 ? 400 : isRetained180 ? 200 : isRetained90 ? 100 : 45,
          retained30d: true,
          retained90d: isRetained90,
          retained180d: isRetained180,
          retained365d: isRetained365,
          verificationStatus: isVerifiedEmployer ? 'VERIFIED' : 'SELF_REPORTED',
          verificationSource: isVerifiedEmployer ? 'EMPLOYER_VERIFICATION' : 'TRAINEE_SELF_REPORT',
          confidenceScore: isVerifiedEmployer ? 0.95 : 0.70,
          verifiedBy: isVerifiedEmployer ? userMap['employer@skillsense.demo']._id : undefined,
          verifiedAt: isVerifiedEmployer ? new Date('2024-11-20') : undefined,
        });

        // Follow up schedule
        await FollowUp.create({
          traineeId: user._id,
          institutionId: primaryInst._id,
          scheduleDays: 90,
          dueDate: new Date('2025-02-15'),
          status: isRetained90 ? 'COMPLETED' : 'OVERDUE',
          responseDate: isRetained90 ? new Date('2025-02-15') : undefined,
          responses: isRetained90 ? {
            isEmployed: true,
            employmentType: 'full_time',
            employerName: empName,
            currentSalary,
            trainingRelevance: 'HIGHLY_RELEVANT',
          } : undefined,
        });
      } else {
        // Non-placed reasons
        const reasons = ['SKILL_GAP', 'COMMUNICATION', 'LOCATION', 'TRANSPORT', 'SALARY_EXPECTATION'];
        const reason = reasons[i % reasons.length] as any;

        milestones.push({
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          date: placeDate,
          eventType: 'FOLLOW_UP_30D',
          title: 'Active Placement Seeking',
          description: `Candidate seeking placement. Barrier identified: ${reason.replace(/_/g, ' ')}.`,
          source: 'FOLLOW_UP',
          verificationStatus: 'SELF_REPORTED',
          confidence: 0.75,
        });

        await EmploymentOutcome.create({
          traineeId: user._id,
          institutionId: primaryInst._id,
          program: prog.name,
          district: dist.name,
          state: 'Maharashtra',
          status: 'SEEKING',
          nonPlacementReason: reason,
          trainingRelevance: 'UNKNOWN',
          retentionDays: 0,
          retained30d: false,
          retained90d: false,
          retained180d: false,
          retained365d: false,
          verificationStatus: 'SELF_REPORTED',
          confidenceScore: 0.65,
        });
      }

      await OutcomeTimeline.insertMany(milestones);
    }
  }

  // 5. Create AI Policy Interventions
  await PolicyIntervention.create([
    {
      title: 'Targeted Communication & Mock Interview Integration',
      targetType: 'PROGRAMME',
      targetName: 'MSSDS Advanced Web Engineering',
      observation: 'Technical assessment pass rate is 86% across Pune and Mumbai, but non-placement feedback shows a 24% failure rate in technical interview communication.',
      evidence: {
        metric: 'Interview Clearing Rate',
        value: '58%',
        baseline: '78%',
        sampleSize: 48,
      },
      confidence: 0.92,
      reasoning: 'Candidates demonstrate high coding aptitude in proctored labs but hesitate during English-medium technical panel discussions.',
      recommendedAction: 'Incorporate 20 hours of mandatory technical communication and live interview simulations before campus placement drives.',
      impactPotential: 'HIGH',
      status: 'ACTIVE',
    },
    {
      title: 'Regional Industry Apprenticeship Cluster in Chhatrapati Sambhaji Nagar',
      targetType: 'DISTRICT',
      targetName: 'Chhatrapati Sambhaji Nagar',
      observation: 'High certification rate (84%) with 35% non-placement attributed to reluctance for Pune/Mumbai relocation.',
      evidence: {
        metric: 'Local Employment Retention',
        value: '46%',
        baseline: '68%',
        sampleSize: 36,
      },
      confidence: 0.89,
      reasoning: 'Trainees face accommodation and transportation constraints when relocating to tier-1 cities.',
      recommendedAction: 'Form direct MoUs with local manufacturing and auto-component enterprises in Waluj and Shendra MIDC for on-site apprenticeships.',
      impactPotential: 'HIGH',
      status: 'ACTIVE',
    },
    {
      title: 'Solar PV Micro-Grid Modernization & Battery Storage Curriculum',
      targetType: 'PROGRAMME',
      targetName: 'Solar PV Installation & Grid Tech',
      observation: 'Wage progression for solar technicians in Solapur and Kolhapur is currently lagging behind state industrial averages.',
      evidence: {
        metric: '12-Month Wage Growth',
        value: '+14%',
        baseline: '+32%',
        sampleSize: 22,
      },
      confidence: 0.87,
      reasoning: 'Technicians trained purely on rooftop mounting miss out on higher-paying solar battery storage and grid-tied inverter maintenance roles.',
      recommendedAction: 'Upgrade syllabus with 30 hours of hybrid inverter troubleshooting, battery energy storage systems (BESS), and SCADA monitoring.',
      impactPotential: 'HIGH',
      status: 'ACTIVE',
    },
  ]);

  console.log(`\n🎉 Seed Completed Successfully!`);
  console.log(` Created ${globalStudentCount + 1} longitudinal trainee outcome records across 9 Maharashtra districts.`);
  console.log(` Generated macro skilling funnel, retention curves, follow-ups, and evidence-grounded AI policy interventions.`);
  console.log('\nDemo Logins for SIH 2026 Evaluation:');
  DEMO_USERS.forEach((u) => {
    console.log(`  ${u.role.toUpperCase().padEnd(12)} -> ${u.email.padEnd(30)} / ${u.password}`);
  });

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed script error:', err);
  process.exit(1);
});
