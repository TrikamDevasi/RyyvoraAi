// backend/src/routes/job.routes.ts
import { Router } from 'express';
import { optionalProtect } from '../middleware/auth.middleware';
import { getJobMatches } from '../controllers/job.controller';

const router = Router();

// GET /api/v1/jobs/matches — dynamically ranks active jobs based on student verified skills and plan tier
router.get('/matches', optionalProtect, getJobMatches);

export default router;
