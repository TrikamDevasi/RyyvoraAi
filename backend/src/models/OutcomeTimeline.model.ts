import mongoose, { Document, Schema } from 'mongoose';

export type OutcomeEventType =
  | 'ENROLLED'
  | 'TRAINING_STARTED'
  | 'ASSESSMENT_COMPLETED'
  | 'CERTIFIED'
  | 'PLACEMENT_ASSISTANCE'
  | 'EMPLOYED'
  | 'SELF_EMPLOYED'
  | 'APPRENTICESHIP'
  | 'FOLLOW_UP_30D'
  | 'FOLLOW_UP_60D'
  | 'FOLLOW_UP_90D'
  | 'FOLLOW_UP_180D'
  | 'FOLLOW_UP_365D'
  | 'SALARY_UPDATED'
  | 'JOB_CHANGE'
  | 'RETENTION_CHECK'
  | 'CONSENT_UPDATED';

export type OutcomeEventSource =
  | 'TRAINEE_SELF_REPORT'
  | 'EMPLOYER_VERIFICATION'
  | 'TRAINING_PROVIDER'
  | 'FOLLOW_UP'
  | 'IMPORTED_DATA'
  | 'SYSTEM_SIGNAL';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CORRECTION_REQUESTED'
  | 'SELF_REPORTED';

export interface IOutcomeTimeline extends Document {
  traineeId: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  program: string;
  district?: string;
  state: string;
  date: Date;
  eventType: OutcomeEventType;
  title: string;
  description: string;
  source: OutcomeEventSource;
  verificationStatus: VerificationStatus;
  confidence: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const OutcomeTimelineSchema = new Schema<IOutcomeTimeline>(
  {
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    program: { type: String, required: true, index: true },
    district: { type: String, index: true },
    state: { type: String, default: 'Maharashtra', index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'ENROLLED',
        'TRAINING_STARTED',
        'ASSESSMENT_COMPLETED',
        'CERTIFIED',
        'PLACEMENT_ASSISTANCE',
        'EMPLOYED',
        'SELF_EMPLOYED',
        'APPRENTICESHIP',
        'FOLLOW_UP_30D',
        'FOLLOW_UP_60D',
        'FOLLOW_UP_90D',
        'FOLLOW_UP_180D',
        'FOLLOW_UP_365D',
        'SALARY_UPDATED',
        'JOB_CHANGE',
        'RETENTION_CHECK',
        'CONSENT_UPDATED',
      ],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    source: {
      type: String,
      required: true,
      enum: [
        'TRAINEE_SELF_REPORT',
        'EMPLOYER_VERIFICATION',
        'TRAINING_PROVIDER',
        'FOLLOW_UP',
        'IMPORTED_DATA',
        'SYSTEM_SIGNAL',
      ],
      default: 'SYSTEM_SIGNAL',
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'CORRECTION_REQUESTED', 'SELF_REPORTED'],
      default: 'PENDING',
      index: true,
    },
    confidence: { type: Number, min: 0, max: 1, default: 0.8 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

OutcomeTimelineSchema.index({ traineeId: 1, date: -1 });
OutcomeTimelineSchema.index({ district: 1, eventType: 1 });
OutcomeTimelineSchema.index({ institutionId: 1, eventType: 1 });

const OutcomeTimeline = mongoose.model<IOutcomeTimeline>('OutcomeTimeline', OutcomeTimelineSchema);
export default OutcomeTimeline;
