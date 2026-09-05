// backend/src/routes/ai.routes.ts
import { Router } from 'express';
import { protect, optionalProtect, requireRole } from '../middleware/auth.middleware';
import {
  chat,
  assessSkill,
  evaluateSkill,
  predictCareer,
  marketTrends,
  getChatHistory,
  getAssessment,
  analyzeSkills,
  policyCopilot,
  getPolicyInterventions,
  matchCandidate,
  cohortAnalysis,
} from '../controllers/ai.controller';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public & Optional Auth AI routes (available to candidates, students, and guests)
router.get('/assessment/:id', getAssessment);
router.post('/chat', optionalProtect, chat);
router.get('/market-trends', marketTrends);
router.post('/analyze-skills', optionalProtect, aiLimiter, analyzeSkills);
router.post('/predict-career', optionalProtect, aiLimiter, predictCareer);
router.post('/assess-skill', optionalProtect, aiLimiter, assessSkill);
router.post('/assess-skill/evaluate', optionalProtect, aiLimiter, evaluateSkill);

// Policy Copilot: strictly requires authenticated government or admin user
router.post('/policy-copilot', protect, requireRole('government', 'admin'), aiLimiter, policyCopilot);
router.get('/interventions', getPolicyInterventions);

// Employer Candidate Match: strictly checks role (industry, employer, admin)
router.post('/match-candidate', optionalProtect, (req, res, next) => {
  if (req.user && !['industry', 'employer', 'admin'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      data: null,
      message: `Forbidden. Role '${req.user.role}' is not authorized to run candidate matching.`,
    });
    return;
  }
  next();
}, aiLimiter, matchCandidate);

// Institute Cohort & Curriculum Analysis: strictly checks role (institute, admin, government)
router.post('/cohort-analysis', optionalProtect, (req, res, next) => {
  if (req.user && !['institute', 'admin', 'government'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      data: null,
      message: `Forbidden. Role '${req.user.role}' is not authorized to run cohort analytics.`,
    });
    return;
  }
  next();
}, aiLimiter, cohortAnalysis);

// Protected AI Routes
router.use(protect);

router.get('/history', getChatHistory);

export default router;


