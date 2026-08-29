import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog.model';
import Student from '../models/Student.model';
import Institution from '../models/Institution.model';
import { anonymiseExport } from '../utils/anonymise.utils';
import { parsePagination, buildPaginatedResponse, buildApiResponse } from '../utils/pagination.utils';
import { getNationalHeatmap } from '../services/analytics.service';
import { get, set } from '../utils/cache.utils';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.resource) filter.resource = req.query.resource;
    if (req.query.userId) filter.userId = req.query.userId;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json(buildPaginatedResponse(logs, total, page, limit, 'Audit logs retrieved'));
  } catch (err) { next(err); }
};

/**
 * Paginated and bounded anonymised export to prevent Out-Of-Memory crashes.
 */
export const getAnonymisedExport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const maxLimit = Math.min(limit, 500); // capped at 500 records per export page

    const [students, total] = await Promise.all([
      Student.find().skip(skip).limit(maxLimit).lean(),
      Student.countDocuments(),
    ]);

    const anonymised = anonymiseExport(students as any);
    res.status(200).json(buildPaginatedResponse(anonymised, total, page, maxLimit, `Anonymised export retrieved (${anonymised.length} records)`));
  } catch (err) { next(err); }
};

export const getComplianceCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institutions = await Institution.find({ isVerified: true }).select('name nsqfAffiliation programs type state');
    const totalStudents = await Student.countDocuments();
    const nsqfDistribution = await Student.aggregate([
      { $group: { _id: '$nsqfLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(buildApiResponse({
      verifiedInstitutions: institutions.length,
      totalStudents,
      nsqfDistribution,
      compliance: {
        nsqfCoverage: nsqfDistribution.length >= 4 ? 'adequate' : 'needs_improvement',
        institutionVerificationRate: `${institutions.length} verified institutions`,
      },
    }, 'Compliance check complete'));
  } catch (err) { next(err); }
};

export const getNationalHeatmapGov = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getNationalHeatmap();
    res.status(200).json(buildApiResponse(data, 'National heatmap data retrieved'));
  } catch (err) { next(err); }
};

/**
 * Single-query MongoDB aggregate for governance fund targeting
 */
export const getFundTargetingGov = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'governance:fund-targeting';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Fund targeting data (cached)')); return; }

    const results = await Institution.aggregate([
      { $match: { isVerified: true } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'institutionId',
          as: 'students',
        },
      },
      {
        $project: {
          name: 1,
          state: 1,
          type: 1,
          studentCount: { $size: '$students' },
          placedCount: {
            $size: {
              $filter: {
                input: '$students',
                as: 's',
                cond: { $eq: ['$$s.placementStatus', 'placed'] },
              },
            },
          },
        },
      },
      {
        $project: {
          institutionId: '$_id',
          name: 1,
          state: 1,
          type: 1,
          studentCount: 1,
          placementRate: {
            $cond: [
              { $gt: ['$studentCount', 0] },
              { $round: [{ $multiply: [{ $divide: ['$placedCount', '$studentCount'] }, 100] }, 0] },
              0,
            ],
          },
          priorityScore: {
            $cond: [
              { $gt: ['$studentCount', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $subtract: [1, { $divide: ['$placedCount', '$studentCount'] }] },
                      '$studentCount',
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          recommendedFunding: {
            $cond: [
              { $gt: ['$priorityScore', 50] },
              'high',
              { $cond: [{ $gt: ['$priorityScore', 20] }, 'medium', 'low'] },
            ],
          },
        },
      },
      { $sort: { priorityScore: -1 } },
      { $limit: 100 },
    ]);

    await set(cacheKey, results, 600);
    res.status(200).json(buildApiResponse(results, 'Fund targeting analysis complete'));
  } catch (err) { next(err); }
};
