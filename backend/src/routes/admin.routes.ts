import { Router, Request, Response } from 'express';
import {
  listUsers, createUser, updateUser, softDeleteUser,
  listInstitutes, createInstitute, verifyInstitute,
  getSystemReports, getFairnessDashboard,
  getStats, hardDeleteUser,
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';
import { followUpSchedulerService } from '../services/followupScheduler.service';
import { retentionService } from '../services/retention.service';
import { buildApiResponse } from '../utils/pagination.utils';

const router = Router();

// All admin routes require admin role
router.use(protect, requireRole('admin'));

// Users CRUD
router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id', auditLog('UPDATE_USER', 'user'), updateUser);
router.delete('/users/:id/soft', auditLog('DEACTIVATE_USER', 'user'), softDeleteUser);
router.delete('/users/:id', hardDeleteUser);

// Institutes
router.get('/institutes', listInstitutes);
router.post('/institutes', createInstitute);
router.patch('/institutes/:id/verify', auditLog('VERIFY_INSTITUTION', 'institution'), verifyInstitute);

// Reports
router.get('/reports', getSystemReports);
router.get('/stats', getStats);
router.get('/fairness-dashboard', getFairnessDashboard);

// ── Background Job Admin Endpoints ──────────────────────────────────────────
// POST /api/v1/admin/scheduler/run — manually trigger the follow-up scheduler
router.post('/scheduler/run', async (_req: Request, res: Response) => {
  try {
    const result = await followUpSchedulerService.runFollowUpScheduler();
    res.status(200).json(buildApiResponse(result, 'Follow-up scheduler run completed'));
  } catch (err: any) {
    res.status(500).json(buildApiResponse(null, `Scheduler run failed: ${err?.message}`, false));
  }
});

// POST /api/v1/admin/retention/refresh — manually trigger retention batch update
router.post('/retention/refresh', async (_req: Request, res: Response) => {
  try {
    const result = await retentionService.updateRetentionStatuses();
    res.status(200).json(buildApiResponse(result, 'Retention batch refresh completed'));
  } catch (err: any) {
    res.status(500).json(buildApiResponse(null, `Retention refresh failed: ${err?.message}`, false));
  }
});

export default router;
