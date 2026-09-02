import { Request, Response, NextFunction } from 'express';
import { followUpService } from '../services/followup.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getMyPendingFollowUps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }
    const pending = await followUpService.getTraineePendingFollowUps(String(userId));
    res.status(200).json(buildApiResponse(pending, 'Pending follow-ups retrieved'));
  } catch (err) {
    next(err);
  }
};

export const submitFollowUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }
    const { followUpId, responses } = req.body;
    const result = await followUpService.submitFollowUpResponse(followUpId, String(userId), responses);
    res.status(200).json(buildApiResponse(result, 'Follow-up response recorded'));
  } catch (err) {
    next(err);
  }
};

export const getFollowUpStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { institutionId } = req.query;
    const stats = await followUpService.getFollowUpStats({
      institutionId: institutionId as string,
    });
    res.status(200).json(buildApiResponse(stats, 'Follow-up statistics retrieved'));
  } catch (err) {
    next(err);
  }
};
