// backend/src/routes/assessment.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect, optionalProtect } from '../middleware/auth.middleware';
import Assessment from '../models/Assessment.model';
import Student from '../models/Student.model';
import Question from '../models/Question.model';
import { buildApiResponse } from '../utils/pagination.utils';
import logger from '../utils/logger';
import { getExamQuestions, QUESTION_BANK } from '../config/questions.bank';
import { resolveDomain } from '../config/domains.config';

const router = Router();

// ── GET /api/v1/assessments/questions ────────────────────────────────────────
// Strips correct answers & explanations so client never sees answers
router.get('/questions', optionalProtect, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const domainQuery = (req.query.domain as string) || 'CSE';
    const countQuery = parseInt((req.query.count as string) || '20', 10);
    const resolvedDomain = resolveDomain(domainQuery);

    // 1. First attempt to fetch from MongoDB Question collection
    const dbQuestions = await Question.find({ domain: resolvedDomain.code })
      .limit(Math.min(countQuery, 30))
      .lean();

    let sanitized: any[] = [];

    if (dbQuestions.length > 0) {
      sanitized = dbQuestions.map((q, idx) => ({
        index: idx,
        id: String(q._id),
        domain: q.domain,
        topic: 'Engineering Competency',
        question: q.text,
        options: q.options,
      }));
    } else {
      // Fallback to canonical bank if domain not yet populated in MongoDB
      const questions = getExamQuestions(resolvedDomain.code, Math.min(countQuery, 30));
      sanitized = questions.map((q, idx) => ({
        index: idx,
        id: q.id,
        domain: q.domain,
        topic: q.topic,
        question: q.question,
        options: q.options,
      }));
    }

    res.status(200).json(
      buildApiResponse(
        {
          domain: resolvedDomain,
          total: sanitized.length,
          timeLimitSeconds: 1800, // 30:00
          questions: sanitized,
        },
        'Assessment questions retrieved successfully'
      )
    );
  } catch (err) {
    next(err);
  }
});

// ── POST /api/v1/assessments/evaluate-and-submit ──────────────────────────────
// Server-side authoritative grading
router.post('/evaluate-and-submit', optionalProtect, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { domain, mode, answers, questionIds, timeSpentSeconds } = req.body;
    const user = req.user as any;
    const userId = user?._id || user?.id;

    const targetDomain = resolveDomain(domain || 'CSE');
    const ids: string[] = Array.isArray(questionIds) ? questionIds : [];
    const submittedAnswers: Record<string, number> = answers || {};

    let total = ids.length;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const breakdown = ids.map((id, idx) => {
      const original = QUESTION_BANK.find((q) => q.id === id);
      if (!original) {
        return {
          index: idx,
          id,
          isCorrect: false,
          userAnswer: null,
          correctAnswer: null,
          explanation: 'Question record not found.',
        };
      }

      const userAns = submittedAnswers[id] !== undefined ? submittedAnswers[id] : submittedAnswers[String(idx)];
      const hasAnswered = userAns !== undefined && userAns !== null && userAns >= 0;
      const isCorrect = hasAnswered && userAns === original.correct;

      if (!hasAnswered) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        index: idx,
        id: original.id,
        topic: original.topic,
        question: original.question,
        options: original.options,
        userAnswer: hasAnswered ? userAns : null,
        correctAnswer: original.correct,
        isCorrect,
        explanation: original.explanation,
      };
    });

    if (total === 0) {
      total = breakdown.length || 1;
    }

    const calculatedScore = Math.round((correctCount / total) * 100);
    const percentile = Math.min(99, Math.max(15, Math.round(50 + (calculatedScore - 50) * 0.95)));

    // Generate AI recommendations
    const weakTopics = breakdown
      .filter((b) => !b.isCorrect)
      .map((b) => b.topic)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);

    const evaluationPayload = {
      domain: targetDomain,
      mode: mode || 'certification',
      score: calculatedScore,
      percentile,
      totalQuestions: total,
      correctCount,
      wrongCount,
      skippedCount,
      timeSpentSeconds: timeSpentSeconds || 0,
      weakTopics,
      recommendations: [
        `Targeted review recommended for: ${weakTopics.join(', ') || 'Advanced domain competencies'}.`,
        `Your accuracy is ${calculatedScore}% which puts you at the ${percentile}th percentile for ${targetDomain.name}.`,
        calculatedScore >= 70
          ? `Qualified for Ryyvora Verified Skill Passport endorsement under NSQF Level ${targetDomain.nsqfStandardLevel}.`
          : 'Complete targeted micro-learning modules to achieve 70%+ passport endorsement criteria.',
      ],
      breakdown,
    };

    // If user is authenticated, persist to Assessment and Student
    if (userId) {
      try {
        await Assessment.create({
          studentId: userId,
          category: `${targetDomain.name} (${mode || 'Exam'})`,
          score: calculatedScore,
          totalQuestions: total,
          aiAnalysis: JSON.stringify(evaluationPayload),
        });

        const student = await Student.findOne({ userId });
        if (student) {
          const topicName = targetDomain.shortName;
          const existingIdx = student.skills.findIndex(
            (s: any) => String(s.skillId) === topicName || (s.skillId as any)?.name === topicName
          );

          if (existingIdx >= 0) {
            student.skills[existingIdx].score = calculatedScore;
            student.skills[existingIdx].lastAssessed = new Date();
            student.skills[existingIdx].history = student.skills[existingIdx].history || [];
            student.skills[existingIdx].history.push({ score: calculatedScore, date: new Date() });
          } else {
            student.skills.push({
              skillId: topicName as any,
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
      } catch (saveErr: any) {
        logger.error('Error persisting assessment to database:', saveErr.message);
      }
    }

    res.status(200).json(buildApiResponse(evaluationPayload, 'Assessment evaluated successfully'));
  } catch (err) {
    next(err);
  }
});

// All subsequent routes require authentication
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
