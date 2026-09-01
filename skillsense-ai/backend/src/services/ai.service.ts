// backend/src/services/ai.service.ts
import {
  providerManager,
  parseAndValidateAIOutput,
  ChatMessage,
  CompletionOptions,
  ProviderHealth,
  SkillAnalysisSchema,
  SkillAnalysisResult,
  CareerPredictionSchema,
  CareerPredictionResult,
  GapAnalysisSchema,
  GapAnalysisResult,
  AssessmentGenerationSchema,
  AssessmentGenerationResult,
  AssessmentEvaluationSchema,
  AssessmentEvaluationResult,
  IndustryDemandSchema,
  IndustryDemandResult,
} from './providers';
import logger from '../utils/logger';

export const AI_UNAVAILABLE_MESSAGE = 'AI service is currently unavailable. Please try again in a moment.';

export class AIUnavailableError extends Error {
  isAIUnavailable = true;
  constructor(message: string = AI_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = 'AIUnavailableError';
  }
}

export interface SkillScore {
  skillName: string;
  score: number;
  confidence: number;
  category?: string;
  evidence?: string;
}

export interface SkillGapAnalysisInput {
  studentId?: string;
  studentName?: string;
  program: string;
  skills: { skill: string; score: number }[];
  targetRole?: string;
  nsqfLevel?: number;
}

export interface CareerMatchInput {
  skills: { skill: string; score: number }[];
  interests?: string[];
  program: string;
  nsqfLevel?: number;
  overallScore?: number;
  state?: string;
  gender?: 'male' | 'female' | string;
}

export type CareerMatchResult = CareerPredictionResult;

export class AIService {
  // ── 1. Unified Fallback Chat Completion ────────────────────────────────────
  async chatWithFallback(
    messages: ChatMessage[],
    options: CompletionOptions = {}
  ): Promise<string> {
    try {
      const { content } = await providerManager.executeWithFallback(messages, options);
      return content;
    } catch (err: any) {
      logger.error('AIService chatWithFallback failed:', err.message);
      return '';
    }
  }

  // ── 2. Chat Streaming ──────────────────────────────────────────────────────
  chatStream(
    messages: ChatMessage[],
    options: CompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    return providerManager.executeStreamWithFallback(messages, options);
  }

