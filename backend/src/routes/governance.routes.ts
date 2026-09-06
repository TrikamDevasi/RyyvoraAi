import { Router } from 'express';
import {
  getAuditLogs, getAnonymisedExport, getComplianceCheck,
  getNationalHeatmapGov, getFundTargetingGov,
} from '../controllers/governance.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/audit-logs', protect, requireRole('admin', 'government'), getAuditLogs);
router.get('/anonymised-export', protect, requireRole('admin'), getAnonymisedExport);
router.post('/compliance-check', protect, requireRole('admin'), getComplianceCheck);
router.get('/compliance', protect, requireRole('admin', 'government'), getComplianceCheck);  // GET alias
router.get('/heatmap', protect, requireRole('government', 'admin'), getNationalHeatmapGov);
router.get('/fund-targeting', protect, requireRole('government', 'admin'), getFundTargetingGov);

export default router;
