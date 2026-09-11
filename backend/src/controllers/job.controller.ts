// backend/src/controllers/job.controller.ts
import { Request, Response, NextFunction } from 'express';
import Job, { IJob } from '../models/Job.model';
import Student from '../models/Student.model';
import Subscription from '../models/Subscription.model';
import { getPlan, PlanId } from '../config/plans';
import { buildApiResponse } from '../utils/pagination.utils';
import logger from '../utils/logger';

const SEED_JOBS = [
  {
    title: 'Full-Stack Cloud Engineer',
    company: 'Tata Consultancy Services',
    location: 'Pune, Maharashtra',
    domain: 'CSE',
    requiredSkills: ['React', 'Node.js', 'Docker', 'PostgreSQL', 'TypeScript'],
    salaryRange: '₹8,50,000 - ₹13,00,000 / yr',
    nsqfMinLevel: 6,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Design and deploy scalable enterprise cloud applications with verified microservice architectures.',
    isActive: true,
  },
  {
    title: 'DevOps & Infrastructure Associate',
    company: 'Infosys Enterprise Cloud',
    location: 'Mumbai, Maharashtra',
    domain: 'IT',
    requiredSkills: ['Kubernetes', 'AWS', 'Linux Administration', 'CI/CD', 'Docker'],
    salaryRange: '₹7,50,000 - ₹11,50,000 / yr',
    nsqfMinLevel: 6,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Automate deployment pipelines and manage multi-region cluster reliability for financial clients.',
    isActive: true,
  },
  {
    title: 'Junior Machine Learning Engineer',
    company: 'Reliance Jio AI Platforms',
    location: 'Navi Mumbai, Maharashtra',
    domain: 'AI/DS',
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Vector Databases', 'SQL'],
    salaryRange: '₹9,00,000 - ₹14,00,000 / yr',
    nsqfMinLevel: 6,
    experience: 'Fresher to 1 Year',
    employmentType: 'Full-time' as const,
    description: 'Train retrieval-augmented generation pipelines and fine-tune domain-specific language models.',
    isActive: true,
  },
  {
    title: 'Embedded Firmware Engineer',
    company: 'Bharat Electronics Limited (BEL)',
    location: 'Pune, Maharashtra',
    domain: 'ECE',
    requiredSkills: ['Embedded C', 'RTOS', 'ARM Cortex', 'IoT Protocols'],
    salaryRange: '₹7,00,000 - ₹10,50,000 / yr',
    nsqfMinLevel: 6,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Develop low-latency firmware for defense and industrial communications hardware.',
    isActive: true,
  },
  {
    title: 'EV Powertrain Controls Specialist',
    company: 'Mahindra Electric Mobility',
    location: 'Chakan, Pune',
    domain: 'EEE',
    requiredSkills: ['Power Electronics', 'MATLAB Simulink', 'Control Systems', 'EV Powertrain'],
    salaryRange: '₹8,00,000 - ₹12,00,000 / yr',
    nsqfMinLevel: 6,
    experience: '1-3 Years',
    employmentType: 'Full-time' as const,
    description: 'Model and calibrate battery management systems and inverter drive controllers.',
    isActive: true,
  },
  {
    title: 'Robotics & Automation Engineer',
    company: 'Bajaj Auto Technology Center',
    location: 'Akurdi, Pune',
    domain: 'MECH',
    requiredSkills: ['SolidWorks', 'Robotics Automation', 'PLC/SCADA', 'ANSYS FEA'],
    salaryRange: '₹6,50,000 - ₹10,00,000 / yr',
    nsqfMinLevel: 5,
    experience: '0-2 Years',
    employmentType: 'Full-time' as const,
    description: 'Optimize robotic assembly cells and conduct structural simulations for vehicular frames.',
    isActive: true,
  },
];

async function ensureSeedJobs(): Promise<void> {
  const count = await Job.countDocuments();
  if (count === 0) {
    await Job.insertMany(SEED_JOBS);
    logger.info('Seeded canonical engineering jobs into database');
  }
}

export const getJobMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await ensureSeedJobs();

    const user = req.user as any;
    const userId = user?._id || user?.id;
    const userRole = user?.role || 'student';

    // Check subscription plan
    let planId: PlanId = 'free';
    if (userId) {
      const sub = await Subscription.findOne({ userId });
      if (sub && sub.status === 'active') {
        planId = sub.plan as PlanId;
      }
    }

    // Support query param ?forceTier=free / ?forceTier=starter for hackathon demo testing
    const requestedTier = req.query.forceTier as string;
    if (requestedTier && ['free', 'starter', 'growth', 'enterprise'].includes(requestedTier)) {
      planId = requestedTier as PlanId;
    }

    const planLimits = getPlan(planId).limits;

    // Check entitlement: If plan is free and not bypassed via query/role
    const isLocked = !planLimits.jobMatches && planId === 'free' && req.query.preview !== 'true';

    // If locked, return locked screen payload
    if (isLocked) {
      const samplePreview = await Job.find({ isActive: true }).limit(3).select('title company location domain salaryRange');
      res.status(200).json(
        buildApiResponse(
          {
            locked: true,
            currentTier: planId,
            requiredTier: 'starter',
            message: 'Direct AI-Ranked Job Matches are available exclusively on Starter, Growth, and Enterprise plans.',
            previewJobs: samplePreview,
          },
          'Job matching engine is locked on your current plan'
        )
      );
      return;
    }

    // Unlocked: Get student verified skills
    let userSkillNames: string[] = [];
    let overallScore = 75;

    if (userId) {
      const student = await Student.findOne({ userId });
      if (student) {
        overallScore = student.overallScore || 75;
        userSkillNames = (student.skills || [])
          .map((s: any) => (typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : s.skill || s.skillId))
          .filter(Boolean)
          .map((s: string) => s.toLowerCase());
      }
    }

    // Fetch active jobs from DB
    const domainFilter = req.query.domain as string;
    const query: any = { isActive: true };
    if (domainFilter && domainFilter !== 'ALL') {
      query.domain = domainFilter.toUpperCase();
    }

    const dbJobs = await Job.find(query).sort({ createdAt: -1 });

    // Compute AI match score for each job
    const rankedJobs = dbJobs.map((job) => {
      const reqSkills = job.requiredSkills || [];
      const matched = reqSkills.filter((reqSkill) =>
        userSkillNames.some((uSkill) => uSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(uSkill))
      );
      const missing = reqSkills.filter((reqSkill) => !matched.includes(reqSkill));

      let baseScore = reqSkills.length > 0 ? Math.round((matched.length / reqSkills.length) * 80) : 60;
      // Factor in overall verified competency score
      const competencyBonus = Math.round((overallScore / 100) * 20);
      const finalScore = Math.min(98, Math.max(35, baseScore + competencyBonus));

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        domain: job.domain,
        salaryRange: job.salaryRange,
        nsqfMinLevel: job.nsqfMinLevel,
        experience: job.experience,
        employmentType: job.employmentType,
        description: job.description,
        requiredSkills: reqSkills,
        matchedSkills: matched,
        missingSkills: missing,
        matchScore: finalScore,
        applyUrl: job.applyUrl || '#',
      };
    });

    // Sort by match score descending
    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(
      buildApiResponse(
        {
          locked: false,
          currentTier: planId,
          totalJobs: rankedJobs.length,
          jobs: rankedJobs,
        },
        'Job matches calculated and ranked successfully'
      )
    );
  } catch (err) {
    next(err);
  }
};
