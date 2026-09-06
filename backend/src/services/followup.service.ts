import mongoose from 'mongoose';
import FollowUp, { IFollowUp, IFollowUpResponse, FollowUpInterval } from '../models/FollowUp.model';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import { outcomeService } from './outcome.service';
import { retentionService } from './retention.service';
import logger from '../utils/logger';

export class FollowUpService {
  /**
   * Automatically schedule longitudinal follow-up surveys (30, 60, 90, 180, 365 days)
   */
  async scheduleFollowUps(
    traineeId: string,
    institutionId?: string,
    employmentOutcomeId?: string,
    startDate: Date = new Date()
  ): Promise<IFollowUp[]> {
    const intervals: FollowUpInterval[] = [30, 60, 90, 180, 365];
    const created: IFollowUp[] = [];

    const traineeObjectId = new mongoose.Types.ObjectId(traineeId);
    const instObjectId = institutionId ? new mongoose.Types.ObjectId(institutionId) : undefined;
    const outcomeObjectId = employmentOutcomeId ? new mongoose.Types.ObjectId(employmentOutcomeId) : undefined;

    for (const days of intervals) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + days);

      // Check if already scheduled
      const existing = await FollowUp.findOne({
        traineeId: traineeObjectId,
        scheduleDays: days,
      });

      if (!existing) {
        const item = await FollowUp.create({
          traineeId: traineeObjectId,
          institutionId: instObjectId,
          employmentOutcomeId: outcomeObjectId,
          scheduleDays: days,
          dueDate,
          status: 'PENDING',
          channel: 'PORTAL',
        });
        created.push(item);
      }
    }

    return created;
  }

  /**
   * Get pending follow-ups for a trainee
   */
  async getTraineePendingFollowUps(traineeId: string): Promise<IFollowUp[]> {
    const pending = await FollowUp.find({
      traineeId: new mongoose.Types.ObjectId(traineeId),
      status: { $in: ['PENDING', 'OVERDUE'] },
    })
      .sort({ dueDate: 1 })
      .lean();

    return pending as unknown as IFollowUp[];
  }

  /**
   * Submit response to a follow-up survey
   */
  async submitFollowUpResponse(
    followUpId: string,
    traineeId: string,
    response: IFollowUpResponse
  ): Promise<IFollowUp> {
    const followUp = await FollowUp.findOne({
      _id: new mongoose.Types.ObjectId(followUpId),
      traineeId: new mongoose.Types.ObjectId(traineeId),
    });

    if (!followUp) {
      throw new Error('Follow-up record not found or unauthorized');
    }

    followUp.status = 'COMPLETED';
    followUp.responseDate = new Date();
    followUp.responses = response;
    await followUp.save();

    // Sync response into EmploymentOutcome if employed
    if (response.isEmployed) {
      await outcomeService.recordSelfReport({
        traineeId,
        status: (response.employmentType?.toUpperCase() as any) || 'EMPLOYED',
        employerName: response.employerName,
        jobRole: response.jobRole,
        monthlySalary: response.currentSalary,
        trainingRelevance: response.trainingRelevance,
      });
    }

    // Recompute retention flags from DB data (handles all milestones correctly)
    // This is the authoritative retention update — avoids naive >= comparisons
    await retentionService.onFollowUpCompleted(traineeId);

    // Add milestone event in timeline
    await outcomeService.recordMilestone({
      traineeId,
      institutionId: followUp.institutionId ? String(followUp.institutionId) : undefined,
      program: 'Skilling Program',
      eventType: `FOLLOW_UP_${followUp.scheduleDays}D` as any,
      title: `${followUp.scheduleDays}-Day Longitudinal Outcome Verified`,
      description: response.isEmployed
        ? `Trainee confirmed continued employment at ${response.employerName || 'Organization'}${response.currentSalary ? ` (₹${response.currentSalary.toLocaleString('en-IN')}/mo)` : ''}.`
        : `Trainee submitted status update (Currently seeking placement opportunities).`,
      source: 'FOLLOW_UP',
      verificationStatus: 'SELF_REPORTED',
      confidence: 0.85,
    });

    return followUp;
  }

  /**
   * Follow-up statistics for Providers & Government
   */
  async getFollowUpStats(filter: { institutionId?: string } = {}) {
    const matchQuery: Record<string, any> = {};
    if (filter.institutionId) matchQuery.institutionId = new mongoose.Types.ObjectId(filter.institutionId);

    const [totalFollowUps, completedFollowUps, overdueFollowUps] = await Promise.all([
      FollowUp.countDocuments(matchQuery),
      FollowUp.countDocuments({ ...matchQuery, status: 'COMPLETED' }),
      FollowUp.countDocuments({ ...matchQuery, status: 'OVERDUE' }),
    ]);

    const pendingFollowUps = totalFollowUps - completedFollowUps;
    const responseRate = totalFollowUps > 0 ? Math.round((completedFollowUps / totalFollowUps) * 100) : 0;

    return {
      totalFollowUps,
      completedFollowUps,
      pendingFollowUps,
      overdueFollowUps,
      responseRate,
    };
  }
}

export const followUpService = new FollowUpService();
