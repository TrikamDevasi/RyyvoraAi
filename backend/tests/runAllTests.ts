import dotenv from 'dotenv';
dotenv.config();

import { runAuthTests } from './auth.test';
import { runAuthorizationTests } from './authorization.test';
import { runFairnessTests } from './fairness.test';
import { runIntegrationTests } from './integration.test';
import { runAITests } from './ai.test';
import { runOutcomeTests } from './outcome.test';
import { runEmployerVerificationTests } from './employerVerification.test';
import { runPolicyCopilotTests } from './policyCopilot.test';
import { runBillingTests } from './billing.test';
import { runSecurityTests } from './security.test';
import { runInstituteE2ETests } from './instituteE2E.test';

async function main() {
  console.log('====================================================');
  console.log('🚀 Ryyvora AI Backend Automated Test Runner');
  console.log('====================================================\n');

  try {
    await runAuthTests();
    console.log('');
    await runAuthorizationTests();
    console.log('');
    await runFairnessTests();
    console.log('');
    await runAITests();
    console.log('');
    await runOutcomeTests();
    console.log('');
    await runEmployerVerificationTests();
    console.log('');
    await runPolicyCopilotTests();
    console.log('');
    await runBillingTests();
    console.log('');
    await runSecurityTests();
    console.log('');
    await runInstituteE2ETests();
    console.log('');
    await runIntegrationTests();
    console.log('');
    console.log('====================================================');
    console.log('🎉 ALL AUTOMATED INTEGRATION, UNIT & AI TESTS PASSED! (11/11)');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failure:', error);
    process.exit(1);
  }
}


main();
