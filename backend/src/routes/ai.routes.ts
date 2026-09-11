import { Router } from 'express';
import multer from 'multer';
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
  parseResume,
  fetchGitHubRepo,
} from '../controllers/ai.controller';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

// Public & Optional Auth AI routes (available to candidates, students, and guests)
router.get('/assessment/:id', getAssessment);
router.post('/chat', optionalProtect, chat);
router.get('/market-trends', marketTrends);
router.post('/analyze-skills', optionalProtect, aiLimiter, analyzeSkills);
router.post('/parse-resume', optionalProtect, resumeUpload.single('resume'), parseResume);
router.get('/github-repo', optionalProtect, fetchGitHubRepo);
router.post('/predict-career', optionalProtect, aiLimiter, predictCareer);
router.post('/assess-skill', optionalProtect, aiLimiter, assessSkill);
router.post('/assess-skill/evaluate', optionalProtect, aiLimiter, evaluateSkill);

// Policy Copilot: strictly requires authenticated government or admin user
router.post('/policy-copilot', protect, requireRole('government', 'admin'), aiLimiter, policyCopilot);
router.get('/interventions', getPolicyInterventions);

// Employer Candidate Match: strictly requires authenticated industry, employer, or admin user
router.post('/match-candidate', protect, requireRole('industry', 'employer', 'admin'), aiLimiter, matchCandidate);

// Institute Cohort & Curriculum Analysis: strictly requires authenticated institute, admin, or government user
router.post('/cohort-analysis', protect, requireRole('institute', 'admin', 'government'), aiLimiter, cohortAnalysis);

// Protected AI Routes
router.use(protect);

router.get('/history', getChatHistory);

export default router;


