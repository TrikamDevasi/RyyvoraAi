import { Request, Response, NextFunction } from 'express';
import { consentService } from '../services/consent.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getUserConsent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }
    const consent = await consentService.getUserConsent(String(userId));
    res.status(200).json(buildApiResponse(consent, 'User consent retrieved'));
  } catch (err) {
    next(err);
  }
};

export const updateUserConsent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }
    const { status, purposes } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;

    const consent = await consentService.updateConsent(
      String(userId),
      status || 'GRANTED',
      purposes || ['outcome_tracking'],
      ipAddress
    );

    res.status(200).json(buildApiResponse(consent, 'User consent updated successfully'));
  } catch (err) {
    next(err);
  }
};
