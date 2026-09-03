import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import Student from '../models/Student.model';
import { outcomeService } from '../services/outcome.service';
import { buildApiResponse } from '../utils/pagination.utils';
import logger from '../utils/logger';

const VALID_ACTIONS = ['VERIFY', 'REJECT', 'CORRECTION_REQUESTED'] as const;
type ValidAction = (typeof VALID_ACTIONS)[number];

const VALID_STATUSES: Record<ValidAction, string[]> = {
  VERIFY: ['PENDING', 'SELF_REPORTED', 'CORRECTION_REQUESTED'],
  REJECT: ['PENDING', 'SELF_REPORTED', 'CORRECTION_REQUESTED'],
  CORRECTION_REQUESTED: ['PENDING', 'SELF_REPORTED'],
};

const MAX_NOTES_LENGTH = 2000;

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function sanitizeNotes(notes: unknown): string | undefined {
  if (typeof notes !== 'string') return undefined;
  const trimmed = notes.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, MAX_NOTES_LENGTH).replace(/[<>]/g, '');
}

/**
 * GET /verification/pending
 * Returns employment outcomes pending verification, filtered to the authenticated employer.
 * Admin/Government get all pending. Employer only gets their company's claims.
 */
export const getPendingVerifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json(buildApiResponse(null, 'Not authorized', false));
      return;
    }

    const query: Record<string, any> = {
      verificationStatus: { $in: ['PENDING', 'SELF_REPORTED'] },
      status: { $in: ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'] },
    };

    // IDOR protection: employer can only see their own company's claims
    if (user.role === 'employer') {
      query.employerId = user._id;
    } else if (!['admin', 'government'].includes(user.role)) {
      // Non-employer, non-admin, non-government users get nothing
      res.status(403).json(buildApiResponse(null, 'Forbidden. Insufficient permissions.', false));
      return;
    }

    const outcomes = await EmploymentOutcome.find(query)
      .populate('traineeId', 'name email location')
      .populate('institutionId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Sanitize response: strip sensitive fields
    const sanitized = outcomes.map((o: any) => ({
      _id: o._id,
      traineeName: o.traineeId?.name || 'Unknown',
      traineeEmail: undefined,
      traineeLocation: o.traineeId?.location || '',
      institutionName: o.institutionId?.name || 'Unknown',
      program: o.program,
      jobRole: o.jobRole,
      employerName: o.employerName,
      employmentType: o.employmentType,
      startDate: o.startDate,
      currentSalary: o.currentSalary,
      initialSalary: o.initialSalary,
      status: o.status,
      verificationStatus: o.verificationStatus,
      verificationNotes: o.verificationNotes,
      verifiedAt: o.verifiedAt,
      createdAt: o.createdAt,
    }));

    res.status(200).json(buildApiResponse(sanitized, 'Pending employer verifications retrieved'));
  } catch (err) {
    logger.error('getPendingVerifications error:', err);
    next(err);
  }
};

/**
 * POST /verification/action
 * Body: { outcomeId, action, notes?, correctedSalary?, correctedRole? }
 * Handles VERIFY, REJECT, CORRECTION_REQUESTED with:
 * - IDOR protection
 * - Status transition validation
 * - Idempotency (safe re-submission)
 * - Input validation
 * - Audit logging
 */
