// backend/src/scripts/seedCompleteDatabase.ts
// Run: npx ts-node -r tsconfig-paths/register src/scripts/seedCompleteDatabase.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEMO_PERSONAS = [
  {
    name: 'Trikam Devasi (Admin)',
    email: 'admin@ryyvora.demo',
    password: 'Demo@1234',
    role: 'admin',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
  {
    name: 'Aarav Sharma (Student)',
    email: 'student@ryyvora.demo',
    password: 'Demo@1234',
    role: 'student',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
  {
    name: 'Vikram Malhotra (Employer)',
    email: 'employer@ryyvora.demo',
    password: 'Demo@1234',
    role: 'employer',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
  {
    name: 'Dr. Sunita Deshmukh (Institute Director)',
    email: 'institute@ryyvora.demo',
    password: 'Demo@1234',
    role: 'institute',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
  {
    name: 'Rajesh Patil (Govt Directorate of Technical Education)',
    email: 'government@ryyvora.demo',
    password: 'Demo@1234',
    role: 'government',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
  {
    name: 'Neha Kapoor (Industry Council Lead)',
    email: 'industry@ryyvora.demo',
    password: 'Demo@1234',
    role: 'industry',
    isVerified: true,
    isActive: true,
    authProvider: 'local',
  },
];

const CANONICAL_SKILLS = [
  {
    name: 'Full-Stack Web Architecture',
    category: 'Software Engineering',
    domain: 'Computer Science & Engineering',
    nsqfLevel: 6,
    description: 'Modern full-stack system architecture using Next.js 16, TypeScript, Node.js, and distributed microservices.',
    industryDemandScore: 96,
    demandTrend: [
      { month: 'Oct 2025', score: 91 },
      { month: 'Nov 2025', score: 93 },
      { month: 'Dec 2025', score: 94 },
      { month: 'Jan 2026', score: 95 },
      { month: 'Feb 2026', score: 96 },
      { month: 'Mar 2026', score: 97 },
    ],
  },
  {
    name: 'Applied LLM Engineering & RAG',
    category: 'Artificial Intelligence',
    domain: 'Artificial Intelligence & Data Science',
    nsqfLevel: 7,
    description: 'Retrieval-augmented generation pipelines, vector embeddings, fine-tuning, and LLM inference optimization.',
    industryDemandScore: 98,
    demandTrend: [
      { month: 'Oct 2025', score: 88 },
      { month: 'Nov 2025', score: 91 },
      { month: 'Dec 2025', score: 94 },
      { month: 'Jan 2026', score: 96 },
      { month: 'Feb 2026', score: 98 },
      { month: 'Mar 2026', score: 99 },
    ],
  },
  {
    name: 'Cloud Native DevOps & Kubernetes',
    category: 'Cloud & Infrastructure',
    domain: 'Information Technology',
    nsqfLevel: 6,
    description: 'Container orchestration, CI/CD pipelines, GitOps with ArgoCD, Terraform, and cloud reliability engineering.',
    industryDemandScore: 92,
    demandTrend: [
      { month: 'Oct 2025', score: 89 },
      { month: 'Nov 2025', score: 90 },
      { month: 'Dec 2025', score: 91 },
      { month: 'Jan 2026', score: 92 },
      { month: 'Feb 2026', score: 93 },
      { month: 'Mar 2026', score: 94 },
    ],
  },
  {
    name: 'Distributed Database Systems',
    category: 'Data Engineering',
    domain: 'Computer Science & Engineering',
    nsqfLevel: 6,
    description: 'PostgreSQL partitioning, Redis clustering, MongoDB replica sets, sharding, and high-throughput write optimizations.',
    industryDemandScore: 89,
    demandTrend: [
      { month: 'Oct 2025', score: 85 },
      { month: 'Nov 2025', score: 87 },
      { month: 'Dec 2025', score: 88 },
      { month: 'Jan 2026', score: 89 },
      { month: 'Feb 2026', score: 90 },
      { month: 'Mar 2026', score: 91 },
    ],
  },
  {
    name: 'Cybersecurity & Zero Trust Architecture',
    category: 'Security',
    domain: 'Information Technology',
    nsqfLevel: 7,
    description: 'Identity access management, cryptographic token protocols, OWASP mitigation, and network microsegmentation.',
    industryDemandScore: 94,
    demandTrend: [
      { month: 'Oct 2025', score: 90 },
      { month: 'Nov 2025', score: 91 },
      { month: 'Dec 2025', score: 93 },
      { month: 'Jan 2026', score: 94 },
      { month: 'Feb 2026', score: 95 },
      { month: 'Mar 2026', score: 96 },
    ],
  },
  {
    name: 'Embedded Systems & IoT Firmware',
    category: 'Hardware & IoT',
    domain: 'Electronics & Communication',
    nsqfLevel: 5,
    description: 'Real-time operating systems (FreeRTOS), ESP32/ARM Cortex programming, MQTT protocols, and hardware debugging.',
    industryDemandScore: 84,
    demandTrend: [
      { month: 'Oct 2025', score: 81 },
      { month: 'Nov 2025', score: 82 },
      { month: 'Dec 2025', score: 83 },
      { month: 'Jan 2026', score: 84 },
      { month: 'Feb 2026', score: 85 },
      { month: 'Mar 2026', score: 86 },
    ],
  },
  {
    name: 'Computer Vision & Edge Inferencing',
    category: 'Artificial Intelligence',
    domain: 'Artificial Intelligence & Data Science',
    nsqfLevel: 6,
    description: 'YOLO object detection, OpenCV, TensorRT model quantisation, and edge deployment on Jetson/Raspberry Pi.',
    industryDemandScore: 91,
    demandTrend: [
      { month: 'Oct 2025', score: 86 },
      { month: 'Nov 2025', score: 88 },
      { month: 'Dec 2025', score: 89 },
      { month: 'Jan 2026', score: 91 },
      { month: 'Feb 2026', score: 92 },
      { month: 'Mar 2026', score: 93 },
    ],
  },
  {
    name: 'Industrial Robotics & PLC Automation',
    category: 'Manufacturing',
    domain: 'Mechanical Engineering',
    nsqfLevel: 5,
    description: 'PLC ladder logic programming, SCADA systems, industrial robot kinematics, and smart factory digital twins.',
    industryDemandScore: 86,
    demandTrend: [
      { month: 'Oct 2025', score: 82 },
      { month: 'Nov 2025', score: 83 },
      { month: 'Dec 2025', score: 85 },
      { month: 'Jan 2026', score: 86 },
      { month: 'Feb 2026', score: 87 },
      { month: 'Mar 2026', score: 88 },
    ],
  },
  {
    name: 'EV Powertrain & Battery Management Systems',
    category: 'Automotive & Energy',
    domain: 'Electrical & Electronics',
    nsqfLevel: 6,
    description: 'Lithium-ion thermal runaway mitigation, state-of-charge algorithms, CAN bus telemetry, and motor control inverters.',
    industryDemandScore: 95,
    demandTrend: [
      { month: 'Oct 2025', score: 88 },
      { month: 'Nov 2025', score: 90 },
      { month: 'Dec 2025', score: 93 },
      { month: 'Jan 2026', score: 95 },
      { month: 'Feb 2026', score: 96 },
      { month: 'Mar 2026', score: 97 },
    ],
  },
];

const SEED_JOBS = [
  {
    title: 'Full-Stack Systems Engineer',
    company: 'TechCorp Digital Maharashtra',
    location: 'Pune, MH (Hybrid)',
    domain: 'CSE',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    salaryRange: '₹8.5 – ₹14.0 LPA',
    nsqfMinLevel: 6,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Architect and scale high-throughput digital services using modern TypeScript, Next.js, and microservices.',
    isActive: true,
    applyUrl: 'https://ryyvora.demo/careers/cse-fullstack',
    isHiringDrive: false,
  },
  {
    title: 'Applied AI & Generative Systems Engineer',
    company: 'FinTech Intelligence Labs',
    location: 'Mumbai, MH (On-site)',
    domain: 'AI/DS',
    requiredSkills: ['Python', 'PyTorch', 'LangChain', 'Vector DB', 'FastAPI'],
    salaryRange: '₹10.0 – ₹18.0 LPA',
    nsqfMinLevel: 7,
    experience: 'Fresher / 0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Build low-latency LLM inference pipelines, enterprise RAG workflows, and algorithmic risk copilots.',
    isActive: true,
    applyUrl: 'https://ryyvora.demo/careers/applied-ai',
    isHiringDrive: false,
  },
  {
    title: 'Cloud DevOps & Site Reliability Engineer',
    company: 'CloudScale Maharashtra',
    location: 'Nagpur, MH (Remote)',
    domain: 'IT',
    requiredSkills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Prometheus'],
    salaryRange: '₹7.5 – ₹12.5 LPA',
    nsqfMinLevel: 6,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Ensure 99.99% uptime of government digital infrastructure and automate distributed cluster deployments.',
    isActive: true,
    applyUrl: 'https://ryyvora.demo/careers/cloud-devops',
    isHiringDrive: false,
  },
  {
    title: 'Embedded Firmware & IoT Systems Engineer',
    company: 'Apex Smart Hardware',
    location: 'Nashik, MH (On-site)',
    domain: 'ECE',
    requiredSkills: ['Embedded C', 'FreeRTOS', 'ESP32', 'CAN Bus', 'MQTT'],
    salaryRange: '₹6.5 – ₹10.0 LPA',
    nsqfMinLevel: 5,
    experience: '0-1 Years',
    employmentType: 'Full-time' as const,
    description: 'Develop low-power telemetry sensor firmware for industrial IoT and smart grid monitoring.',
    isActive: true,
    applyUrl: 'https://ryyvora.demo/careers/embedded-firmware',
    isHiringDrive: false,
  },
  {
    title: '2026 Full-Stack & Next.js Graduate Hiring Drive',
    company: 'Maharashtra IT Consortium',
    location: 'Pune, MH / Multiple Centers',
    domain: 'CSE',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    salaryRange: '₹7.5 – ₹11.0 LPA',
    nsqfMinLevel: 5,
    experience: '2026 Batch Graduates',
    employmentType: 'Full-time' as const,
    description: 'Mass recruitment drive for 2026 engineering graduates with verified NSQF Level 5+ Skill Passports.',
    isActive: true,
    applyUrl: '#',
    isHiringDrive: true,
    openings: 25,
    applicantsCount: 78,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Applied Generative AI & Python Apprenticeship Drive',
    company: 'Quantum Neural Systems',
    location: 'Mumbai & Pune (Hybrid)',
    domain: 'AI/DS',
    requiredSkills: ['Python', 'PyTorch', 'Vector Embeddings', 'FastAPI'],
    salaryRange: '₹9.0 – ₹14.0 LPA',
    nsqfMinLevel: 6,
    experience: '0-1 Years',
    employmentType: 'Apprenticeship' as const,
    description: 'Fast-track industry apprenticeship program with PPO transition opportunities for high performers.',
    isActive: true,
    applyUrl: '#',
    isHiringDrive: true,
    openings: 15,
    applicantsCount: 52,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
];

async function seedCompleteDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const User = (await import('../models/User.model')).default;
  const Student = (await import('../models/Student.model')).default;
  const Skill = (await import('../models/Skill.model')).default;
  const Question = (await import('../models/Question.model')).default;
  const Job = (await import('../models/Job.model')).default;
  const Notification = (await import('../models/Notification.model')).default;
  const { QUESTION_BANK } = await import('../config/questions.bank');

  // ── 1. Seed Demo Persona Users ─────────────────────────────────────────────
  console.log('\n--- 1. Seeding Demo Persona Accounts ---');
  const userMap: Record<string, any> = {};

  for (const persona of DEMO_PERSONAS) {
    let user = await User.findOne({ email: persona.email });

    if (user) {
      user.password = persona.password;
      user.name = persona.name;
      user.role = persona.role as any;
      user.isActive = true;
      user.isVerified = true;
      user.authProvider = 'local';
      await user.save();
      console.log(`🔄 Updated user: ${persona.email} (${persona.role})`);
    } else {
      user = await User.create({
        ...persona,
      });
      console.log(`✅ Created user: ${persona.email} (${persona.role})`);
    }
    userMap[persona.role] = user;
  }

  // Also ensure backwards compatibility for skillsense demo users
  const legacyAliases = [
    { email: 'admin@skillsense.demo', role: 'admin' },
    { email: 'student@skillsense.demo', role: 'student' },
    { email: 'instructor@skillsense.demo', role: 'institute' },
  ];
  for (const alias of legacyAliases) {
    const hashed = await bcrypt.hash('Demo@1234', 12);
    await User.findOneAndUpdate(
      { email: alias.email },
      {
        email: alias.email,
        name: `Demo ${alias.role.toUpperCase()}`,
        password: hashed,
        role: alias.role,
        isActive: true,
        isVerified: true,
      },
      { upsert: true }
    );
  }

  // ── 2. Seed Skills ─────────────────────────────────────────────────────────
  console.log('\n--- 2. Seeding Canonical Skills ---');
  const skillDocs: Record<string, any> = {};
  for (const s of CANONICAL_SKILLS) {
    const skill = await Skill.findOneAndUpdate(
      { name: s.name },
      {
        name: s.name,
        category: s.category,
        domain: s.domain,
        nsqfLevel: s.nsqfLevel,
        description: s.description,
        industryDemandScore: s.industryDemandScore,
        demandTrend: s.demandTrend,
      },
      { upsert: true, new: true }
    );
    skillDocs[s.name] = skill;
  }
  console.log(`✅ Seeded ${CANONICAL_SKILLS.length} canonical industry skills`);

  // ── 3. Seed Authoritative Questions into MongoDB ───────────────────────────
  console.log('\n--- 3. Seeding Authoritative Questions into MongoDB ---');
  const defaultSkill = Object.values(skillDocs)[0];
  let questionsCreated = 0;

  for (const q of QUESTION_BANK) {
    const existing = await Question.findOne({ text: q.question });
    if (!existing) {
      await Question.create({
        text: q.question,
        domain: q.domain,
        nsqfLevel: 6,
        correctAnswer: q.options[q.correct],
        options: q.options,
        difficulty: 3,
        skillId: defaultSkill?._id,
      });
      questionsCreated++;
    }
  }
  const totalQuestionsInDb = await Question.countDocuments();
  console.log(`✅ Questions in DB: ${totalQuestionsInDb} (added: ${questionsCreated})`);

  // ── 4. Seed Verified Student Profile for Student Demo ───────────────────────
  console.log('\n--- 4. Seeding Student Profile ---');
  const studentUser = userMap['student'];
  if (studentUser) {
    const defaultStudentSkills = Object.values(skillDocs).slice(0, 5).map((sk: any) => ({
      skillId: sk._id,
      skill: sk.name,
      competencyLevel: 4,
      verified: true,
      lastAssessed: new Date(),
    }));

    await Student.findOneAndUpdate(
      { userId: studentUser._id },
      {
        userId: studentUser._id,
        enrollmentNumber: 'MH-2026-ENG-8492',
        institution: 'Government College of Engineering Pune (COEP)',
        program: 'B.Tech Computer Science & Engineering',
        nsqfLevel: 6,
        overallScore: 88,
        skills: defaultStudentSkills,
        placementStatus: 'placed',
        state: 'Maharashtra',
        district: 'Pune',
        passportHash: `0x7a8f9b...${String(studentUser._id).slice(-4)}_HMAC_SHA256_VERIFIED`,
        competencyBreakdown: {
          coreEngineering: 90,
          systemDesign: 86,
          problemSolving: 92,
          practicalLab: 85,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Verified Student profile configured for ${studentUser.email}`);
  }

  // ── 5. Seed Jobs & Hiring Drives ───────────────────────────────────────────
  console.log('\n--- 5. Seeding Real Jobs & Hiring Drives ---');
  const employerUser = userMap['employer'];
  for (const job of SEED_JOBS) {
    await Job.findOneAndUpdate(
      { title: job.title, company: job.company },
      {
        ...job,
        employerId: employerUser?._id,
      },
      { upsert: true, new: true }
    );
  }
  const totalJobsInDb = await Job.countDocuments();
  console.log(`✅ Total active jobs/drives in DB: ${totalJobsInDb}`);

  // ── 6. Seed User Notifications ────────────────────────────────────────────
  console.log('\n--- 6. Seeding User Notifications ---');
  if (studentUser) {
    const studentNotifs = [
      {
        userId: studentUser._id,
        title: 'Skill Passport Cryptographically Verified',
        description: 'Your NSQF Level 6 Skill Passport has been signed and recorded with HMAC-SHA256 verification.',
        type: 'passport',
        href: '/student/passport',
        unread: true,
      },
      {
        userId: studentUser._id,
        title: 'New High-Match Job Available',
        description: 'TechCorp Digital Maharashtra matched your profile with a 94% compatibility score.',
        type: 'job',
        href: '/student/jobs',
        unread: true,
      },
      {
        userId: studentUser._id,
        title: 'AI Diagnostic Assessment Ready',
        description: 'New 20-question comprehensive evaluation available for Computer Science & Engineering.',
        type: 'ai',
        href: '/exam',
        unread: false,
      },
    ];

    for (const n of studentNotifs) {
      await Notification.findOneAndUpdate(
        { userId: n.userId, title: n.title },
        n,
        { upsert: true }
      );
    }
  }

  if (employerUser) {
    const employerNotifs = [
      {
        userId: employerUser._id,
        title: '3 New Verified Candidates Matched',
        description: 'Candidates with verified NSQF Level 6 Passports matched your Full-Stack hiring requisition.',
        type: 'job',
        href: '/employer',
        unread: true,
      },
      {
        userId: employerUser._id,
        title: 'Placement Hiring Drive Active',
        description: '2026 Full-Stack & Next.js Graduate Hiring Drive is now receiving verified applicants.',
        type: 'compliance',
        href: '/employer/placements',
        unread: false,
      },
    ];

    for (const n of employerNotifs) {
      await Notification.findOneAndUpdate(
        { userId: n.userId, title: n.title },
        n,
        { upsert: true }
      );
    }
  }

  const totalNotifs = await Notification.countDocuments();
  console.log(`✅ Total Notifications in DB: ${totalNotifs}`);

  console.log('\n🎉 COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY!');
  console.log('\nAvailable Logins:');
  console.log('Role'.padEnd(14) + 'Email'.padEnd(30) + 'Password');
  console.log('-'.repeat(60));
  for (const p of DEMO_PERSONAS) {
    console.log(p.role.padEnd(14) + p.email.padEnd(30) + p.password);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB.');
}

seedCompleteDatabase().catch((err) => {
  console.error('❌ Master seed failed:', err);
  process.exit(1);
});
