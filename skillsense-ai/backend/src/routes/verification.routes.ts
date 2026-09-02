import { Router } from 'express';
import {
  getPendingVerifications,
  verifyEmploymentAction,
  verifyPublicPassport,
} from '../controllers/verification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public cryptographic ledger verification
router.get('/public/:hash', verifyPublicPassport);

// Employer authenticated routes
router.get('/pending', protect, getPendingVerifications);
router.post('/action', protect, verifyEmploymentAction);

export default router;

