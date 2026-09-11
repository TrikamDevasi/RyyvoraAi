// backend/src/routes/employer.routes.ts
import { Router } from 'express';
import { protect, optionalProtect } from '../middleware/auth.middleware';
import {
  getEmployerDashboardStats,
  getEmployerDrives,
  createEmployerDrive,
  getEmployerPlacements,
} from '../controllers/employer.controller';

const router = Router();

// GET /api/v1/employer/dashboard-stats
router.get('/dashboard-stats', optionalProtect, getEmployerDashboardStats);

// GET /api/v1/employer/drives
router.get('/drives', optionalProtect, getEmployerDrives);

// POST /api/v1/employer/drives
router.post('/drives', protect, createEmployerDrive);

// GET /api/v1/employer/placements
router.get('/placements', optionalProtect, getEmployerPlacements);

export default router;
