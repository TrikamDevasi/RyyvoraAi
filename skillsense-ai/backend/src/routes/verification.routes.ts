import { Router } from 'express';
import {
  getPendingVerifications,
  verifyEmploymentAction,
  verifyPublicPassport,
} from '../controllers/verification.controller';
import { protect, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public cryptographic ledger verification (no auth required)
router.get('/public/:hash', verifyPublicPassport);

// Employer authenticated routes
router.get('/pending', protect, requireRole('employer', 'admin', 'government'), getPendingVerifications);
router.post('/action', protect, requireRole('employer', 'admin', 'government'), verifyEmploymentAction);

export default router;
