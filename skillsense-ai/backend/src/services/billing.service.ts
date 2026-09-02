/**
 * SkillSense AI — Billing Service
 *
 * Provider-agnostic billing layer. Swap the DemoBillingProvider for a
 * RazorpayBillingProvider (or StripeBillingProvider) without touching
 * any controller or route code.
 *
 * BILLING_MODE env variable controls which provider is active:
 *   demo     → DemoBillingProvider (default, no real payment)
 *   razorpay → RazorpayBillingProvider (requires keys — not yet implemented)
 *   stripe   → StripeBillingProvider (requires keys — not yet implemented)
 */

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Subscription, { ISubscription, BillingProvider } from '../models/Subscription.model';
import { PlanId, BillingCycle, getPlan } from '../config/plans';
import env from '../config/env';
import logger from '../utils/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckoutResult {
  success: boolean;
  subscriptionId: string;
  demoMode: boolean;
  redirectUrl?: string;  // For real providers: redirect to payment page
  message: string;
}

export interface ChangePlanResult {
  success: boolean;
  previousPlan: PlanId;
  newPlan: PlanId;
  message: string;
}

export interface CancelResult {
  success: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date;
  message: string;
}

// ─── Provider Interface ───────────────────────────────────────────────────────

interface IBillingProvider {
  name: BillingProvider;
  createSubscription(userId: string, plan: PlanId, cycle: BillingCycle): Promise<CheckoutResult>;
  changePlan(userId: string, newPlan: PlanId, newCycle: BillingCycle): Promise<ChangePlanResult>;
  cancelSubscription(userId: string): Promise<CancelResult>;
  resumeSubscription(userId: string): Promise<{ success: boolean; message: string }>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

// ─── Demo Billing Provider ────────────────────────────────────────────────────
// No real payment is charged. Subscription state is stored normally in MongoDB.
// This is clearly labelled in the UI and API responses via demoMode: true.

class DemoBillingProvider implements IBillingProvider {
  name: BillingProvider = 'demo';

