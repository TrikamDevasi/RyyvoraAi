import mongoose, { Document, Schema } from 'mongoose';

/**
 * UsageRecord tracks monthly resource consumption per user.
 * Used for real-time quota enforcement and billing dashboard meters.
 * period is stored as "YYYY-MM" (e.g. "2026-03").
 */
export interface IUsageRecord extends Document {
  userId: mongoose.Types.ObjectId;
  period: string; // "YYYY-MM"
  aiRequests: number;
  traineesCreated: number;
  assessmentsRun: number;
  outcomeRecords: number;
  employerVerifications: number;
  reportsGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

const UsageRecordSchema = new Schema<IUsageRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/, // Validates "YYYY-MM" format
    },
    aiRequests: { type: Number, default: 0, min: 0 },
    traineesCreated: { type: Number, default: 0, min: 0 },
    assessmentsRun: { type: Number, default: 0, min: 0 },
    outcomeRecords: { type: Number, default: 0, min: 0 },
    employerVerifications: { type: Number, default: 0, min: 0 },
    reportsGenerated: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one record per user per month
UsageRecordSchema.index({ userId: 1, period: 1 }, { unique: true });

const UsageRecord = mongoose.model<IUsageRecord>('UsageRecord', UsageRecordSchema);
export default UsageRecord;
