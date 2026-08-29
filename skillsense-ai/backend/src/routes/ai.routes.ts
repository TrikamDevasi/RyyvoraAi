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
} from '../controllers/ai.controller';

const router = Router();

// Public / Guest accessible routes
router.get('/assessment/:id', getAssessment);
router.post('/chat', optionalProtect, chat);

// Protected routes
router.use(protect);

router.get('/history', getChatHistory);

// Skill Assessment
router.post('/assess-skill',          assessSkill);
router.post('/assess-skill/evaluate', evaluateSkill);

// Career Predictor
router.post('/predict-career', predictCareer);

// Market Intelligence (Perplexity)
router.get('/market-trends', marketTrends);

export default router;
