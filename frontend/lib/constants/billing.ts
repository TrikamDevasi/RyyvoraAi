/**
 * Ryyvora AI — Billing Client Constants & Configuration
 *
 * Centralizes client-side billing environment variables and gateway settings.
 */

export type BillingMode = 'demo' | 'razorpay' | 'stripe';

export const BILLING_CONFIG = {
  mode: (process.env.NEXT_PUBLIC_BILLING_MODE || 'demo') as BillingMode,
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'INR',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  isDemo: (process.env.NEXT_PUBLIC_BILLING_MODE || 'demo') === 'demo',
} as const;

export default BILLING_CONFIG;