export const verifyEmploymentAction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json(buildApiResponse(null, 'Not authorized', false));
      return;
    }

    // Only employers, admin, government can perform verification actions
    if (!['employer', 'admin', 'government'].includes(user.role)) {
      res.status(403).json(buildApiResponse(null, 'Forbidden. You are not authorized to perform verification actions.', false));
      return;
    }

    const { outcomeId, action, notes, correctedSalary, correctedRole } = req.body;

    // Validate outcomeId
    if (!outcomeId || !isValidObjectId(outcomeId)) {
      res.status(422).json(buildApiResponse(null, 'Invalid or missing outcome ID.', false));
      return;
    }

    // Validate action
    if (!action || !VALID_ACTIONS.includes(action as ValidAction)) {
      res.status(422).json(buildApiResponse(null, `Invalid action. Supported actions: ${VALID_ACTIONS.join(', ')}`, false));
      return;
    }

    const validAction = action as ValidAction;

    // Sanitize notes
    const sanitizedNotes = sanitizeNotes(notes);

    // Validate correctedSalary if provided (only for VERIFY)
    if (correctedSalary !== undefined && correctedSalary !== null) {
      const salary = Number(correctedSalary);
      if (isNaN(salary) || salary < 0 || salary > 10000000) {
        res.status(422).json(buildApiResponse(null, 'Invalid salary value.', false));
        return;
      }
    }

    // Validate correctedRole if provided (only for VERIFY)
    if (correctedRole !== undefined && correctedRole !== null) {
      if (typeof correctedRole !== 'string' || correctedRole.trim().length === 0 || correctedRole.length > 200) {
        res.status(422).json(buildApiResponse(null, 'Invalid role value.', false));
        return;
      }
    }

    // Find the outcome
    const outcome = await EmploymentOutcome.findById(outcomeId);
    if (!outcome) {
      res.status(404).json(buildApiResponse(null, 'Employment outcome record not found.', false));
      return;
    }

    // IDOR protection: employer can only act on outcomes where they are the employer
    if (user.role === 'employer') {
      if (!outcome.employerId || String(outcome.employerId) !== String(user._id)) {
        logger.warn(`[SECURITY] IDOR attempt: Employer ${user._id} tried to access outcome ${outcomeId} owned by ${outcome.employerId}`);
        res.status(403).json(buildApiResponse(null, 'You are not authorized to verify this employment record.', false));
        return;
      }
    }

    // Status transition validation: prevent acting on already-processed records
    const currentStatus = outcome.verificationStatus;
    const allowedTransitions = VALID_STATUSES[validAction];
    if (!allowedTransitions.includes(currentStatus)) {
      // Idempotency: if already in the target state, return success
      if (
        (validAction === 'VERIFY' && currentStatus === 'VERIFIED') ||
        (validAction === 'REJECT' && currentStatus === 'REJECTED') ||
        (validAction === 'CORRECTION_REQUESTED' && currentStatus === 'CORRECTION_REQUESTED')
      ) {
        res.status(200).json(buildApiResponse(outcome, `This claim has already been ${currentStatus.toLowerCase()}.`));
        return;
      }
      res.status(409).json(
        buildApiResponse(
          null,
          `Cannot ${validAction.toLowerCase()} a claim with status "${currentStatus}". Expected one of: ${allowedTransitions.join(', ')}.`,
          false
        )
      );
      return;
    }

    // Apply the action
    if (validAction === 'VERIFY') {
      outcome.verificationStatus = 'VERIFIED';
      outcome.verificationSource = 'EMPLOYER_VERIFICATION';
      outcome.confidenceScore = 0.96;
      outcome.verifiedBy = user._id;
      outcome.verifiedAt = new Date();
      if (sanitizedNotes) outcome.verificationNotes = sanitizedNotes;
      if (correctedSalary !== undefined && correctedSalary !== null) {
        outcome.currentSalary = Number(correctedSalary);
      }
      if (correctedRole !== undefined && correctedRole !== null) {
        outcome.jobRole = correctedRole.trim();
      }

      await outcome.save();

      // Add timeline milestone
      try {
        await outcomeService.recordMilestone({
          traineeId: String(outcome.traineeId),
          institutionId: outcome.institutionId ? String(outcome.institutionId) : undefined,
          program: outcome.program,
          district: outcome.district,
          state: outcome.state,
          eventType: 'EMPLOYED',
          title: 'Employer Verified Placement',
          description: `Placement at ${outcome.employerName || 'Enterprise'} was formally verified by ${user.name || 'Authorized Employer'}.`,
          source: 'EMPLOYER_VERIFICATION',
          verificationStatus: 'VERIFIED',
          confidence: 0.96,
          metadata: {
            verifiedBy: user.name,
            salary: outcome.currentSalary,
            role: outcome.jobRole,
          },
        });
      } catch (timelineErr) {
        logger.error('Failed to record timeline milestone for verification:', timelineErr);
        // Don't fail the request - the outcome is already saved
      }

      logger.info(`[VERIFICATION] Outcome ${outcomeId} verified by employer ${user._id} (${user.name})`);
    } else if (validAction === 'REJECT') {
      outcome.verificationStatus = 'REJECTED';
      outcome.confidenceScore = 0.2;
      outcome.verificationNotes = sanitizedNotes || 'Employer rejected employment record';
      outcome.verifiedBy = user._id;
      outcome.verifiedAt = new Date();
      await outcome.save();

      logger.info(`[VERIFICATION] Outcome ${outcomeId} rejected by employer ${user._id} (${user.name})`);
    } else if (validAction === 'CORRECTION_REQUESTED') {
      outcome.verificationStatus = 'CORRECTION_REQUESTED';
      outcome.verificationNotes = sanitizedNotes || 'Correction requested by employer';
      outcome.verifiedBy = user._id;
      outcome.verifiedAt = new Date();
      await outcome.save();

      logger.info(`[VERIFICATION] Correction requested for outcome ${outcomeId} by employer ${user._id} (${user.name})`);
    }

    // Return sanitized response (no password hashes, no internal fields)
    const responsePayload = {
      _id: outcome._id,
      verificationStatus: outcome.verificationStatus,
      verificationNotes: outcome.verificationNotes,
      verifiedAt: outcome.verifiedAt,
      confidenceScore: outcome.confidenceScore,
      jobRole: outcome.jobRole,
      currentSalary: outcome.currentSalary,
    };

    res.status(200).json(buildApiResponse(responsePayload, `Employment record marked as ${outcome.verificationStatus}`));
  } catch (err) {
    logger.error('verifyEmploymentAction error:', err);
    next(err);
  }
};

/**
 * GET /verification/public/:hash
 * Public passport verification - no auth required.
 */
export const verifyPublicPassport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { hash } = req.params;

    if (!hash || typeof hash !== 'string' || hash.length > 500) {
      res.status(422).json(buildApiResponse(null, 'Invalid hash parameter.', false));
      return;
    }

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
    logger.error('verifyPublicPassport error:', err);
    next(err);
  }
};
