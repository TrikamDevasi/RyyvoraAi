// backend/src/routes/employer.routes.ts
import { Router } from 'express';
import { protect, optionalProtect } from '../middleware/auth.middleware';
import { getEmployerDashboardStats } from '../controllers/employer.controller';

const router = Router();

// GET /api/v1/employer/dashboard-stats
// Isolated by employer tenant, accessible to employer, industry, admin, or optionalProtect
router.get('/dashboard-stats', optionalProtect, getEmployerDashboardStats);

export default router;