  async createSubscription(
    userId: string,
    plan: PlanId,
    cycle: BillingCycle
  ): Promise<CheckoutResult> {
    const planDef = getPlan(plan);
    const now = new Date();
    const periodEnd = this._calcPeriodEnd(now, cycle);
    const demoSubscriptionId = `demo_sub_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

    // Upsert: one subscription per user
    await Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        userId: new mongoose.Types.ObjectId(userId),
        plan,
        status: 'active',
        billingCycle: cycle,
        provider: 'demo',
        providerCustomerId: `demo_cus_${userId.slice(-8)}`,
        providerSubscriptionId: demoSubscriptionId,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        activatedAt: now,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    logger.info(`[DEMO_BILLING] Subscription activated: userId=${userId} plan=${plan} cycle=${cycle}`);

    return {
      success: true,
      subscriptionId: demoSubscriptionId,
      demoMode: true,
      message: `[Demo] Successfully subscribed to ${planDef.name} (${cycle}). No real payment was charged.`,
    };
  }

  async changePlan(
    userId: string,
    newPlan: PlanId,
    newCycle: BillingCycle
  ): Promise<ChangePlanResult> {
    const existing = await Subscription.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    const previousPlan: PlanId = (existing?.plan as PlanId) ?? 'free';

    const now = new Date();
    const periodEnd = this._calcPeriodEnd(now, newCycle);

    await Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        plan: newPlan,
        billingCycle: newCycle,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
      { upsert: true, new: true }
    );

    logger.info(`[DEMO_BILLING] Plan changed: userId=${userId} ${previousPlan} → ${newPlan}`);

    return {
      success: true,
      previousPlan,
      newPlan,
      message: `[Demo] Plan changed from ${previousPlan} to ${newPlan}.`,
    };
  }

  async cancelSubscription(userId: string): Promise<CancelResult> {
    const sub = await Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { cancelAtPeriodEnd: true, cancelledAt: new Date() },
      { new: true }
    );

    const periodEnd = sub?.currentPeriodEnd ?? new Date();
    logger.info(`[DEMO_BILLING] Cancellation scheduled: userId=${userId} at period end`);

    return {
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: periodEnd,
      message: `[Demo] Subscription will cancel at period end (${periodEnd.toDateString()}).`,
    };
  }

  async resumeSubscription(userId: string): Promise<{ success: boolean; message: string }> {
    await Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { cancelAtPeriodEnd: false, cancelledAt: undefined }
    );

    logger.info(`[DEMO_BILLING] Cancellation reversed: userId=${userId}`);
    return { success: true, message: '[Demo] Subscription cancellation reversed.' };
  }

  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    // Demo mode: no real webhook signature verification needed
    logger.warn('[DEMO_BILLING] Webhook signature verification skipped (demo mode)');
    return true;
  }

  private _calcPeriodEnd(from: Date, cycle: BillingCycle): Date {
    const end = new Date(from);
    if (cycle === 'yearly') {
      end.setFullYear(end.getFullYear() + 1);
    } else {
      end.setMonth(end.getMonth() + 1);
    }
    return end;
  }
}

// ─── Billing Service (Facade) ─────────────────────────────────────────────────

class BillingService {
  private provider: IBillingProvider;

  constructor() {
    const mode = env.BILLING_MODE ?? 'demo';
    switch (mode) {
      case 'razorpay':
        // RazorpayBillingProvider not yet implemented — fall through to demo
        logger.warn('[BILLING] Razorpay provider not yet implemented — falling back to demo mode');
        this.provider = new DemoBillingProvider();
        break;
      case 'stripe':
        logger.warn('[BILLING] Stripe provider not yet implemented — falling back to demo mode');
        this.provider = new DemoBillingProvider();
        break;
      default:
        this.provider = new DemoBillingProvider();
    }
    logger.info(`[BILLING] Provider initialized: ${this.provider.name}`);
  }

  get isDemoMode(): boolean {
    return this.provider.name === 'demo';
  }

  /** Initiate a new subscription (checkout). Handles upsert. */
  async checkout(userId: string, plan: PlanId, cycle: BillingCycle): Promise<CheckoutResult> {
    const planDef = getPlan(plan);

    // Enterprise: always contact sales — no self-serve checkout
    if (planDef.isCustom) {
      return {
        success: false,
        subscriptionId: '',
        demoMode: this.isDemoMode,
        message: 'Enterprise plans require contacting sales. Please use the Enterprise CTA.',
      };
    }

    // Downgrading to free? Just reset the subscription
    if (plan === 'free') {
      const changeResult = await this.provider.changePlan(userId, 'free', 'monthly');
      return {
        success: changeResult.success,
        subscriptionId: 'free_plan',
        demoMode: this.isDemoMode,
        message: changeResult.message,
      };
    }

    return this.provider.createSubscription(userId, plan, cycle);
  }

  async changePlan(userId: string, newPlan: PlanId, newCycle: BillingCycle): Promise<ChangePlanResult> {
    const planDef = getPlan(newPlan);
    if (planDef.isCustom) {
      return {
        success: false,
        previousPlan: 'free',
        newPlan,
        message: 'Enterprise plan changes require contacting sales.',
      };
    }
    return this.provider.changePlan(userId, newPlan, newCycle);
  }

  async cancelSubscription(userId: string): Promise<CancelResult> {
    return this.provider.cancelSubscription(userId);
  }

  async resumeSubscription(userId: string): Promise<{ success: boolean; message: string }> {
    return this.provider.resumeSubscription(userId);
  }

  /** Get or create the subscription for a user. Defaults to free plan. */
  async getOrCreateSubscription(userId: string): Promise<ISubscription> {
    let sub = await Subscription.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!sub) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      sub = await Subscription.create({
        userId: new mongoose.Types.ObjectId(userId),
        plan: 'free',
        status: 'active',
        billingCycle: 'monthly',
        provider: 'demo',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        activatedAt: now,
      });
    }
    return sub;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return this.provider.verifyWebhookSignature(payload, signature);
  }
}

// Singleton export
export const billingService = new BillingService();
