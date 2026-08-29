import { Router } from 'express';
import {
  listStudents, getStudent, updateStudent,
  getStudentSkills, getStudentPassport,
  submitAssessment, getCareerPaths, getInterventions,
  getMyStudentProfile,
} from '../controllers/student.controller';
import { protect, requireStudentOwnership, requireRole } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Apply auth to all student routes
router.use(protect);

// Current student profile
router.get('/me', getMyStudentProfile);

// Admin / Government: list all students
router.get('/', requireRole('admin', 'government', 'industry', 'institute'), listStudents);

// ID-based student endpoints guarded with strict ownership checks
router.get('/:id', requireStudentOwnership, getStudent);
router.put('/:id', requireStudentOwnership, updateStudent);
router.get('/:id/skills', requireStudentOwnership, getStudentSkills);
router.get('/:id/passport', requireStudentOwnership, getStudentPassport);
router.get('/:id/career-paths', requireStudentOwnership, getCareerPaths);
router.post('/:id/assessments', aiLimiter, requireStudentOwnership, submitAssessment);
router.get('/:id/interventions', requireStudentOwnership, getInterventions);

export default router;
