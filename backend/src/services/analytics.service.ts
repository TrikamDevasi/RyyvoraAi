import Student from '../models/Student.model';
import Skill from '../models/Skill.model';
import { get, set } from '../utils/cache.utils';

const CACHE_TTL = 600; // 10 minutes

export const getSkillGapData = async () => {
  const cacheKey = 'analytics:skill-gaps';
  const cached = await get<unknown>(cacheKey);
  if (cached) return cached;

  const skills = await Skill.find().select('name domain industryDemandScore').lean();

  const studentSkillAggs = await Student.aggregate([
    { $unwind: '$skills' },
    {
      $group: {
        _id: '$skills.skillId',
        avgScore: { $avg: '$skills.score' },
        studentCount: { $sum: 1 },
      },
    },
  ]);

  const agg = studentSkillAggs.reduce(
    (map, item) => map.set(String(item._id), item),
    new Map<string, { avgScore: number; studentCount: number }>()
  );

  const result = skills.map((skill) => {
    const data = agg.get(String(skill._id));
    return {
      skillId: skill._id,
      name: skill.name,
      domain: skill.domain,
      avgStudentScore: data ? Math.round(data.avgScore) : 0,
      industryDemandScore: skill.industryDemandScore,
      gap: skill.industryDemandScore - (data ? Math.round(data.avgScore) : 0),
      studentCount: data ? data.studentCount : 0,
    };
  });

  // Sort by gap descending
  result.sort((a, b) => b.gap - a.gap);
  const top10 = result.slice(0, 10);

  await set(cacheKey, top10, CACHE_TTL);
  return top10;
};

export const getPlacementTrends = async () => {
  const cacheKey = 'analytics:placement-trends';
  const cached = await get<unknown>(cacheKey);
  if (cached) return cached;

  const result = await Student.aggregate([
    { $match: { placementStatus: 'placed', placedAt: { $exists: true } } },
    {
      $group: {
        _id: {
          year: { $year: '$placedAt' },
          month: { $month: '$placedAt' },
        },
        count: { $sum: 1 },
        avgSalary: { $avg: '$salary' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const formatted = result.map((r) => ({
    month: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
    placed: r.count,
    avgSalary: Math.round(r.avgSalary || 0),
  }));

  await set(cacheKey, formatted, CACHE_TTL);
  return formatted;
};

export const getNationalHeatmap = async () => {
  const cacheKey = 'analytics:national-heatmap';
  const cached = await get<unknown>(cacheKey);
  if (cached) return cached;

  const result = await Student.aggregate([
    {
      $group: {
        _id: '$state',
        studentCount: { $sum: 1 },
        avgScore: {
          $avg: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ['$skills', []] } }, 0] },
              { $avg: '$skills.score' },
              0,
            ],
          },
        },
        placedCount: {
          $sum: { $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        state: '$_id',
        _id: 0,
        studentCount: 1,
        avgScore: { $round: ['$avgScore', 1] },
        placementRate: {
          $round: [
            { $multiply: [{ $divide: ['$placedCount', '$studentCount'] }, 100] },
            1,
          ],
        },
      },
    },
    { $sort: { studentCount: -1 } },
  ]);

  await set(cacheKey, result, CACHE_TTL);
  return result;
};
