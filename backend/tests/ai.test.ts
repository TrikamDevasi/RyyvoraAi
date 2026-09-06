// backend/tests/ai.test.ts
import assert from 'assert';
import {
  providerManager,
  parseAndValidateAIOutput,
  extractJsonString,
  SkillAnalysisSchema,
  CareerPredictionSchema,
  GapAnalysisSchema,
  AssessmentGenerationSchema,
  AssessmentEvaluationSchema,
} from '../src/services/providers';
import { aiService } from '../src/services/ai.service';

export async function runAITests(): Promise<void> {
  console.log('🧪 Running AI Provider, Schemas & Service Tests...');

  // 1. Provider Manager Registration
  const providers = providerManager.getProviders();
  assert(providers.length >= 3, 'Must have at least Groq, OpenAI, and Perplexity registered');
  const names = providers.map((p) => p.name);
  assert(names.includes('Groq'), 'Groq provider must be registered');
  assert(names.includes('OpenAI'), 'OpenAI provider must be registered');
  assert(names.includes('Perplexity'), 'Perplexity provider must be registered');
  console.log('  ✅ AI Provider hierarchy registered (Groq, OpenAI, Perplexity)');

  // 2. Safe JSON Extraction & Markdown Fence Stripping
  const rawWithFences = 'Here is the result:\n```json\n{\n  "overallScore": 85,\n  "experienceLevel": "Advanced"\n}\n```\nHope that helps!';
  const extracted = extractJsonString(rawWithFences);
  assert(extracted.startsWith('{') && extracted.endsWith('}'), 'Extracted JSON must be bounded by curly braces');
  assert(JSON.parse(extracted).overallScore === 85, 'Parsed extracted JSON must contain correct values');
  console.log('  ✅ Markdown code fence extraction & stripping passed');

  // 3. Trailing Comma Cleanup in LLM responses
  const rawWithTrailingComma = '{\n  "overallScore": 90,\n  "experienceLevel": "Expert",\n}';
  const cleaned = extractJsonString(rawWithTrailingComma);
  const parsedCleaned = JSON.parse(cleaned);
  assert.strictEqual(parsedCleaned.overallScore, 90, 'Trailing comma must be removed for standard JSON.parse');
  console.log('  ✅ Trailing comma cleanup passed');

  // 4. Strict Zod Schema Validation & Safe Repair (SkillAnalysisSchema)
  const sampleSkillOutput = JSON.stringify({
    overallScore: 88,
    confidence: 0.95,
    experienceLevel: 'Advanced',
    technicalSkills: [
      { name: 'TypeScript', score: 92, category: 'technical', confidence: 0.95, evidence: 'Strict typing and generics' },
      { name: 'Express.js', score: 85, category: 'technical', confidence: 0.9, evidence: 'REST API routing' },
    ],
    softSkills: [{ name: 'Problem Solving', score: 90, category: 'soft', confidence: 0.9, evidence: 'Clean algorithms' }],
    competencies: [{ category: 'Software Architecture', score: 86, description: 'Modular designs' }],
    strengths: ['Strong type-safe backend design'],
    weaknesses: ['Distributed caching with Redis'],
    recommendations: ['Build microservice pub/sub pipeline'],
    summary: 'Strong advanced candidate.',
  });

  const validatedSkill = parseAndValidateAIOutput(sampleSkillOutput, SkillAnalysisSchema);
  assert(validatedSkill.success, 'Valid skill analysis payload must pass Zod validation');
  assert.strictEqual(validatedSkill.data.overallScore, 88);
  assert.strictEqual(validatedSkill.data.technicalSkills.length, 2);
  console.log('  ✅ SkillAnalysisSchema Zod validation passed');

  // 5. Career Prediction Schema Validation
  const sampleCareerOutput = JSON.stringify({
    topCareerPaths: [
      {
        title: 'Full-Stack Software Engineer',
        matchPercent: 94,
        salaryRange: '₹8,00,000 – ₹16,00,000/year (Model Estimate)',
        growth: 'High',
        requiredSkills: ['TypeScript', 'Node.js', 'React'],
        missingSkills: ['Kubernetes'],
        timeToAchieve: '2 months',
        roadmap: ['Deploy containerized SaaS app'],
        reasoning: 'Matches full-stack profile',
      },
    ],
    aiExplanation: 'Excellent alignment with software engineering trajectory.',
  });

  const validatedCareer = parseAndValidateAIOutput(sampleCareerOutput, CareerPredictionSchema);
  assert(validatedCareer.success, 'Valid career prediction payload must pass Zod validation');
  assert.strictEqual(validatedCareer.data.topCareerPaths[0].matchPercent, 94);
  console.log('  ✅ CareerPredictionSchema Zod validation passed');

  // 6. Skill Gap Schema Validation
  const sampleGapOutput = JSON.stringify({
    targetRole: 'Cloud Solutions Architect',
    overallGapScore: 30,
    criticalGaps: [
      {
        skill: 'Terraform IaC',
        currentScore: 50,
        requiredScore: 85,
        gap: 35,
        priority: 'High',
        impactReason: 'Infrastructure automation requirement',
        recommendedAction: 'Write multi-tier cloud deployment scripts',
        estimatedEffort: '2 weeks',
      },
    ],
    prioritySkills: ['Terraform', 'Kubernetes'],
    roadmap: [
      {
        phase: 'Phase 1: Cloud Provisioning',
        timeline: 'Weeks 1-2',
        actions: ['Complete Terraform AWS modules'],
        targetSkills: ['Terraform'],
      },
    ],
    estimatedTimeToClose: '2 months',
    confidence: 0.9,
    aiSummary: 'Solid base, requires cloud infrastructure upskilling.',
  });

  const validatedGap = parseAndValidateAIOutput(sampleGapOutput, GapAnalysisSchema);
  assert(validatedGap.success, 'Valid skill gap payload must pass Zod validation');
  assert.strictEqual(validatedGap.data.overallGapScore, 30);
  console.log('  ✅ GapAnalysisSchema Zod validation passed');

  // 7. Assessment Generation Schema Validation
  const sampleQuizOutput = JSON.stringify({
    topic: 'TypeScript',
    level: 'Intermediate',
    questions: [
      {
        question: 'What is the key advantage of TypeScript over vanilla JavaScript?',
        options: ['A. Compile-time static type checking', 'B. Slower execution', 'C. No functions', 'D. No arrays'],
        correct: 'A',
        explanation: 'Static type checking catches errors before runtime.',
      },
    ],
  });

  const validatedQuiz = parseAndValidateAIOutput(sampleQuizOutput, AssessmentGenerationSchema);
  assert(validatedQuiz.success, 'Valid quiz generation output must pass Zod validation');
  assert.strictEqual(validatedQuiz.data.questions[0].correct, 'A');
  console.log('  ✅ AssessmentGenerationSchema Zod validation passed');

  // 8. Assessment Evaluation Schema Validation
  const sampleEvalOutput = JSON.stringify({
    score: 80,
    correct: 4,
    total: 5,
    level: 'Advanced',
    weakAreas: ['Edge-case type narrowing'],
    strengths: ['Generics and interface composition'],
    improvementPlan: 'Practice advanced conditional types and mapped types.',
    nextSteps: ['Complete practical project', 'Add verified score to Skill Passport'],
  });

  const validatedEval = parseAndValidateAIOutput(sampleEvalOutput, AssessmentEvaluationSchema);
  assert(validatedEval.success, 'Valid evaluation output must pass Zod validation');
  assert.strictEqual(validatedEval.data.score, 80);
  console.log('  ✅ AssessmentEvaluationSchema Zod validation passed');

  // 9. Honesty contract: invalid/unavailable AI output must fail loudly, never fabricate
  assert.throws(
    () => parseAndValidateAIOutput('this is not valid json', SkillAnalysisSchema),
    /Invalid JSON/,
    'Unparseable AI output must throw when no fallback is supplied'
  );
  assert.throws(
    () => parseAndValidateAIOutput('{"overallScore": "nope"}', SkillAnalysisSchema),
    /Schema validation failed/,
    'Schema-invalid AI output must throw when no fallback is supplied'
  );
  assert.throws(
    () => parseAndValidateAIOutput('', SkillAnalysisSchema),
    /Schema validation failed/,
    'Empty AI output must not be served as a fabricated analysis'
  );
  console.log('  ✅ No fabricated AI fallbacks: invalid/unavailable AI output throws honestly');

  // 10. AI Health Telemetry Reporting
  const healthReport = await aiService.testConnectivity();
  assert(healthReport.groq !== undefined, 'Health report must include Groq');
  assert(healthReport.openai !== undefined, 'Health report must include OpenAI');
  assert(healthReport.perplexity !== undefined, 'Health report must include Perplexity');
  console.log('  ✅ AIService.testConnectivity reports all 3 provider telemetries');
}
