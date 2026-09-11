import assert from 'assert';
import http from 'http';
import app from '../src/app';
import { getCandidateBenchmark, getAnalyzerFallback } from '../../frontend/lib/analyzerFallback';

export async function runSkillAnalyzerTests(): Promise<void> {
  console.log('🧪 Running AI Skill Analyzer, Resume Parsing & Passport Issuance Tests...');

  // ── 1. Dynamic Benchmark Calculation Tests ─────────────────────────────────
  const elite = getCandidateBenchmark(95);
  assert.strictEqual(elite.badgeLabel, 'ELITE TIER');
  assert.ok(elite.percentileText.includes('Top 3% Nationwide'));

  const industryReady = getCandidateBenchmark(84);
  assert.strictEqual(industryReady.badgeLabel, 'INDUSTRY READY');
  assert.ok(industryReady.percentileText.includes('Top 12% Nationwide'));

  const foundation = getCandidateBenchmark(72);
  assert.strictEqual(foundation.badgeLabel, 'FOUNDATION LEVEL');
  assert.ok(foundation.percentileText.includes('Top 35% Nationwide'));

  const emerging = getCandidateBenchmark(52);
  assert.strictEqual(emerging.badgeLabel, 'EMERGING TALENT');
  assert.ok(emerging.percentileText.includes('Emerging Trainee'));

  // Edge cases: null, undefined, clamped invalid values
  const nullScore = getCandidateBenchmark(null);
  assert.strictEqual(nullScore.badgeLabel, 'UNBENCHMARKED');

  const clampedHigh = getCandidateBenchmark(140);
  assert.strictEqual(clampedHigh.badgeLabel, 'ELITE TIER');

  const clampedLow = getCandidateBenchmark(-20);
  assert.strictEqual(clampedLow.badgeLabel, 'EMERGING TALENT');

  console.log('  ✅ Dynamic candidate benchmark derivation & safe clamping passed');

  // ── 2. Precomputed Fallback Datasets across 5 Engineering Disciplines ───────
  const branches = ['cse', 'mechanical', 'electronics', 'electrical', 'civil'];
  for (const b of branches) {
    const fallback = getAnalyzerFallback(b);
    assert.ok(fallback.overallScore >= 0 && fallback.overallScore <= 100);
    assert.strictEqual(fallback.isFallback, true);
    assert.ok(Array.isArray(fallback.radarData) && fallback.radarData.length === 6);
    assert.ok(Array.isArray(fallback.technicalSkills) && fallback.technicalSkills.length > 0);
    assert.ok(Array.isArray(fallback.competencies) && fallback.competencies.length > 0);
    assert.ok(fallback.passportHash.startsWith('0x'));
  }
  console.log('  ✅ Precomputed NSQF fallback datasets verified across all 5 engineering branches');

  // ── 3. Server-side Endpoints (via Native HTTP Server) ───────────────────────
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 3a. Resume Document Parsing: Unsupported File Type Rejection
    const badFormData = new FormData();
    badFormData.append('resume', new Blob(['console.log("bad")'], { type: 'application/x-msdownload' }), 'virus.exe');

    const badFileRes = await fetch(`${baseUrl}/api/v1/ai/parse-resume`, {
      method: 'POST',
      body: badFormData,
    });
    assert.strictEqual(badFileRes.status, 400);
    const badBody: any = await badFileRes.json();
    assert.ok(badBody.message.includes('Unsupported file type'));

    // 3b. Resume Document Parsing: Valid Text/Markdown Extraction
    const sampleResumeText = `John Doe - Senior Software Engineer
Skills: TypeScript, Node.js, Next.js, Redis, PostgreSQL, Docker.
Experience: 3 years building scalable distributed microservices and low-latency APIs.`;

    const txtFormData = new FormData();
    txtFormData.append('resume', new Blob([sampleResumeText], { type: 'text/plain' }), 'resume.txt');

    const txtRes = await fetch(`${baseUrl}/api/v1/ai/parse-resume`, {
      method: 'POST',
      body: txtFormData,
    });

    assert.strictEqual(txtRes.status, 200);
    const txtBody: any = await txtRes.json();
    assert.strictEqual(txtBody.success, true);
    assert.ok(txtBody.data.text.includes('John Doe'));
    assert.ok(txtBody.data.wordCount >= 10);
    assert.strictEqual(txtBody.data.fileType, 'TXT');

    console.log('  ✅ Document parsing security validation & text extraction passed');

    // 3c. GitHub Repository Inspection
    const ghBadUrl = await fetch(`${baseUrl}/api/v1/ai/github-repo?url=https://gitlab.com/not-github/repo`);
    assert.strictEqual(ghBadUrl.status, 400);

    const ghValidUrl = await fetch(`${baseUrl}/api/v1/ai/github-repo?url=https://github.com/facebook/react`);
    assert.strictEqual(ghValidUrl.status, 200);
    const ghBody: any = await ghValidUrl.json();
    assert.strictEqual(ghBody.success, true);
    assert.ok(ghBody.data.name.toLowerCase().includes('react'));

    console.log('  ✅ Server-side GitHub repository inspection & fallback routing passed');

    // 3d. Skill Passport Issuance Guard
    const unauthPassport = await fetch(`${baseUrl}/api/v1/students/passport/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluationResult: { overallScore: 85 } }),
    });
    assert.strictEqual(unauthPassport.status, 401);

    console.log('  ✅ Skill Passport authenticated issuance & route guards passed');
  } finally {
    server.close();
  }
}
