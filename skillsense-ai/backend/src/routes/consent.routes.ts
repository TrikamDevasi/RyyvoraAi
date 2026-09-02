import { Router } from 'express';
import { getUserConsent, updateUserConsent } from '../controllers/consent.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/status', protect, getUserConsent);
router.post('/update', protect, updateUserConsent);

export default router;

