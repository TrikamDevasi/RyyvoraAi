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
import { protect, requireRole } from '../middleware/auth.middleware';

const router = Router();

// ── Government / Analytics routes (protected — requires auth + authorized role) ──
// These aggregate national/state-level data and must never be publicly accessible.
router.get('/funnel', protect, requireRole('government', 'admin', 'institute'), getOutcomeFunnel);
router.get('/districts', protect, requireRole('government', 'admin', 'institute'), getDistrictIntelligence);
router.get('/wage-progression', protect, requireRole('government', 'admin', 'institute'), getWageProgression);
router.get('/relevance-and-gaps', protect, requireRole('government', 'admin', 'institute'), getRelevanceAndGaps);

// ── Authenticated trainee routes ────────────────────────────────────────────
router.get('/my-timeline', protect, getMyTimeline);
router.post('/self-report', protect, selfReportOutcome);
router.get('/timeline/:traineeId', protect, getTraineeTimeline);

export default router;
