import { Router } from 'express';
import {
  getInstituteDashboard, getInstituteStudents, getPlacementTrend,
  getInstituteROI, uploadStudentCSV, getInstituteReport,
  createInstituteStudent, getInstituteEvaluations, createInstituteEvaluation
} from '../controllers/institute.controller';
import { protect, requireInstituteAccess, requireRole } from '../middleware/auth.middleware';
import { uploadCSV } from '../middleware/upload.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.use(protect);

router.get('/:id/dashboard', requireRole('institute', 'admin'), requireInstituteAccess, auditLog('VIEW_DASHBOARD', 'institution'), getInstituteDashboard);
router.get('/:id/students', requireRole('institute', 'admin'), requireInstituteAccess, getInstituteStudents);
router.post('/:id/students', requireRole('institute', 'admin'), requireInstituteAccess, createInstituteStudent);
router.get('/:id/evaluations', requireRole('institute', 'admin'), requireInstituteAccess, getInstituteEvaluations);
router.post('/:id/evaluations', requireRole('institute', 'admin'), requireInstituteAccess, createInstituteEvaluation);
router.get('/:id/placement', requireRole('institute', 'admin'), requireInstituteAccess, getPlacementTrend);
router.get('/:id/roi', requireRole('institute', 'admin'), requireInstituteAccess, getInstituteROI);
router.post('/:id/upload', requireRole('institute', 'admin'), requireInstituteAccess, uploadCSV.single('file'), uploadStudentCSV);
router.get('/:id/report', requireRole('institute', 'admin'), requireInstituteAccess, getInstituteReport);

export default router;
