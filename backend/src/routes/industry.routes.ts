import { Router } from 'express';
import { getTalentPool, getDemandSignals, getForecast, getCampusConnect } from '../controllers/industry.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/talent-pool', protect, requireRole('industry', 'admin'), getTalentPool);
router.get('/talent', protect, requireRole('industry', 'admin'), getTalentPool);         // alias
router.get('/demand-signals', protect, getDemandSignals);
router.get('/demand', protect, getDemandSignals);                                         // alias
router.get('/demand/:domain', protect, getDemandSignals);                                 // per-domain alias
router.get('/forecast', protect, getForecast);
router.get('/campus-connect', protect, getCampusConnect);
router.post('/campus-connect', protect, requireRole('industry', 'admin'), getCampusConnect);

export default router;
