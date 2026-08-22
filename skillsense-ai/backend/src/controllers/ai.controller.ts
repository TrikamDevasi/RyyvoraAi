// backend/src/controllers/ai.controller.ts
import { Request, Response } from 'express';
import OpenAI from 'openai';
import logger from '../utils/logger';
import { aiService } from '../services/ai.service';
import ChatSession from '../models/ChatSession.model';
import Assessment from '../models/Assessment.model';

// ── OpenAI + Perplexity clients ──────────────────────────────────────────────

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10_000,
});

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
  timeout: 10_000,
});

// ── In-memory market-trends cache (1-hour TTL) ───────────────────────────────
const trendCache = new Map<string, { data: object; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ── per-user rate limiter (20 req / hour) ────────────────────────────────────
const userReqCount = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = userReqCount.get(userId);
  if (!entry || entry.resetAt < now) {
    userReqCount.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 20) return true; // rate-limited
  entry.count++;
  return false;
}

// ── 1.  POST /api/v1/ai/chat ──────────────────────────────────────────────────
export const chat = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as unknown as { _id: { toString: () => string } } | undefined;
  const userId = user?._id?.toString() ?? 'anon';
  const isDemo = process.env.DEMO_MODE === 'true';

  if (!isDemo && checkRateLimit(userId)) {
    res.status(429).json({ success: false, data: null, message: 'Rate limit reached. Please wait before sending more messages.' });
    return;
  }

  const { message, history = [], context = '' } = req.body as {
    message: string;
    history: { role: 'user' | 'assistant'; content: string }[];
    context: string;
  };

  if (!message?.trim()) {
    res.status(400).json({ success: false, data: null, message: 'Message is required' });
    return;
  }

  const systemPrompt = `You are SkillSense AI — a friendly, encouraging skill development tutor for Indian students preparing for the job market. 
Answer in simple, clear English. Give practical, India-specific examples (companies, cities, salary in INR). 
Be warm and motivating. Keep responses under 150 words. 
If asked about skills, mention NSQF levels or PMKVY where relevant.
Context about this user: ${context || 'Student on SkillSense AI platform'}`;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8), // last 8 exchanges
      { role: 'user', content: message },
    ];

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullReply = '';
    const stream = aiService.chatStream(messages, {
      max_tokens: 300,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      fullReply += chunk;
      // SSE format: data: <payload>\n\n
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    // Generate 3 contextual follow-up suggestions
    let suggestions: string[] = ['Tell me more', 'How do I get started?', 'What skills should I learn?'];
    try {
      const suggestContent = await aiService.chatWithFallback([
        { role: 'system', content: 'You are a helpful assistant. Given the AI reply, generate exactly 3 short follow-up question suggestions a student might ask next. Return a JSON array of 3 strings, each under 8 words. Example: ["How do I learn JavaScript?","What salary can I expect?","Which companies hire freshers?"]' },
        { role: 'user', content: `AI just said: "${fullReply.substring(0, 200)}". Suggest 3 follow-up questions.` },
      ], {
        max_tokens: 120,
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(suggestContent || '{}');
      if (Array.isArray(parsed.suggestions)) suggestions = parsed.suggestions.slice(0, 3);
      else if (Array.isArray(parsed)) suggestions = parsed.slice(0, 3);
    } catch (err) {
      logger.error('Suggestions generation failed (non-blocking):', err);
    }

    // Send final payload with suggestions
    res.write(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`);
    res.end();

    // Save to ChatSession in background
    if (userId !== 'anon') {
      try {
        await ChatSession.findOneAndUpdate(
          { userId },
          {
            $push: {
              messages: {
                $each: [
                  { role: 'user', content: message, timestamp: new Date() },
                  { role: 'assistant', content: fullReply, timestamp: new Date() },
                ],
              },
            },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        logger.error('Error saving chat session:', err);
      }
    }
  } catch (err) {
    logger.error('AI chat error:', err);
    // If headers already sent, we can't send a normal error response
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        data: {
          reply: 'I\'m having trouble connecting right now. Please try again in a moment! 🙏',
          suggestions: ['What is JavaScript?', 'How to get a job in IT?', 'What is NSQF?'],
        },
        message: 'Fallback response',
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
};

// ── 2.  POST /api/v1/ai/assess-skill ─────────────────────────────────────────
export const assessSkill = async (req: Request, res: Response): Promise<void> => {
  const { topic, level = 'Intermediate' } = req.body as { topic: string; level?: string };

  if (!topic) {
    res.status(400).json({ success: false, data: null, message: 'topic is required' });
    return;
  }

  const prompt = `You are a technical interviewer. Generate exactly 5 multiple-choice questions to assess a student's ${level} knowledge of "${topic}".
Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct": "A" 
    }
  ]
}
Make questions practical and relevant to Indian software/IT industry. Mix easy and hard.`;

  try {
    const result = await aiService.chatWithFallback([{ role: 'user', content: prompt }], {
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1000,
    });

    const parsed = JSON.parse(result || '{"questions":[]}');
    res.status(200).json({ success: true, data: { topic, level, questions: parsed.questions ?? [] }, message: 'OK' });
  } catch (err) {
    logger.error('assessSkill error:', err);
    res.status(500).json({ success: false, data: null, message: 'Failed to generate assessment. Please try again.' });
  }
};

// ── 3.  POST /api/v1/ai/assess-skill/evaluate ─────────────────────────────────
export const evaluateSkill = async (req: Request, res: Response): Promise<void> => {
  const { topic, answers } = req.body as {
    topic: string;
    answers: { question: string; userAnswer: string; correctAnswer: string }[];
  };

  if (!topic || !Array.isArray(answers)) {
    res.status(400).json({ success: false, data: null, message: 'topic and answers are required' });
    return;
  }

  const correct = answers.filter(a => a.userAnswer === a.correctAnswer).length;
  const total   = answers.length;
  const pct     = Math.round((correct / total) * 100);
  const level   = pct >= 80 ? 'Advanced' : pct >= 50 ? 'Intermediate' : 'Beginner';

  const prompt = `A student just scored ${pct}% (${correct}/${total}) on a ${topic} assessment.
Wrong answers: ${JSON.stringify(answers.filter(a => a.userAnswer !== a.correctAnswer).map(a => a.question))}

Return ONLY valid JSON:
{
  "weakAreas": ["..."],
  "strengths": ["..."],
  "improvementPlan": "2-3 sentence actionable plan",
  "nextSteps": ["step 1", "step 2", "step 3"]
}`;

  try {
    const result = await aiService.chatWithFallback([{ role: 'user', content: prompt }], {
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 500,
    });

    const feedback = JSON.parse(result || '{}');
    const data = {
      score: pct,
      correct,
      total,
      level,
      weakAreas:       feedback.weakAreas       ?? [],
      strengths:       feedback.strengths       ?? [],
      improvementPlan: feedback.improvementPlan ?? 'Keep practicing!',
      nextSteps:       feedback.nextSteps       ?? [],
    };

    // Save to database in background
    const user = req.user as any;
    const userId = user?.id || user?._id || 'anon';
    
    let assessmentId = null;
    if (userId !== 'anon') {
      try {
        const newAssessment = await Assessment.create({
          studentId: userId,
          category: topic,
          score: pct,
          totalQuestions: total,
          aiAnalysis: JSON.stringify(data),
        });
        assessmentId = newAssessment._id;
      } catch (err) {
        logger.error('Error saving assessment:', err);
      }
    }

    res.status(200).json({
      success: true,
      data: { ...data, id: assessmentId },
      message: 'OK',
    });
  } catch (err) {
    logger.error('evaluateSkill error:', err);
    res.status(200).json({
      success: true,
      data: { score: pct, correct, total, level, weakAreas: [], strengths: [], improvementPlan: 'Good effort! Keep practising.', nextSteps: ['Review the topic', 'Retake the quiz'] },
      message: 'Fallback',
    });
  }
};

// ── 3.1 GET /api/v1/ai/assessment/:id ───────────────────────────────────────
export const getAssessment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const assessment = await Assessment.findById(id).populate('studentId', 'name profilePicture');
    if (!assessment) {
      res.status(404).json({ success: false, message: 'Assessment not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: assessment._id,
        category: assessment.category,
        score: assessment.score,
        total: assessment.totalQuestions,
        completedAt: assessment.completedAt,
        student: assessment.studentId,
        ...(JSON.parse(assessment.aiAnalysis || '{}')),
      },
    });
  } catch (err) {
    logger.error('getAssessment error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve assessment' });
  }
};

// ── 4.  POST /api/v1/ai/predict-career ────────────────────────────────────────
export const predictCareer = async (req: Request, res: Response): Promise<void> => {
  const { skills = [], interests = [], education = '' } = req.body;
  const user = req.user as any;
  const userId = user?.id || user?._id || 'anon';

  const prompt = `You are an expert Indian career counselor. Based on this student profile, predict top 3 career paths.

Skills: ${skills.join(', ')}
Interests: ${interests.join(', ')}
Education: ${education}

Return ONLY valid JSON:
{
  "careers": [
    {
      "title": "",
      "match": 85,
      "salaryRange": "₹6L–₹12L/year",
      "growth": "High",
      "missingSkills": ["skill1", "skill2"],
      "timeToReady": "3-6 months",
      "roadmap": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`;

  try {
    const result = await aiService.chatWithFallback([{ role: 'user', content: prompt }], {
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 800,
    });

    const parsed = JSON.parse(result || '{"careers":[]}');
    
    // Save to database in background
    if (userId !== 'anon') {
      import('../models/CareerPrediction.model').then(({ default: CareerPrediction }) => {
        CareerPrediction.create({
          userId,
          skills,
          interests,
          education,
          careers: parsed.careers,
        }).catch(err => logger.error('Error saving career prediction:', err));
      });
    }

    res.status(200).json({ success: true, data: parsed, message: 'OK' });
  } catch (err) {
    logger.error('predictCareer error:', err);
    res.status(500).json({ success: false, data: null, message: 'Career prediction failed. Please try again.' });
  }
};

// ── 5.  GET /api/v1/ai/market-trends?skill=React ─────────────────────────────
export const marketTrends = async (req: Request, res: Response): Promise<void> => {
  const skill = (req.query.skill as string) ?? 'Software Development';
  const cacheKey = skill.toLowerCase();

  // Cache hit
  const cached = trendCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    res.status(200).json({ success: true, data: cached.data, message: 'cached' });
    return;
  }

  try {
    const result = await aiService.researchIndustryDemand(skill);
    const data = {
      skill,
      demand:          result.trendDirection,
      avgSalary:       result.avgSalaryRange,
      topCompanies:    result.topEmployers,
      trendingTopics:  [skill, `${skill} frameworks`, `${skill} jobs India`, 'remote work'],
      jobCount:        '10,000+',
      summary:         result.demandSummary,
    };
    trendCache.set(cacheKey, { data, ts: Date.now() });
    res.status(200).json({ success: true, data, message: 'OK' });
  } catch (err) {
    logger.error('marketTrends error:', err);
    res.status(500).json({ success: false, data: null, message: 'Market data unavailable.' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const userId = user?.id || user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const session = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, data: session?.messages || [] });
  } catch (err) {
    logger.error('getChatHistory error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
  }
};
