import { Router } from 'express';
import {
  getSkillGaps, getIndustryDemand, getPlacementTrendsCtrl,
  getNationalHeatmapCtrl, getPredictions, getFairness, getFundTargeting,
  getStudentSkillGaps, getStudentCareerPaths, getDashboard, getIndustryDemandByDomain,
} from '../controllers/analytics.controller';
import { protect, requireStudentOwnership, requireRole } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Dashboard summary
router.get('/dashboard', protect, getDashboard);
// Aggregate analytics
router.get('/skill-gaps', protect, getSkillGaps);
router.get('/industry-demand', protect, getIndustryDemand);
router.get('/industry-demand/:domain', protect, getIndustryDemandByDomain);
router.get('/placement-trends', protect, getPlacementTrendsCtrl);
router.get('/national-heatmap', protect, getNationalHeatmapCtrl);
router.get('/heatmap', protect, getNationalHeatmapCtrl);  // alias
router.get('/predictions', protect, getPredictions);
router.get('/fairness', protect, requireRole('admin', 'government'), getFairness);
router.get('/fund-targeting', protect, requireRole('government', 'admin'), getFundTargeting);

// Per-student AI analytics — strictly protected against IDOR
router.get('/skill-gaps/:studentId', protect, aiLimiter, requireStudentOwnership, getStudentSkillGaps);
router.get('/career-paths/:studentId', protect, aiLimiter, requireStudentOwnership, getStudentCareerPaths);

export default router;
