import mongoose from 'mongoose';
import Consent, { IConsent, ConsentStatus } from '../models/Consent.model';
import logger from '../utils/logger';

export class ConsentService {
  /**
   * Get consent record for a user, or create a default PENDING record
   */
  async getUserConsent(userId: string): Promise<IConsent> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    let consent = await Consent.findOne({ userId: userObjectId });

    if (!consent) {
      consent = await Consent.create({
        userId: userObjectId,
        status: 'GRANTED',
        purposes: [
          'outcome_tracking',
          'employer_verification',
          'longitudinal_followup',
          'salary_benchmarking',
          'policy_analytics',
        ],
        grantedAt: new Date(),
        consentHistory: [
          {
            action: 'GRANT',
            timestamp: new Date(),
            purposes: [
              'outcome_tracking',
              'employer_verification',
              'longitudinal_followup',
              'salary_benchmarking',
              'policy_analytics',
            ],
          },
        ],
      });
    }

    return consent;
  }

  /**
   * Update consent status or purposes
   */
  async updateConsent(
    userId: string,
    status: ConsentStatus,
    purposes: string[],
    ipAddress?: string
  ): Promise<IConsent> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    let consent = await Consent.findOne({ userId: userObjectId });

    const action = status === 'WITHDRAWN' ? 'WITHDRAW' : 'UPDATE';

    if (!consent) {
      consent = new Consent({
        userId: userObjectId,
        status,
        purposes,
        grantedAt: status === 'GRANTED' ? new Date() : undefined,
        withdrawnAt: status === 'WITHDRAWN' ? new Date() : undefined,
        consentHistory: [
          {
            action,
            timestamp: new Date(),
            ipAddress,
            purposes,
          },
        ],
      });
    } else {
      consent.status = status;
      consent.purposes = purposes;
      if (status === 'WITHDRAWN') {
        consent.withdrawnAt = new Date();
      } else if (status === 'GRANTED' && !consent.grantedAt) {
        consent.grantedAt = new Date();
      }

      consent.consentHistory.push({
        action,
        timestamp: new Date(),
        ipAddress,
        purposes,
      });
    }

    await consent.save();
    logger.info(`[Consent] Updated consent for user ${userId}: status=${status}`);
    return consent;
  }
}

export const consentService = new ConsentService();
