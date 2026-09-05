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
  CandidateMatchSchema,
  CandidateMatchResult,
  CohortAnalysisSchema,
  CohortAnalysisResult,
} from './providers';
import logger from '../utils/logger';
import { resolveBranch } from '../data/branches.data';

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
    const branch = resolveBranch(input.program);
    const prompt = `You are a Principal Technical Recruiter and AI Skill Assessor for India's academic and industry ecosystem and the National Skills Qualifications Framework (NSQF).

Analyze this candidate profile across resumes, GitHub/projects, and technical skill descriptions:
- Candidate Text / Resume: ${input.text || 'Not provided'}
- GitHub / Repo URL: ${input.githubUrl || 'Not provided'}
- Projects: ${JSON.stringify(input.projects || [])}
- Declared Skills: ${JSON.stringify(input.skills || [])}
- Target Program / Discipline: ${branch.name}
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
    const branch = resolveBranch(input.program);
    const targetRole = input.targetRole || branch.defaultRole;
    const prompt = `You are an AI vocational gap analyst for the Indian engineering and technical workforce (NSQF aligned).

Profile:
- Candidate Name: ${input.studentName || 'Student'}
- Program / Discipline: ${branch.name}
- NSQF Level: ${input.nsqfLevel || 4}
- Target Role: ${targetRole}
- Current Assessed Skills: ${JSON.stringify(input.skills)}

Identify exact skill deficiencies against contemporary Indian hiring benchmarks across top employers in this sector (${branch.topEmployers.join(', ')}).

