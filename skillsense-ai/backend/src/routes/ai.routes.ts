// backend/src/routes/ai.routes.ts
import { Router } from 'express';
import { protect, optionalProtect } from '../middleware/auth.middleware';
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
} from '../controllers/ai.controller';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public / Guest accessible routes
router.get('/assessment/:id', getAssessment);
router.post('/chat', optionalProtect, chat);
router.get('/market-trends', marketTrends);
router.post('/policy-copilot', optionalProtect, policyCopilot);
router.get('/interventions', getPolicyInterventions);

// Protected AI Routes
router.use(protect);

router.get('/history', getChatHistory);

// AI Skill Extraction & Analysis
router.post('/analyze-skills', aiLimiter, analyzeSkills);

// Skill Assessment & Quizzes
router.post('/assess-skill', aiLimiter, assessSkill);
router.post('/assess-skill/evaluate', aiLimiter, evaluateSkill);

// Career Predictor
router.post('/predict-career', aiLimiter, predictCareer);

export default router;

