import { Request, Response, NextFunction } from 'express';
import { dataQualityService } from '../services/dataQuality.service';
import { buildApiResponse } from '../utils/pagination.utils';

export const getDataQualitySummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const report = await dataQualityService.calculateDataQualityScore();
    res.status(200).json(buildApiResponse(report, 'Data quality summary retrieved'));
  } catch (err) {
    next(err);
  }
};

export const batchIngestCohort = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { records, institutionId } = req.body;
    if (!Array.isArray(records)) {
      res.status(400).json(buildApiResponse(null, 'Records array is required', false));
      return;
    }

    const result = await dataQualityService.ingestCohortData(records, institutionId);
    res.status(200).json(buildApiResponse(result, 'Cohort records processed successfully'));
  } catch (err) {
    next(err);
  }
};