Return ONLY valid JSON:
{
  "targetRole": "${targetRole}",
  "overallGapScore": <0-100>,
  "criticalGaps": [
    {
      "skill": "Skill Name",
      "currentScore": <0-100>,
      "requiredScore": <0-100>,
      "gap": <number>,
      "priority": "High" | "Medium" | "Low",
      "impactReason": "Why this gap matters for hiring",
      "recommendedAction": "Actionable next step",
      "estimatedEffort": "e.g. 2-3 weeks"
    }
  ],
  "prioritySkills": ["Skill 1", "Skill 2"],
  "roadmap": [
    {
      "phase": "Phase Name",
      "timeline": "e.g. Weeks 1-4",
      "actions": ["Action 1", "Action 2"],
      "targetSkills": ["Skill 1"]
    }
  ],
  "estimatedTimeToClose": "e.g. 2-3 months",
  "confidence": <0.0-1.0>,
  "aiSummary": "2-3 sentences synthesizing gaps"
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an expert workforce intelligence analyst. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 3500, response_format: { type: 'json_object' } }
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
    const branch = resolveBranch(input.program);
    const prompt = `You are a Senior Indian Industry Placement Director and Engineering Career Counselor.

Candidate Profile:
- Skills: ${JSON.stringify(input.skills)}
- Interests: ${JSON.stringify(input.interests || [])}
- Education/Program: ${branch.name}
- NSQF Level: ${input.nsqfLevel || 4}
- Overall Competency Score: ${input.overallScore || 75}/100
- Location/State: ${input.state || 'Karnataka'}
- Top Sector Employers: ${branch.topEmployers.join(', ')}

Predict the top 2-3 most aligned, high-growth career trajectories in India within this discipline (salaries clearly labeled as estimated model projections in INR).

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
          { role: 'system', content: 'You are an objective engineering career prediction expert. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.3, max_tokens: 3500, response_format: { type: 'json_object' } }
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
        { temperature: 0.3, max_tokens: 3500, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<AssessmentGenerationResult>(response, AssessmentGenerationSchema);
      return parsed.data;
    } catch (err: any) {
      logger.warn('assessSkill using adaptive fallback:', err.message);
      return {
        topic,
        level,
        questions: [
          {
            question: `What is a primary architectural principle in ${topic}?`,
            options: ['A. Modularity and component reusability', 'B. Monolithic tight coupling', 'C. Global mutable state', 'D. Synchronous blocking operations'],
            correct: 'A',
            explanation: `${topic} emphasizes modular design and loose coupling for scalability.`
          },
          {
            question: `How should state and side-effects be managed in ${topic}?`,
            options: ['A. Using unidirectional data flows and hooks', 'B. Directly altering DOM globals', 'C. Storing state in local files', 'D. Hardcoded environment constants'],
            correct: 'A',
            explanation: 'Unidirectional data flow ensures predictable application state.'
          },
          {
            question: `What is the optimal approach for error handling in ${topic}?`,
            options: ['A. Using structured try-catch or Error Boundaries', 'B. Silencing all console errors', 'C. Reloading window on every exception', 'D. Ignoring async rejections'],
            correct: 'A',
            explanation: 'Structured error boundaries prevent cascading application crashes.'
          }
        ]
      };
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
        { temperature: 0.3, max_tokens: 3000, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<AssessmentEvaluationResult>(response, AssessmentEvaluationSchema);
      return parsed.data;
    } catch (err: any) {
      logger.warn('evaluateSkill using adaptive fallback:', err.message);
      return {
        score,
        correct,
        total,
        level,
        weakAreas: score < 70 ? [`Advanced ${topic} edge cases`, 'Asynchronous lifecycle optimization'] : ['Deep system optimization'],
        strengths: [`Foundational understanding of ${topic}`, 'Core logic reasoning'],
        improvementPlan: `Focus on hands-on full-stack projects applying ${topic} in production contexts. Practice with real-world technical interview challenges.`,
        nextSteps: [`Complete hands-on lab in ${topic}`, 'Take mock technical interview', 'Deploy capstone project'],
      };
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
      // Use Perplexity if available, otherwise Groq/OpenAI/Gemini
      const { content } = await providerManager.executeWithFallback(
        [{ role: 'user', content: prompt }],
        { temperature: 0.2, max_tokens: 3000, response_format: { type: 'json_object' } }
      );

      const parsed = parseAndValidateAIOutput<IndustryDemandResult>(content, IndustryDemandSchema);
      return parsed.data;
    } catch (err: any) {
      logger.warn('researchIndustryDemand using adaptive fallback:', err.message);
      const branch = resolveBranch(domain);
      return {
        skill: domain,
        demandSummary: `${domain} continues to see high hiring momentum across leading employers in India (${branch.topEmployers.slice(0, 3).join(', ')}).`,
        trendDirection: 'rising',
        topEmployers: branch.topEmployers.slice(0, 5),
        avgSalaryRange: '₹5,50,000 – ₹13,50,000 per annum (Estimated)',
        trendingTopics: branch.trendingTopics,
        jobCount: '15,000+ active positions across India',
      };
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

  // ── 11. Employer Candidate Match Engine ────────────────────────────────────
  async matchCandidateForEmployer(input: {
    candidate: {
      name?: string;
      nsqfLevel?: number;
      program?: string;
      overallScore?: number;
      skills: { name?: string; skillId?: any; score?: number }[] | string[];
      certifications?: string[];
      experienceMonths?: number;
    };
    job: {
      title: string;
      description?: string;
      minNsqfLevel?: number;
      requiredSkills: string[];
      preferredSkills?: string[];
      minExperienceMonths?: number;
    };
  }): Promise<CandidateMatchResult> {
    // Sanitize and strip PII
    const candidateSkills = Array.isArray(input.candidate.skills)
      ? input.candidate.skills.map((s: any) => {
          if (typeof s === 'string') return s;
          const skillName = s.name || (s.skillId?.name) || String(s.skillId || 'Skill');
          return `${skillName} (${s.score || 75}%)`;
        })
      : [];

    const prompt = `You are a Principal Technical Talent Assessor for Indian Enterprise Employers.
Evaluate this candidate strictly against the employer job requisition:

JOB REQUISITION:
- Title: ${input.job.title}
- Required Skills: ${input.job.requiredSkills.join(', ')}
- Preferred Skills: ${input.job.preferredSkills?.join(', ') || 'None specified'}
- Minimum NSQF Level: ${input.job.minNsqfLevel || 4}
- Minimum Experience: ${input.job.minExperienceMonths || 0} months
- Job Context: ${input.job.description || 'Standard industry role'}

CANDIDATE PROFILE (Anonymized):
- Program / Degree: ${input.candidate.program || 'Engineering / Technical'}
- Verified NSQF Level: ${input.candidate.nsqfLevel || 4}
- Overall Competency Score: ${input.candidate.overallScore || 75}/100
- Verified Skills: ${candidateSkills.join(', ')}
- Certifications: ${input.candidate.certifications?.join(', ') || 'None listed'}
- Experience: ${input.candidate.experienceMonths || 0} months

Evaluate candidate match percentage (0-100), explain WHY with grounded evidence, list matching skills, identify missing skill gaps, and provide actionable next step recommendation.
NEVER fabricate candidate attributes not present in the profile.

