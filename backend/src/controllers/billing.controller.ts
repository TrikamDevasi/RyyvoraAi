import { Request, Response } from 'express';
import { z } from 'zod';
import { billingService } from '../services/billing.service';
import { entitlementService } from '../services/entitlement.service';
import { getAllPlans } from '../config/plans';
import Subscription from '../models/Subscription.model';
import UsageRecord from '../models/UsageRecord.model';
import { UserRole } from '../types';
import logger from '../utils/logger';
import env from '../config/env';

// ─── Input Validation Schemas ─────────────────────────────────────────────────

const checkoutSchema = z.object({
  plan: z.enum(['free', 'starter', 'growth', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
});

const changePlanSchema = z.object({
  plan: z.enum(['free', 'starter', 'growth', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
});

// ─── GET /billing/plans (public) ──────────────────────────────────────────────

export const getPlans = (_req: Request, res: Response): void => {
  const plans = getAllPlans();
  res.json({
    success: true,
    data: {
      plans,
      billingMode: env.BILLING_MODE ?? 'demo',
      isDemoMode: (env.BILLING_MODE ?? 'demo') === 'demo',
    },
    message: 'Plan catalog retrieved successfully',
  });
};

// ─── GET /billing/subscription ────────────────────────────────────────────────

export const getSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = String(req.user!._id);
    const userRole = req.user!.role as UserRole;

    const [sub, entitlements] = await Promise.all([
      billingService.getOrCreateSubscription(userId),
      entitlementService.getEntitlements(userId, userRole),
    ]);

    // Current period usage summary
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const usageDoc = await UsageRecord.findOne({ userId, period });

    res.json({
      success: true,
      data: {
        subscription: {
          plan: sub.plan,
          status: sub.status,
          billingCycle: sub.billingCycle,
          provider: sub.provider,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          activatedAt: sub.activatedAt,
        },
        entitlements: {
          bypassedByRole: entitlements.bypassedByRole,
          limits: entitlements.limits,
        },
        usage: {
          period,
          aiRequests: usageDoc?.aiRequests ?? 0,
          traineesCreated: usageDoc?.traineesCreated ?? 0,
          assessmentsRun: usageDoc?.assessmentsRun ?? 0,
          outcomeRecords: usageDoc?.outcomeRecords ?? 0,
          employerVerifications: usageDoc?.employerVerifications ?? 0,
          reportsGenerated: usageDoc?.reportsGenerated ?? 0,
        },
        isDemoMode: (env.BILLING_MODE ?? 'demo') === 'demo',
      },
      message: 'Subscription retrieved',
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    logger.error('[BILLING] getSubscription error:', err);
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── POST /billing/checkout ───────────────────────────────────────────────────

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid request body',
        error: parsed.error.format(),
      });
      return;
    }

    const { plan, billingCycle } = parsed.data;
    const userId = String(req.user!._id);

    // SECURITY: Price is NEVER accepted from client.
    // Server reads price from plans.ts config.
    const result = await billingService.checkout(userId, plan, billingCycle);

    if (!result.success) {
      res.status(400).json({ success: false, data: null, message: result.message });
      return;
    }

    res.json({
      success: true,
      data: {
        subscriptionId: result.subscriptionId,
        demoMode: result.demoMode,
        redirectUrl: result.redirectUrl ?? null,
      },
      message: result.message,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Checkout failed';
    logger.error('[BILLING] checkout error:', err);
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── POST /billing/change-plan ────────────────────────────────────────────────

export const changePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = changePlanSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, data: null, message: 'Invalid request body' });
      return;
    }

    const { plan, billingCycle } = parsed.data;
    const userId = String(req.user!._id);

    const result = await billingService.changePlan(userId, plan, billingCycle);
    res.json({
      success: result.success,
      data: result.success ? { previousPlan: result.previousPlan, newPlan: result.newPlan } : null,
      message: result.message,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Plan change failed';
    logger.error('[BILLING] changePlan error:', err);
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── POST /billing/cancel ─────────────────────────────────────────────────────

export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = String(req.user!._id);

    // Cannot cancel a free plan
    const sub = await Subscription.findOne({ userId });
    if (!sub || sub.plan === 'free') {
      res.status(400).json({ success: false, data: null, message: 'No paid subscription to cancel.' });
      return;
    }

    const result = await billingService.cancelSubscription(userId);
    res.json({
      success: result.success,
      data: result.success ? {
        cancelAtPeriodEnd: result.cancelAtPeriodEnd,
        currentPeriodEnd: result.currentPeriodEnd,
      } : null,
      message: result.message,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Cancellation failed';
    logger.error('[BILLING] cancel error:', err);
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── POST /billing/resume ─────────────────────────────────────────────────────

export const resumeSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = String(req.user!._id);

    const sub = await Subscription.findOne({ userId });
    if (!sub?.cancelAtPeriodEnd) {
      res.status(400).json({ success: false, data: null, message: 'No pending cancellation to reverse.' });
      return;
    }

    const result = await billingService.resumeSubscription(userId);
    res.json({ success: result.success, data: null, message: result.message });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Resume failed';
    logger.error('[BILLING] resume error:', err);
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── GET /billing/usage ───────────────────────────────────────────────────────

export const getUsage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = String(req.user!._id);
    const userRole = req.user!.role as UserRole;
    const entitlements = await entitlementService.getEntitlements(userId, userRole);

    res.json({
      success: true,
      data: {
        plan: entitlements.plan,
        bypassedByRole: entitlements.bypassedByRole,
        usage: entitlements.currentUsage,
        limits: entitlements.limits,
        periodEnd: entitlements.periodEnd,
      },
      message: 'Usage retrieved',
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Usage retrieval failed';
    res.status(500).json({ success: false, data: null, message: error });
  }
};

// ─── POST /billing/webhook ────────────────────────────────────────────────────
// In demo mode: always returns 200 OK (no real events).
// In production: verifies provider signature before processing.
// Includes idempotency: duplicate event IDs are acknowledged but not re-processed.

// In-memory idempotency store for webhook events (resets on server restart, acceptable for demo)
const processedWebhookEvents = new Map<string, number>();
const WEBHOOK_EVENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanupOldWebhookEvents(): void {
  const now = Date.now();
  for (const [eventId, timestamp] of processedWebhookEvents) {
    if (now - timestamp > WEBHOOK_EVENT_TTL_MS) {
      processedWebhookEvents.delete(eventId);
    }
  }
}

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-billing-signature'] as string ?? '';
    const payload = JSON.stringify(req.body);

    const isValid = billingService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      logger.warn('[BILLING] Webhook rejected: invalid signature');
      res.status(401).json({ success: false, data: null, message: 'Invalid webhook signature' });
      return;
    }

    // Idempotency: check if this event was already processed
    const eventId = req.body?.id || req.body?.event_id || req.body?.eventId;
    if (eventId && typeof eventId === 'string') {
      // Cleanup old events periodically
      if (processedWebhookEvents.size > 1000) cleanupOldWebhookEvents();

      if (processedWebhookEvents.has(eventId)) {
        logger.info(`[BILLING] Duplicate webhook event acknowledged: ${eventId}`);
        res.json({ success: true, data: null, message: 'Event already processed' });
        return;
      }
      processedWebhookEvents.set(eventId, Date.now());
    }

    // In demo mode: just acknowledge
    logger.info('[BILLING] Webhook received and acknowledged');
    res.json({ success: true, data: null, message: 'Webhook received' });
  } catch (err: unknown) {
    logger.error('[BILLING] webhook error:', err);
    res.status(500).json({ success: false, data: null, message: 'Webhook processing failed' });
  }
};
