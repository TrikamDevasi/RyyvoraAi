import { Router } from 'express';
import {
  getMyPendingFollowUps,
  submitFollowUp,
  getFollowUpStats,
} from '../controllers/followup.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-pending', protect, getMyPendingFollowUps);
router.post('/submit', protect, submitFollowUp);
router.get('/stats', protect, getFollowUpStats);

export default router;