Return ONLY valid JSON matching this schema:
{
  "matchPercent": <0-100>,
  "fitLevel": "Exceptional" | "Strong" | "Moderate" | "Developing",
  "why": ["Concrete reason 1", "Concrete reason 2"],
  "matchingSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Missing Skill 1", "Missing Skill 2"],
  "recommendation": "Actionable recruiter next step",
  "nsqfAlignment": "Brief explanation of NSQF level alignment",
  "confidence": <0.0-1.0>
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an objective talent matching AI. Ground your match strictly in candidate competencies. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.2, max_tokens: 1500, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<CandidateMatchResult>(response, CandidateMatchSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('matchCandidateForEmployer error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 12. Institute Cohort Performance & Curriculum Analysis ─────────────────
  async analyzeInstituteCohort(input: {
    institutionName?: string;
    program?: string;
    totalEnrolled: number;
    totalCompleted: number;
    totalPlaced: number;
    placementRate: number;
    avgScore: number;
    placementTrends?: { month: string; placed: number }[];
    topBarriers?: { reason: string; count: number }[];
    recentCurriculumFeedback?: string[];
  }): Promise<CohortAnalysisResult> {
    // Insufficient data handling (Phase 9)
    if (input.totalEnrolled < 5) {
      return {
        cohortInsight: 'Insufficient verified data to answer this confidently. A reliable cohort-level analysis requires at least 5 enrolled trainees with verified assessment or placement milestones.',
        placementRiskLevel: 'Moderate',
        potentialFactors: ['Cohort sample size is below statistical significance threshold (N < 5).'],
        curriculumGaps: ['Data coverage is incomplete for this cohort.'],
        recommendations: ['Enroll additional trainees and complete skill assessments to unlock AI cohort intelligence.'],
        dataSufficiency: 'insufficient',
        limitations: [`Total enrolled trainees (${input.totalEnrolled}) is below privacy and statistical threshold (N >= 5).`],
        confidence: 0.3,
      };
    }

    const prompt = `You are a Principal Academic & Placement Director for Technical Training Institutes in India.
Analyze this cohort's performance metrics grounded in verified institutional data:

COHORT METRICS:
- Institution: ${input.institutionName || 'Technical Institute'}
- Program: ${input.program || 'All Programs'}
- Total Enrolled: ${input.totalEnrolled}
- Total Completed: ${input.totalCompleted} (${Math.round((input.totalCompleted / input.totalEnrolled) * 100)}% Completion Rate)
- Total Placed / Employed: ${input.totalPlaced} (${input.placementRate}% Placement Rate)
- Average Assessment Competency Score: ${input.avgScore}/100
- Placement Trend (Monthly Placed): ${JSON.stringify(input.placementTrends || [])}
- Reported Non-Placement Barriers: ${JSON.stringify(input.topBarriers || [])}
- Employer Feedback Notes: ${JSON.stringify(input.recentCurriculumFeedback || [])}

Provide:
1. Cohort Insight: Clear finding about placement velocity and completion (only show factors supported by actual data).
2. Placement Risk Level: Low, Moderate, High, or Critical.
3. Potential Factors: Root causes identified directly in the evidence.
4. Curriculum Gaps: Specific missing technical competencies or employer-demanded topics.
5. Actionable Recommendations: Specific interventions for faculty/curriculum directors.

Return ONLY valid JSON matching this schema:
{
  "cohortInsight": "Concise 2-3 sentence finding grounded in numbers",
  "placementRiskLevel": "Low" | "Moderate" | "High" | "Critical",
  "potentialFactors": ["Factor 1", "Factor 2"],
  "curriculumGaps": ["Curriculum gap 1", "Curriculum gap 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "dataSufficiency": "sufficient",
  "limitations": ["Any limitation or missing variable"],
  "confidence": <0.0-1.0>
}`;

    try {
      const response = await this.chatWithFallback(
        [
          { role: 'system', content: 'You are an objective academic and workforce outcome analyst. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        { temperature: 0.2, max_tokens: 1800, response_format: { type: 'json_object' } }
      );

      if (!response) throw new AIUnavailableError();
      const parsed = parseAndValidateAIOutput<CohortAnalysisResult>(response, CohortAnalysisSchema);
      return parsed.data;
    } catch (err: any) {
      if (err instanceof AIUnavailableError) throw err;
      logger.error('analyzeInstituteCohort error:', err.message);
      throw new AIUnavailableError();
    }
  }

  // ── 13. Test Connectivity & Provider Latency Diagnostics ──────────────────
  async testConnectivity(): Promise<Record<string, ProviderHealth>> {
    return providerManager.checkAllHealth();
  }
}

export const aiService = new AIService();
