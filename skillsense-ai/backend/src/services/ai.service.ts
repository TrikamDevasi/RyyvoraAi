// backend/src/services/ai.service.ts

import OpenAI from 'openai';
import Groq from 'groq-sdk';
import logger from '../utils/logger';

// ── Clients ───────────────────────────────────────────────────────────────────

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface SkillScore {
  skillName: string;
  score: number;
  confidence: number;
}

export interface CareerPrediction {
  likelyRoles: string[];
  matchScores: number[];
  predictedSalaryRange: string;
  timeToPlacement: string;
}

export interface SkillGapAnalysisInput {
  studentId: string;
  studentName: string;
  program: string;
  skills: { skill: string; score: number }[];
  targetRole?: string;
  nsqfLevel: number;
}

export interface SkillGapAnalysisResult {
  studentId: string;
  overallGapScore: number;
  criticalGaps: {
    skill: string;
    currentScore: number;
    requiredScore: number;
    gap: number;
  }[];
  recommendations: string[];
  estimatedTimeToClose: string;
  nextSteps: string[];
  aiSummary: string;
}

export interface CareerMatchInput {
  skills: { skill: string; score: number }[];
  program: string;
  nsqfLevel: number;
  overallScore: number;
  state: string;
  gender: 'male' | 'female';
}

export interface CareerMatchResult {
  topCareerPaths: {
    title: string;
    matchPercent: number;
    requiredUpskilling: string[];
    estimatedSalary: { min: number; max: number };
    timeToAchieve: string;
  }[];
  aiExplanation: string;
}

export interface InterventionRecommendation {
  type: 'skill-gap' | 'dropout-risk' | 'placement-alert' | 'remediation';
  urgency: 'high' | 'medium' | 'low';
  action: string;
  expectedOutcome: string;
}

export interface IndustryDemandResult {
  demandSummary: string;
  trendDirection: 'rising' | 'stable' | 'declining';
  topEmployers: string[];
  avgSalaryRange: string;
}

// ── AIService Class ───────────────────────────────────────────────────────────

export class AIService {

