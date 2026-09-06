/**
 * Ryyvora AI — Monorepo Master Verification Runner
 * Runs backend automated test suite (11/11 tests), frontend automated test suite (20/20 tests),
 * and frontend technical SEO validation (15/15 indexable routes).
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('⚡ Ryyvora AI — Platform-Wide Quality Verification');
console.log('====================================================\n');

function runStep(name, command, cwd) {
  console.log(`\n▶ [RUNNING] ${name}...`);
  console.log(`  $ ${command} (cwd: ${path.relative(rootDir, cwd) || '.'})\n`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log(`✔ [PASS] ${name}`);
  } catch (error) {
    console.error(`✖ [FAIL] ${name}`);
    process.exit(1);
  }
}

try {
  // 1. Backend Automated Tests (11 test suites)
  runStep('Backend Integration & AI Test Suites', 'npm test', path.join(rootDir, 'backend'));

  // 2. Frontend Automated Tests (20 contract & UI tests)
  runStep('Frontend Contracts & Navigation Invariants', 'npm test', path.join(rootDir, 'frontend'));

  // 3. Frontend Technical SEO Audit (15 public indexable pages)
  runStep('Frontend Technical SEO Verification', 'npm run test:seo', path.join(rootDir, 'frontend'));

  console.log('\n====================================================');
  console.log('🎉 ALL RYYVORA AI TEST SUITES & SEO VERIFICATIONS PASSED!');
  console.log('====================================================\n');
} catch (err) {
  console.error('\n❌ Platform verification failed:', err);
  process.exit(1);
}