  // ── 3. Deep AI Skill Analysis (Resume, GitHub, Projects, Code) ──────────────
  async analyzeSkills(input: {
    text?: string;
    githubUrl?: string;
    projects?: string[] | { title: string; repoUrl?: string; description?: string }[];
    skills?: string[];
    program?: string;
    nsqfLevel?: number;
  }): Promise<SkillAnalysisResult> {
    const prompt = `You are a Principal Technical Recruiter and AI Skill Assessor for India's technology ecosystem and the National Skills Qualifications Framework (NSQF).

Analyze this candidate profile across resumes, GitHub/projects, and technical skill descriptions:
- Candidate Text / Resume: ${input.text || 'Not provided'}
- GitHub / Repo URL: ${input.githubUrl || 'Not provided'}
- Projects: ${JSON.stringify(input.projects || [])}
- Declared Skills: ${JSON.stringify(input.skills || [])}
- Target Program: ${input.program || 'Computer Science & Technology'}
- Target NSQF Level: ${input.nsqfLevel || 4}

Extract granular competencies, score technical & soft skills (0-100), identify concrete strengths, weakness areas, and actionable recommendations.

Return ONLY valid JSON matching this schema:
{
  "overallScore": <0-100>,
  "confidence": <0.0-1.0>,
  "experienceLevel": "Beginner" | "Intermediate" | "Advanced" | "Expert",
  "technicalSkills": [
    { "name": "Skill Name", "score": <0-100>, "category": "technical" | "architectural" | "tools", "confidence": 0.9, "evidence": "Short reason" }
  ],
  "softSkills": [
    { "name": "Skill Name", "score": <0-100>, "category": "soft", "confidence": 0.85, "evidence": "Short reason" }
  ],
  "competencies": [
    { "category": "Domain Category", "score": <0-100>, "description": "Brief breakdown" }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "summary": "2-3 sentences synthesizing candidate capability"
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an objective, expert technical skill evaluator. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.2, max_tokens: 1500, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<SkillAnalysisResult>(response, SkillAnalysisSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('analyzeSkills error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 4. Skill Gap Analysis ──────────────────────────────────────────────────
  async analyzeSkillGaps(input: SkillGapAnalysisInput): Promise<GapAnalysisResult> {
    const prompt = `You are an AI vocational gap analyst for the Indian technology job market (NSQF aligned).

Profile:
- Candidate Name: ${input.studentName || 'Student'}
- Program: ${input.program}
- NSQF Level: ${input.nsqfLevel || 4}
- Target Role: ${input.targetRole || 'Full-Stack Software Engineer'}
- Current Assessed Skills: ${JSON.stringify(input.skills)}

Identify exact skill deficiencies against contemporary Indian hiring benchmarks (TCS, Infosys, Swiggy, Zerodha, Razorpay).

Return ONLY valid JSON:
{
  "targetRole": "${input.targetRole || 'Full-Stack Software Engineer'}",
  "overallGapScore": <0-100>,
  "criticalGaps": [
    {
      "skill": "Skill Name",
      "currentScore": <0-100>,
      "requiredScore": <0-100>,
      "gap": <0-100>,
      "priority": "High" | "Medium" | "Low",
      "impactReason": "Why this gap matters",
      "recommendedAction": "Actionable learning step",
      "estimatedEffort": "e.g. 2-3 weeks"
    }
  ],
  "prioritySkills": ["Skill 1", "Skill 2"],
  "roadmap": [
    {
      "phase": "Phase title",
      "timeline": "Timeline span",
      "actions": ["Action 1", "Action 2"],
      "targetSkills": ["Target skill 1"]
    }
  ],
  "estimatedTimeToClose": "e.g. 2-3 months",
  "confidence": 0.9,
  "aiSummary": "2-sentence executive summary"
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an expert workforce intelligence analyst. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 1200, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<GapAnalysisResult>(response, GapAnalysisSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('analyzeSkillGaps error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 5. Career Path Prediction ──────────────────────────────────────────────
  async matchCareerPaths(input: CareerMatchInput): Promise<CareerPredictionResult> {
    const prompt = `You are a Senior Indian Tech Career Counselor and Industry Placement Director.

Candidate Profile:
- Skills: ${JSON.stringify(input.skills)}
- Interests: ${JSON.stringify(input.interests || [])}
- Education/Program: ${input.program}
- NSQF Level: ${input.nsqfLevel || 4}
- Overall Competency Score: ${input.overallScore || 75}/100
- Location/State: ${input.state || 'Karnataka'}

Predict the top 2-3 most aligned, high-growth career trajectories in India (salaries clearly labeled as estimated model projections in INR).

Return ONLY valid JSON:
{
  "topCareerPaths": [
    {
      "title": "Role Title",
      "matchPercent": <0-100>,
      "salaryRange": "₹X,00,000 – ₹Y,00,000/year (Model Estimate)",
      "growth": "Exponential" | "High" | "Moderate" | "Stable",
      "requiredSkills": ["Skill 1", "Skill 2"],
      "missingSkills": ["Missing 1", "Missing 2"],
      "timeToAchieve": "e.g. 2-4 months",
      "roadmap": ["Step 1", "Step 2", "Step 3"],
      "reasoning": "Why this role matches candidate"
    }
  ],
  "aiExplanation": "2-sentence overview"
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an Indian tech career prediction expert. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 1200, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<CareerPredictionResult>(response, CareerPredictionSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('matchCareerPaths error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 6. Extract Skills from Raw Responses ───────────────────────────────────
  async extractSkills(responses: any[]): Promise<SkillScore[]> {
    if (!responses || responses.length === 0) return [];

    try {
      const prompt = `Analyze these student responses / submitted work and extract verified technical and problem-solving skills with scores (0-100).
Responses:
${JSON.stringify(responses.slice(0, 20))}

Return JSON object:
{
  "skills": [
    { "skillName": "JavaScript", "score": 85, "confidence": 0.9, "category": "technical", "evidence": "Correct async implementation" }
  ]
}`;

      const response = await this.chatWithFallback(
        [{ role: 'user', content: prompt }],
        { temperature: 0.2, max_tokens: 600, response_format: { type: 'json_object' } }
      );

      if (!response) return [];
      const parsed = JSON.parse(response);
      return Array.isArray(parsed.skills) ? parsed.skills : [];
    } catch (err: any) {
      logger.error('extractSkills error:', err.message);
      return [];
    }
  }

  // ── 7. Generate Adaptive Assessment Questions ─────────────────────────────
  async assessSkill(topic: string, level: string = 'Intermediate'): Promise<AssessmentGenerationResult> {
    const prompt = `Generate exactly 5 distinct multiple-choice questions assessing ${level} knowledge of "${topic}".
Each question must have 4 options prefixed with "A. ", "B. ", "C. ", "D. " and a single letter "correct" answer ("A", "B", "C", or "D").

Return ONLY valid JSON:
{
  "topic": "${topic}",
  "level": "${level}",
  "questions": [
    {
      "question": "Question text",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correct": "A",
      "explanation": "Brief explanation"
    }
  ]
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are a senior technical interviewer. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 1200, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<AssessmentGenerationResult>(response, AssessmentGenerationSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('assessSkill error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 8. Evaluate Assessment Responses ──────────────────────────────────────
  async evaluateSkill(
    topic: string,
    answers: { question: string; userAnswer: string; correctAnswer: string }[]
  ): Promise<AssessmentEvaluationResult> {
    const total = Math.max(1, answers.length);
    const correct = answers.filter(
      (a) => a.userAnswer?.toUpperCase().trim() === a.correctAnswer?.toUpperCase().trim()
    ).length;
    const score = Math.round((correct / total) * 100);
    const level = score >= 80 ? 'Advanced' : score >= 50 ? 'Intermediate' : 'Beginner';

    const prompt = `A student completed a ${topic} assessment scoring ${score}% (${correct}/${total} correct, ${level} tier).
Detailed Responses:
${JSON.stringify(answers)}

Provide diagnostic feedback tailored for Indian technology hiring.

Return ONLY valid JSON:
{
  "score": ${score},
  "correct": ${correct},
  "total": ${total},
  "level": "${level}",
  "weakAreas": ["Weak area 1", "Weak area 2"],
  "strengths": ["Strength 1", "Strength 2"],
  "improvementPlan": "2-3 actionable sentences",
  "nextSteps": ["Next step 1", "Next step 2", "Next step 3"]
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an empathetic yet rigorous technical assessor. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 700, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<AssessmentEvaluationResult>(response, AssessmentEvaluationSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('evaluateSkill error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 9. Research Industry Market Demand (Perplexity / Fallback) ────────────
  async researchIndustryDemand(domain: string): Promise<IndustryDemandResult> {
    const prompt = `Research current job market demand in India (2025-2026) for "${domain}" skills across top IT enterprises and startups.

Return ONLY valid JSON:
{
  "skill": "${domain}",
  "demandSummary": "2-3 concise sentences detailing market demand in India",
  "trendDirection": "rising" | "stable" | "declining",
  "topEmployers": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "avgSalaryRange": "₹X,00,000 – ₹Y,00,000 per annum (Estimated)",
  "trendingTopics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
  "jobCount": "Estimated number of active openings"
}`;

    try {
      // Use Perplexity if available, otherwise Groq/OpenAI
      const { content } = await providerManager.executeWithFallback(
        [{ role: 'user', content: prompt }],
        { temperature: 0.2, max_tokens: 600, response_format: { type: 'json_object' } },
        'Perplexity'
      );

      const parsed = parseAndValidateAIOutput<IndustryDemandResult>(content, IndustryDemandSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.warn('researchIndustryDemand error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 10. Generate Institutional Insight Summary ───────────────────────────
  async generateInsightSummary(context: string, dataSnippet: object): Promise<string> {
    const prompt = `Context: ${context}\nData: ${JSON.stringify(dataSnippet)}\nWrite a concise 2-sentence actionable insight in English for education leadership in India.`;

    try {
      const response = await this.chatWithFallback(
        [{ role: 'user', content: prompt }],
        { temperature: 0.4, max_tokens: 200 }
      );
      return response;
    } catch {
      return '';
    }
  }

  // ── 11. Test Connectivity & Provider Latency Diagnostics ──────────────────
  async testConnectivity(): Promise<Record<string, ProviderHealth>> {
    return providerManager.checkAllHealth();
  }
}

export const aiService = new AIService();