  // ── 1. Extract Skills from Assessment ──────────────────────────────────────
  async extractSkills(
    responses: { questionId: string; answer: string; timeTaken: number }[]
  ): Promise<SkillScore[]> {
    if (!responses || responses.length === 0) return [];

    try {
      const prompt = `You are an expert vocational skills assessor for India's NSQF framework.
Analyse the following assessment responses and extract skill scores.

Responses:
${JSON.stringify(responses, null, 2)}

Return a JSON object with a "skills" array. Each item must have:
- skillName: string
- score: number (0-100)
- confidence: number (0-1)

Return ONLY valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 500,
      });

      const content = completion.choices[0]?.message?.content ?? '{"skills":[]}';
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.skills) ? parsed.skills : [];
    } catch (err) {
      logger.error('AI extractSkills error:', err);
      return [];
    }
  }

  // ── 2. Analyse Skill Gaps ──────────────────────────────────────────────────
  async analyzeSkillGaps(
    input: SkillGapAnalysisInput
  ): Promise<SkillGapAnalysisResult> {
    const fallback: SkillGapAnalysisResult = {
      studentId: input.studentId,
      overallGapScore: 50,
      criticalGaps: [],
      recommendations: ['Enroll in PMKVY scheme for targeted skill training'],
      estimatedTimeToClose: '3-6 months',
      nextSteps: ['Take a diagnostic assessment', 'Consult your institute counsellor'],
      aiSummary: 'Skill gap analysis unavailable. Please try again later.',
    };

    try {
      const prompt = `You are an AI skill gap analyst for India's vocational education system (NSQF framework).

Student Profile:
- Name: ${input.studentName}
- Program: ${input.program}
- NSQF Level: ${input.nsqfLevel}
- Target Role: ${input.targetRole ?? 'Not specified'}
- Current Skills: ${JSON.stringify(input.skills)}

Analyse skill gaps, identify critical deficiencies, and recommend targeted upskilling actions relevant to the Indian vocational market.

Respond ONLY with JSON:
{
  "overallGapScore": <0-100>,
  "criticalGaps": [{ "skill": "", "currentScore": 0, "requiredScore": 0, "gap": 0 }],
  "recommendations": [""],
  "estimatedTimeToClose": "",
  "nextSteps": [""],
  "aiSummary": ""
}`.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 600,
      });

      const parsed = JSON.parse(completion.choices[0].message.content ?? '{}');
      return { studentId: input.studentId, ...parsed };
    } catch (err) {
      logger.error('AI analyzeSkillGaps error:', err);
      return fallback;
    }
  }

  // ── 3. Career Path Matching ────────────────────────────────────────────────
  async matchCareerPaths(input: CareerMatchInput): Promise<CareerMatchResult> {
    const fallback: CareerMatchResult = {
      topCareerPaths: [
        {
          title: 'Entry-level Technician',
          matchPercent: 65,
          requiredUpskilling: ['Practical lab skills', 'Safety standards'],
          estimatedSalary: { min: 15000, max: 25000 },
          timeToAchieve: '3-6 months',
        },
      ],
      aiExplanation: 'Career path analysis unavailable. Showing default recommendations.',
    };

    try {
      const prompt = `You are an AI career counselor for India's vocational education ecosystem.

Student Profile:
- Program: ${input.program}
- NSQF Level: ${input.nsqfLevel}
- Overall Score: ${input.overallScore}/100
- State: ${input.state}
- Gender: ${input.gender}
- Skills: ${JSON.stringify(input.skills)}

Identify top 3 realistic career pathways within the Indian job market (manufacturing, IT, healthcare, renewable energy, automobile).

Respond ONLY with JSON:
{
  "topCareerPaths": [
    {
      "title": "",
      "matchPercent": 0,
      "requiredUpskilling": [""],
      "estimatedSalary": { "min": 0, "max": 0 },
      "timeToAchieve": ""
    }
  ],
  "aiExplanation": ""
}`.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 700,
      });

      return JSON.parse(
        completion.choices[0].message.content ?? '{}'
      ) as CareerMatchResult;
    } catch (err) {
      logger.error('AI matchCareerPaths error:', err);
      return fallback;
    }
  }

  // ── 4. Generate Interventions ──────────────────────────────────────────────
  async generateInterventions(
    atRiskStudents: {
      name: string;
      overallScore: number;
      attendance?: number;
      missingSkills: string[];
    }[]
  ): Promise<InterventionRecommendation[]> {
    if (!atRiskStudents || atRiskStudents.length === 0) return [];

    try {
      const prompt = `You are an AI education intervention planner for vocational students in India.

At-risk students: ${JSON.stringify(atRiskStudents)}

Generate targeted intervention recommendations for each student.

Respond ONLY with JSON array:
[
  {
    "type": "skill-gap" | "dropout-risk" | "placement-alert" | "remediation",
    "urgency": "high" | "medium" | "low",
    "action": "",
    "expectedOutcome": ""
  }
]`.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 800,
      });

      const data = JSON.parse(
        completion.choices[0].message.content ?? '{"interventions":[]}'
      );
      return Array.isArray(data) ? data : data.interventions ?? [];
    } catch (err) {
      logger.error('AI generateInterventions error:', err);
      return [];
    }
  }

  // ── 5. Research Industry Demand (Perplexity) ───────────────────────────────
  async researchIndustryDemand(
    domain: string
  ): Promise<IndustryDemandResult> {
    const fallback: IndustryDemandResult = {
      demandSummary: `${domain} skills are in steady demand across Indian industries.`,
      trendDirection: 'stable',
      topEmployers: ['TCS', 'Infosys', 'Wipro', 'HCL', 'L&T'],
      avgSalaryRange: '₹2L - ₹5L per annum',
    };

    try {
      const response = await perplexity.chat.completions.create({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: `Research current job market demand for "${domain}" skills in India in 2025.
Return ONLY JSON:
{
  "demandSummary": "",
  "trendDirection": "rising" | "stable" | "declining",
  "topEmployers": [""],
  "avgSalaryRange": ""
}`,
          },
        ],
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content ?? '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallback;

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        demandSummary:    parsed.demandSummary    ?? fallback.demandSummary,
        trendDirection:   parsed.trendDirection   ?? fallback.trendDirection,
        topEmployers:     parsed.topEmployers     ?? fallback.topEmployers,
        avgSalaryRange:   parsed.avgSalaryRange   ?? fallback.avgSalaryRange,
      };
    } catch (err) {
      logger.error('Perplexity researchIndustryDemand error:', err);
      return fallback;
    }
  }

  // ── 6. Generate Dashboard Insight Summary ─────────────────────────────────
  async generateInsightSummary(
    context: string,
    dataSnippet: object
  ): Promise<string> {
    try {
      const prompt = `You are an AI analyst for the SkillSense AI vocational intelligence platform.

Context: ${context}
Data: ${JSON.stringify(dataSnippet)}

Write a concise 2-3 sentence insight in plain English suitable for a government/industry dashboard. Focus on actionable takeaways specific to India's skill development sector.`.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 200,
      });

