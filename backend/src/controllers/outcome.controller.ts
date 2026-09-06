import { Request, Response, NextFunction } from 'express';
import { outcomeService } from '../services/outcome.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getTraineeTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawId = req.params.traineeId;
    const traineeId = Array.isArray(rawId) ? rawId[0] : rawId;
    const timeline = await outcomeService.getTraineeTimeline(String(traineeId));
    res.status(200).json(buildApiResponse(timeline, 'Trainee timeline retrieved successfully'));
  } catch (err) {
    next(err);
  }
};


export const getMyTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }
    const timeline = await outcomeService.getTraineeTimeline(String(userId));
    res.status(200).json(buildApiResponse(timeline, 'My outcome journey timeline retrieved'));
  } catch (err) {
    next(err);
  }
};

export const selfReportOutcome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }

    const {
      status,
      employerName,
      employerContact,
      jobRole,
      industryDomain,
      employmentType,
      startDate,
      monthlySalary,
      trainingRelevance,
      district,
      program,
      nonPlacementReason,
    } = req.body;

    const result = await outcomeService.recordSelfReport({
      traineeId: String(userId),
      status: status || 'EMPLOYED',
      employerName,
      employerContact,
      jobRole,
      industryDomain,
      employmentType,
      startDate: startDate ? new Date(startDate) : new Date(),
      monthlySalary: monthlySalary ? Number(monthlySalary) : undefined,
      trainingRelevance,
      district,
      program,
      nonPlacementReason,
    });

    res.status(201).json(buildApiResponse(result, 'Employment outcome self-reported successfully'));
  } catch (err) {
    next(err);
  }
};

export const getOutcomeFunnel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { district, program, institutionId } = req.query;
    const funnel = await outcomeService.getOutcomeFunnel({
      district: district as string,
      program: program as string,
      institutionId: institutionId as string,
    });
    res.status(200).json(buildApiResponse(funnel, 'Macro outcome funnel retrieved'));
  } catch (err) {
    next(err);
  }
};

export const getDistrictIntelligence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { district } = req.query;
    const districts = await outcomeService.getDistrictIntelligence({ district: district as string });
    res.status(200).json(buildApiResponse(districts, 'District intelligence retrieved'));
  } catch (err) {
    next(err);
  }
};

export const getWageProgression = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { district } = req.query;
    const wageData = await outcomeService.getWageProgressionAnalytics({ district: district as string });
    res.status(200).json(buildApiResponse(wageData, 'Wage progression analytics retrieved'));
  } catch (err) {
    next(err);
  }
};

export const getRelevanceAndGaps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { district } = req.query;
    const data = await outcomeService.getRelevanceAndBarrierAnalysis({ district: district as string });
    res.status(200).json(buildApiResponse(data, 'Training relevance and barrier analysis retrieved'));
  } catch (err) {
    next(err);
  }
};
