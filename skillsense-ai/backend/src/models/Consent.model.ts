import mongoose, { Document, Schema } from 'mongoose';

export type ConsentStatus = 'GRANTED' | 'PENDING' | 'WITHDRAWN';

export interface IConsentHistoryEntry {
  action: 'GRANT' | 'WITHDRAW' | 'UPDATE';
  timestamp: Date;
  ipAddress?: string;
  purposes: string[];
}

export interface IConsent extends Document {
  userId: mongoose.Types.ObjectId;
  status: ConsentStatus;
  purposes: string[];
  grantedAt: Date;
  withdrawnAt?: Date;
  consentHistory: IConsentHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['GRANTED', 'PENDING', 'WITHDRAWN'],
      default: 'GRANTED',
      index: true,
    },
    purposes: {
      type: [String],
      default: [
        'outcome_tracking',
        'employer_verification',
        'longitudinal_followup',
        'salary_benchmarking',
        'policy_analytics',
      ],
    },
    grantedAt: { type: Date, default: Date.now },
    withdrawnAt: { type: Date },
    consentHistory: [
      {
        action: { type: String, enum: ['GRANT', 'WITHDRAW', 'UPDATE'], required: true },
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String },
        purposes: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true }
);

const Consent = mongoose.model<IConsent>('Consent', ConsentSchema);
export default Consent;
