// backend/src/routes/assessment.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth.middleware';
import Assessment from '../models/Assessment.model';
import Student from '../models/Student.model';
import { buildApiResponse } from '../utils/pagination.utils';
import logger from '../utils/logger';

const router = Router();

router.use(protect);

// ── GET /api/v1/assessments/history ──────────────────────────────────────────
router.get('/history', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }

    const assessments = await Assessment.find({ studentId: userId }).sort({ completedAt: -1 }).limit(20);
    res.status(200).json(buildApiResponse(assessments, 'Assessment history retrieved'));
  } catch (err) {
    next(err);
  }
});

// ── POST /api/v1/assessments/submit ──────────────────────────────────────────
router.post('/submit', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as any;
    const userId = user?._id || user?.id;
    if (!userId) {
      res.status(401).json(buildApiResponse(null, 'Unauthorized', false));
      return;
    }

    const { category, score, totalQuestions, aiAnalysis } = req.body;
    const calculatedScore = typeof score === 'number' ? score : 80;
    const topic = category || 'General Skills';

    const assessment = await Assessment.create({
      studentId: userId,
      category: topic,
      score: calculatedScore,
      totalQuestions: totalQuestions || 5,
      aiAnalysis: typeof aiAnalysis === 'object' ? JSON.stringify(aiAnalysis) : aiAnalysis || '',
    });

    // Update student skills ledger
    try {
      const student = await Student.findOne({ userId });
      if (student) {
        const existingIdx = student.skills.findIndex(
          (s: any) => String(s.skillId) === topic || (s.skillId as any)?.name === topic
        );
        if (existingIdx >= 0) {
          student.skills[existingIdx].score = calculatedScore;
          student.skills[existingIdx].lastAssessed = new Date();
          student.skills[existingIdx].history = student.skills[existingIdx].history || [];
          student.skills[existingIdx].history.push({ score: calculatedScore, date: new Date() });
        } else {
          student.skills.push({
            skillId: topic as any,
            score: calculatedScore,
            lastAssessed: new Date(),
            history: [{ score: calculatedScore, date: new Date() }],
          });
        }

        student.overallScore = Math.round(
          student.skills.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / student.skills.length
        );
        await student.save();
      }
    } catch (err: any) {
      logger.error('Error updating student skills on assessment submit:', err.message);
    }

    res.status(201).json(buildApiResponse(assessment, 'Assessment submitted and saved'));
  } catch (err) {
    next(err);
  }
});

// ── GET /api/v1/assessments/:id ──────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      res.status(404).json(buildApiResponse(null, 'Assessment not found', false));
      return;
    }
    res.status(200).json(buildApiResponse(assessment, 'Assessment retrieved'));
  } catch (err) {
    next(err);
  }
});

export default router;
