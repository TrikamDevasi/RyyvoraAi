import mongoose from 'mongoose';
import Student from '../models/Student.model';
import User from '../models/User.model';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import FollowUp from '../models/FollowUp.model';
import { outcomeService } from './outcome.service';
import logger from '../utils/logger';

export interface DataQualityReport {
  overallScore: number; // 0-100
  metrics: {
    profileCompleteness: number; // %
    employmentStatusKnown: number; // %
    employerVerificationRate: number; // %
    followUpResponseRate: number; // %
    salaryCompleteness: number; // %
    retentionDataCompleteness: number; // %
  };
  breakdown: {
    totalRecords: number;
    verifiedRecords: number;
    pendingVerification: number;
    conflictingRecords: number;
  };
  recommendations: string[];
}

export class DataQualityService {
  /**
   * Calculate Real Data Quality Score across the outcome database
   */
  async calculateDataQualityScore(): Promise<DataQualityReport> {
    const [totalStudents, outcomes, followUps] = await Promise.all([
      Student.countDocuments(),
      EmploymentOutcome.find().lean(),
      FollowUp.find().lean(),
    ]);

    const totalRecords = Math.max(totalStudents, outcomes.length, 1);

    // Profile completeness: has skills, program, state, nsqfLevel
    const completeProfiles = await Student.countDocuments({
      'skills.0': { $exists: true },
      program: { $exists: true, $ne: '' },
      enrollmentNumber: { $exists: true, $ne: '' },
    });
    const profileCompleteness = Math.round((completeProfiles / totalRecords) * 100);

    // Employment status known
    const knownStatusCount = outcomes.filter((o) => o.status && o.status !== 'UNKNOWN').length;
    const employmentStatusKnown = Math.round((knownStatusCount / totalRecords) * 100);

    // Employer verification rate
    const verifiedCount = outcomes.filter((o) => o.verificationStatus === 'VERIFIED').length;
    const employerVerificationRate = outcomes.length > 0
      ? Math.round((verifiedCount / outcomes.length) * 100)
      : 0;

    // Follow-up response rate
    const totalFollowUps = followUps.length;
    const completedFollowUps = followUps.filter((f) => f.status === 'COMPLETED').length;
    const followUpResponseRate = totalFollowUps > 0
      ? Math.round((completedFollowUps / totalFollowUps) * 100)
      : 0;

    // Salary data completeness
    const salaryCount = outcomes.filter((o) => o.currentSalary && o.currentSalary > 0).length;
    const salaryCompleteness = outcomes.length > 0
      ? Math.round((salaryCount / outcomes.length) * 100)
      : 0;

    // Retention data completeness (has 30d, 90d, 180d, or 365d retention tracked)
    const retentionCount = outcomes.filter(
      (o) => o.retained30d || o.retained90d || o.retained180d || o.retained365d
    ).length;
    const retentionDataCompleteness = outcomes.length > 0
      ? Math.round((retentionCount / outcomes.length) * 100)
      : 0;

    // Weighted Overall Score
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          profileCompleteness * 0.2 +
          employmentStatusKnown * 0.25 +
          employerVerificationRate * 0.2 +
          followUpResponseRate * 0.15 +
          salaryCompleteness * 0.1 +
          retentionDataCompleteness * 0.1
        )
      )
    );

    const recommendations: string[] = [];
    if (employerVerificationRate < 60) {
      recommendations.push('Initiate automated employer verification workflows for self-reported placements.');
    }
    if (followUpResponseRate < 70) {
      recommendations.push('Trigger WhatsApp and SMS reminder channels for 90-day and 180-day follow-up cohorts.');
    }
    if (salaryCompleteness < 50) {
      recommendations.push('Enable salary range benchmarking prompts during post-certification follow-ups.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Data completeness and verification confidence are at optimal government reporting standards.');
    }

    return {
      overallScore,
      metrics: {
        profileCompleteness,
        employmentStatusKnown,
        employerVerificationRate,
        followUpResponseRate,
        salaryCompleteness,
        retentionDataCompleteness,
      },
      breakdown: {
        totalRecords,
        verifiedRecords: verifiedCount,
        pendingVerification: outcomes.length - verifiedCount,
        conflictingRecords: 0,
      },
      recommendations,
    };
  }

  /**
   * Batch Ingest and Reconcile Trainee Outcome Records (CSV/JSON)
   */
  async ingestCohortData(
    records: Array<{
      enrollmentNumber: string;
      name: string;
      email?: string;
      program: string;
      district?: string;
      employmentStatus?: string;
      employerName?: string;
      jobRole?: string;
      monthlySalary?: number;
      startDate?: string;
    }>,
    institutionId?: string
  ): Promise<{ imported: number; updated: number; errors: string[] }> {
    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const row of records) {
      try {
        if (!row.enrollmentNumber || !row.name) {
          errors.push(`Row missing enrollmentNumber or name: ${JSON.stringify(row)}`);
          continue;
        }

        // Canonical ID check
        let student = await Student.findOne({ enrollmentNumber: row.enrollmentNumber });
        let user = student ? await User.findById(student.userId) : null;

        if (!user && row.email) {
          user = await User.findOne({ email: row.email.toLowerCase() });
        }

        if (!user) {
          user = await User.create({
            name: row.name,
            email: row.email || `trainee_${row.enrollmentNumber.toLowerCase()}@skillsense.demo`,
            role: 'student',
            isVerified: true,
            isActive: true,
            authProvider: 'local',
            location: row.district || 'Pune',
          });
        }

        if (!student) {
          student = await Student.create({
            userId: user._id,
            institutionId: institutionId ? new mongoose.Types.ObjectId(institutionId) : undefined,
            enrollmentNumber: row.enrollmentNumber,
            program: row.program || 'Vocational Technology',
            state: 'Maharashtra',
            placementStatus: row.employmentStatus ? 'placed' : 'seeking',
            salary: row.monthlySalary ? row.monthlySalary * 12 : undefined,
          });
          imported++;
        } else {
          student.program = row.program || student.program;
          if (row.employmentStatus) student.placementStatus = 'placed';
          await student.save();
          updated++;
        }

        // If outcome data is provided, record it
        if (row.employmentStatus) {
          await outcomeService.recordSelfReport({
            traineeId: String(user._id),
            status: (row.employmentStatus.toUpperCase() as any) || 'EMPLOYED',
            employerName: row.employerName,
            jobRole: row.jobRole,
            monthlySalary: row.monthlySalary,
            district: row.district,
            program: row.program,
          });
        }
      } catch (err: any) {
        errors.push(`Error processing ${row.enrollmentNumber}: ${err.message}`);
      }
    }

    return { imported, updated, errors };
  }
}

export const dataQualityService = new DataQualityService();
