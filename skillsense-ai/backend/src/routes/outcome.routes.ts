import { Router } from 'express';
import {
  getTraineeTimeline,
  getMyTimeline,
  selfReportOutcome,
  getOutcomeFunnel,
  getDistrictIntelligence,
  getWageProgression,
  getRelevanceAndGaps,
} from '../controllers/outcome.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public / Aggregated Analytics routes
router.get('/funnel', getOutcomeFunnel);
router.get('/districts', getDistrictIntelligence);
router.get('/wage-progression', getWageProgression);
router.get('/relevance-and-gaps', getRelevanceAndGaps);

// Authenticated trainee routes
router.get('/my-timeline', protect, getMyTimeline);
router.post('/self-report', protect, selfReportOutcome);
router.get('/timeline/:traineeId', protect, getTraineeTimeline);

export default router;

