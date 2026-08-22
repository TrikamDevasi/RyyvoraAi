// backend/src/routes/ai.routes.ts
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
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

// Public routes (No auth required for viewing a shared result)
router.get('/assessment/:id', getAssessment);

// Protected routes
router.use(protect);

// Chat
router.post('/chat', chat);
router.get('/history', getChatHistory);

// Skill Assessment
router.post('/assess-skill',          assessSkill);
router.post('/assess-skill/evaluate', evaluateSkill);

// Career Predictor
router.post('/predict-career', predictCareer);

// Market Intelligence (Perplexity)
router.get('/market-trends', marketTrends);

export default router;
