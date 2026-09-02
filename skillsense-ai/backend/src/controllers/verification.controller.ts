import { Request, Response, NextFunction } from 'express';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import User from '../models/User.model';
import Student from '../models/Student.model';
import { outcomeService } from '../services/outcome.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getPendingVerifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const query: Record<string, any> = {
      verificationStatus: { $in: ['PENDING', 'SELF_REPORTED'] },
      status: { $in: ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'] },
    };

    if (user?.role === 'employer' && user?.name) {
      query.$or = [
        { employerName: { $regex: user.name, $options: 'i' } },
        { employerId: user._id },
      ];
    }

    const outcomes = await EmploymentOutcome.find(query)
      .populate('traineeId', 'name email location')
      .populate('institutionId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(buildApiResponse(outcomes, 'Pending employer verifications retrieved'));
  } catch (err) {
    next(err);
  }
};

export const verifyEmploymentAction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const { outcomeId, action, notes, correctedSalary, correctedRole } = req.body;

    const outcome = await EmploymentOutcome.findById(outcomeId);
    if (!outcome) {
      res.status(404).json(buildApiResponse(null, 'Employment record not found', false));
      return;
    }

    if (action === 'VERIFY') {
      outcome.verificationStatus = 'VERIFIED';
      outcome.verificationSource = 'EMPLOYER_VERIFICATION';
      outcome.confidenceScore = 0.96;
      outcome.verifiedBy = user?._id;
      outcome.verifiedAt = new Date();
      if (notes) outcome.verificationNotes = notes;
      if (correctedSalary) outcome.currentSalary = Number(correctedSalary);
      if (correctedRole) outcome.jobRole = correctedRole;

      await outcome.save();

      // Add timeline milestone
      await outcomeService.recordMilestone({
        traineeId: String(outcome.traineeId),
        institutionId: outcome.institutionId ? String(outcome.institutionId) : undefined,
        program: outcome.program,
        eventType: 'EMPLOYED',
        title: 'Employer Verified Placement',
        description: `Placement at ${outcome.employerName || 'Enterprise'} was formally verified by ${user?.name || 'Authorized Employer'}.`,
        source: 'EMPLOYER_VERIFICATION',
        verificationStatus: 'VERIFIED',
        confidence: 0.96,
        metadata: {
          verifiedBy: user?.name,
          salary: outcome.currentSalary,
          role: outcome.jobRole,
        },
      });
    } else if (action === 'REJECT') {
      outcome.verificationStatus = 'REJECTED';
      outcome.confidenceScore = 0.2;
      outcome.verificationNotes = notes || 'Employer rejected employment record';
      await outcome.save();
    } else if (action === 'CORRECTION_REQUESTED') {
      outcome.verificationStatus = 'CORRECTION_REQUESTED';
      outcome.verificationNotes = notes || 'Correction requested by employer';
      await outcome.save();
    }

    res.status(200).json(buildApiResponse(outcome, `Employment record marked as ${outcome.verificationStatus}`));
  } catch (err) {
    next(err);
  }
};

export const verifyPublicPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { hash } = req.params;

    const student = await Student.findOne({ passportHash: hash })
      .populate('userId', 'name email location skills')
      .populate('institutionId', 'name state')
      .lean();

    if (!student) {
      res.status(404).json(buildApiResponse(null, 'Skill passport certificate not found or invalid hash', false));
      return;
    }

    const outcome = await EmploymentOutcome.findOne({ traineeId: (student.userId as any)?._id }).lean();

    const verificationPayload = {
      isValid: true,
      status: 'VERIFIED',
      passportHash: hash,
      trainee: {
        name: (student.userId as any)?.name || 'Candidate',
        enrollmentNumber: student.enrollmentNumber,
        program: student.program,
        nsqfLevel: student.nsqfLevel,
        institution: (student.institutionId as any)?.name || 'Recognized Skilling Center',
        state: student.state,
      },
      skills: (student.skills || []).map((s: any) => ({
        score: s.score,
        lastAssessed: s.lastAssessed,
      })),
      verifiedOutcome: outcome
        ? {
            status: outcome.status,
            role: outcome.jobRole,
            employer: outcome.employerName,
            isVerified: outcome.verificationStatus === 'VERIFIED',
            confidence: outcome.confidenceScore,
          }
        : null,
      verifiedAt: new Date().toISOString(),
    };

    res.status(200).json(buildApiResponse(verificationPayload, 'Skill passport successfully verified'));
  } catch (err) {
    next(err);
  }
};