      return completion.choices[0].message.content?.trim() ?? '';
    } catch (err) {
      logger.error('AI generateInsightSummary error:', err);
      return '';
    }
  }

  // ── 7. Test Connectivity ──────────────────────────────────────────────────
  async testConnectivity(): Promise<{
    openai: { success: boolean; message: string };
    perplexity: { success: boolean; message: string };
  }> {
    const results = {
      openai: { success: false, message: 'Not tested' },
      perplexity: { success: false, message: 'Not tested' },
    };

    // Test OpenAI
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_')) {
        results.openai = { success: false, message: 'API Key missing or placeholder' };
      } else {
        const r = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5,
        });
        results.openai = { success: true, message: `Connected! Response: ${r.choices[0].message.content}` };
      }
    } catch (err: any) {
      results.openai = { success: false, message: err.message || 'Unknown error' };
    }

    // Test Perplexity
    try {
      if (!process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY === 'ppl' || process.env.PERPLEXITY_API_KEY.includes('your_')) {
        results.perplexity = { success: false, message: 'API Key missing or placeholder' };
      } else {
        const r = await perplexity.chat.completions.create({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5,
        });
        results.perplexity = { success: true, message: `Connected! Response: ${r.choices[0].message.content}` };
      }
    } catch (err: any) {
      results.perplexity = { success: false, message: err.message || 'Unknown error' };
    }

    return results;
  }

  // ── 8. Chat with Multi-tier Fallback (Groq -> OpenAI -> Perplexity) ──────────────────
  async chatWithFallback(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: { temperature?: number; max_tokens?: number; response_format?: { type: 'json_object' } } = {}
  ): Promise<string> {
    const groqOptions: any = {
      model: 'llama3-8b-8192',
      messages: messages as any,
      max_tokens: options.max_tokens ?? 1024,
      temperature: options.temperature ?? 0.7,
    };
    if (options.response_format) groqOptions.response_format = options.response_format;

    // 1. Try Groq (Primary)
    try {
      const response = await groq.chat.completions.create(groqOptions);
      return response.choices[0]?.message?.content?.trim() ?? '';
    } catch (err: any) {
      logger.warn('Groq failed, falling back to OpenAI...', err.message);
    }

    // 2. Fallback to OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 500,
        response_format: options.response_format,
      });
      return completion.choices[0]?.message?.content?.trim() ?? '';
    } catch (err: any) {
      const isQuotaError = err.status === 429 || err.code === 'insufficient_quota';
      
      if (isQuotaError) {
        logger.warn('OpenAI quota exceeded. Falling back to Perplexity...');
        try {
          const completion = await perplexity.chat.completions.create({
            model: 'llama-3.1-sonar-small-128k-online',
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? 500,
            response_format: options.response_format,
          } as any);
          return completion.choices[0]?.message?.content?.trim() ?? '';
        } catch (perr) {
          logger.error('All AI providers (Groq, OpenAI, Perplexity) failed:', perr);
          throw perr;
        }
      }
      
      logger.error('OpenAI non-quota error:', err.message);
      throw err;
    }
  }

  // ── 9. Chat Streaming (SSE Support) ───────────────────────────────────────
  async *chatStream(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: { temperature?: number; max_tokens?: number } = {}
  ): AsyncGenerator<string, void, unknown> {
    const groqOptions: any = {
      model: 'llama3-8b-8192',
      messages: messages as any,
      max_tokens: options.max_tokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      stream: true,
    };

    // 1. Try Groq (Primary)
    try {
      const stream = await groq.chat.completions.create(groqOptions) as any;
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) yield content;
      }
      return;
    } catch (err: any) {
      logger.warn('Groq stream failed, falling back to OpenAI...', err.message);
    }

    // 2. Fallback to OpenAI
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 1000,
        stream: true,
      }) as any;
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) yield content;
      }
    } catch (err: any) {
      logger.error('All AI providers (Groq, OpenAI) failed in stream mode:', err.message);
      throw err;
    }
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const aiService = new AIService();
