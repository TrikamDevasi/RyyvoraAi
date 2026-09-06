import { Router } from 'express';
import {
  getDataQualitySummary,
  batchIngestCohort,
} from '../controllers/dataQuality.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', getDataQualitySummary);
router.post('/import', protect, batchIngestCohort);

export default router;

