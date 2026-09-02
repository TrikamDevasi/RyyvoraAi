import mongoose, { Document, Schema } from 'mongoose';
import { PlanId, BillingCycle } from '../config/plans';

export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'expired' | 'past_due';
export type BillingProvider = 'demo' | 'razorpay' | 'stripe';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;

  // Payment provider info (populated for real providers)
  provider: BillingProvider;
  providerCustomerId?: string;
  providerSubscriptionId?: string;

  // Billing period
  currentPeriodStart: Date;
  currentPeriodEnd: Date;

  // Trial
  trialStart?: Date;
  trialEnd?: Date;

  // Cancellation
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;

  // Activation
  activatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One subscription per user
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'growth', 'enterprise'],
      required: true,
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'trialing', 'cancelled', 'expired', 'past_due'],
      required: true,
      default: 'active',
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },

    // Provider fields
    provider: {
      type: String,
      enum: ['demo', 'razorpay', 'stripe'],
      default: 'demo',
    },
    providerCustomerId: { type: String, sparse: true },
    providerSubscriptionId: { type: String, sparse: true, index: true },

    // Billing period
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },

    // Trial
    trialStart: { type: Date },
    trialEnd: { type: Date },

    // Cancellation
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelledAt: { type: Date },

    // Activation
    activatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound index for lookups by userId + status
SubscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
