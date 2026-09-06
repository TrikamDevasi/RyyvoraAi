import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getPlans,
  getSubscription,
  checkout,
  changePlan,
  cancelSubscription,
  resumeSubscription,
  getUsage,
  handleWebhook,
} from '../controllers/billing.controller';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

/** GET /api/v1/billing/plans — plan catalog (no auth required) */
router.get('/plans', getPlans);

/** POST /api/v1/billing/webhook — provider webhook (no auth, signature-verified) */
router.post('/webhook', handleWebhook);

// ─── Authenticated Routes ─────────────────────────────────────────────────────

/** GET /api/v1/billing/subscription — get current user's subscription + usage */
router.get('/subscription', protect, getSubscription);

/** GET /api/v1/billing/usage — get current period usage and limits */
router.get('/usage', protect, getUsage);

/** POST /api/v1/billing/checkout — initiate checkout (plan + billingCycle only — NO price from client) */
router.post('/checkout', protect, checkout);

/** POST /api/v1/billing/change-plan — change plan/cycle on existing subscription */
router.post('/change-plan', protect, changePlan);

/** POST /api/v1/billing/cancel — schedule cancellation at period end */
router.post('/cancel', protect, cancelSubscription);

/** POST /api/v1/billing/resume — reverse a pending cancellation */
router.post('/resume', protect, resumeSubscription);

export default router;
