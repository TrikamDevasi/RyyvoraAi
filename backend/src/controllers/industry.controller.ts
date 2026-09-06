import { Request, Response, NextFunction } from 'express';
import Student from '../models/Student.model';
import Skill from '../models/Skill.model';
import Institution from '../models/Institution.model';
import { get, set } from '../utils/cache.utils';
import { anonymiseExport } from '../utils/anonymise.utils';
import { buildApiResponse } from '../utils/pagination.utils';
import { aiService } from '../services/ai.service';

export const getTalentPool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const seekers = await Student.find({ placementStatus: 'seeking' })
      .populate('skills.skillId', 'name domain')
      .sort({ /* overallScore virtual not sortable in DB */ createdAt: -1 })
      .limit(100);

    const anonymised = anonymiseExport(seekers as any);
    // Sort by overallScore descending after fetch
    anonymised.sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0));

    res.status(200).json(buildApiResponse(anonymised, 'Talent pool retrieved'));
  } catch (err) { next(err); }
};

export const getDemandSignals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'industry:demand-signals';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Demand signals retrieved (cached)')); return; }

    const skills = await Skill.find()
      .select('name domain industryDemandScore nsqfLevel')
      .sort({ industryDemandScore: -1 })
      .limit(10);

    // Enrich top 3 unique domains with Perplexity real-time research
    const topDomains = [...new Set(skills.slice(0, 3).map((s) => s.domain))];
    const researchResults = await Promise.allSettled(
      topDomains.map((domain) => aiService.researchIndustryDemand(domain))
    );
    const researchMap: Record<string, unknown> = {};
    topDomains.forEach((domain, i) => {
      const r = researchResults[i];
      if (r.status === 'fulfilled') researchMap[domain] = r.value;
    });

    const enriched = skills.map((s) => ({
      ...s.toObject(),
      marketInsight: researchMap[s.domain] ?? null,
    }));

    await set(cacheKey, enriched, 600);
    res.status(200).json(buildApiResponse(enriched, 'Demand signals retrieved'));
  } catch (err) { next(err); }
};

export const getForecast = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'industry:forecast';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Forecast retrieved (cached)')); return; }

    const topSkills = await Skill.find()
      .select('name domain demandTrend industryDemandScore')
      .sort({ industryDemandScore: -1 })
      .limit(5);

    await set(cacheKey, topSkills, 600);
    res.status(200).json(buildApiResponse(topSkills, 'Forecast retrieved'));
  } catch (err) { next(err); }
};

export const getCampusConnect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'industry:campus-connect';
    const cached = await get<unknown>(cacheKey);
    if (cached) { res.status(200).json(buildApiResponse(cached, 'Institutions retrieved (cached)')); return; }

    const institutions = await Institution.find({ isVerified: true })
      .select('name type state district programs placementRate studentCount');

    await set(cacheKey, institutions, 600);
    res.status(200).json(buildApiResponse(institutions, 'Institutions retrieved'));
  } catch (err) { next(err); }
};
