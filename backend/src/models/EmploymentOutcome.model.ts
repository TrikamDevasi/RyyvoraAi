import mongoose, { Document, Schema } from 'mongoose';

export type EmploymentStatus =
  | 'EMPLOYED'
  | 'SELF_EMPLOYED'
  | 'APPRENTICESHIP'
  | 'UNEMPLOYED'
  | 'SEEKING'
  | 'UNKNOWN';

export type TrainingRelevance =
  | 'HIGHLY_RELEVANT'
  | 'PARTIALLY_RELEVANT'
  | 'NOT_RELEVANT'
  | 'UNKNOWN';

export type NonPlacementReason =
  | 'SKILL_GAP'
  | 'LACK_OF_EXPERIENCE'
  | 'LOCATION'
  | 'SALARY_EXPECTATION'
  | 'COMMUNICATION'
  | 'TRANSPORT'
  | 'FAMILY_CONSTRAINT'
  | 'HEALTH_OR_PERSONAL'
  | 'LACK_OF_JOB_OPENINGS'
  | 'CERTIFICATION_ISSUE'
  | 'OTHER';

export type AttritionReason =
  | 'BETTER_OPPORTUNITY'
  | 'LOW_SALARY'
  | 'SKILL_MISMATCH'
  | 'WORK_ENVIRONMENT'
  | 'LOCATION'
  | 'CONTRACT_ENDED'
  | 'PERSONAL_REASON'
  | 'OTHER';

export interface ISalaryPoint {
  date: Date;
  amount: number; // Monthly INR
  source: string;
  verified: boolean;
  role?: string;
}

export interface IEmploymentOutcome extends Document {
  traineeId: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  program: string;
  district: string;
  state: string;
  status: EmploymentStatus;
  employerName?: string;
  employerContact?: string;
  employerId?: mongoose.Types.ObjectId;
  jobRole?: string;
  industryDomain?: string;
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'gig' | 'freelance';
  startDate?: Date;
  endDate?: Date;
  initialSalary?: number; // Monthly INR
  currentSalary?: number; // Monthly INR
  salaryHistory: ISalaryPoint[];
  trainingRelevance: TrainingRelevance;
  retentionDays: number;
  retained30d: boolean;
  retained90d: boolean;
  retained180d: boolean;
  retained365d: boolean;
  nonPlacementReason?: NonPlacementReason;
  attritionReason?: AttritionReason;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUESTED' | 'SELF_REPORTED';
  verificationSource: 'EMPLOYER_VERIFICATION' | 'TRAINEE_SELF_REPORT' | 'TRAINING_PROVIDER' | 'FOLLOW_UP' | 'IMPORTED_DATA' | 'SYSTEM_SIGNAL';
  confidenceScore: number;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmploymentOutcomeSchema = new Schema<IEmploymentOutcome>(
  {
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    program: { type: String, required: true, index: true },
    district: { type: String, required: true, default: 'Pune', index: true },
    state: { type: String, required: true, default: 'Maharashtra', index: true },
    status: {
      type: String,
      required: true,
      enum: ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP', 'UNEMPLOYED', 'SEEKING', 'UNKNOWN'],
      default: 'SEEKING',
      index: true,
    },
    employerName: { type: String, trim: true },
    employerContact: { type: String, trim: true },
    employerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    jobRole: { type: String, trim: true },
    industryDomain: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'gig', 'freelance'],
      default: 'full_time',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    initialSalary: { type: Number },
    currentSalary: { type: Number },
    salaryHistory: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        source: { type: String, default: 'TRAINEE_SELF_REPORT' },
        verified: { type: Boolean, default: false },
        role: { type: String },
      },
    ],
    trainingRelevance: {
      type: String,
      enum: ['HIGHLY_RELEVANT', 'PARTIALLY_RELEVANT', 'NOT_RELEVANT', 'UNKNOWN'],
      default: 'UNKNOWN',
      index: true,
    },
    retentionDays: { type: Number, default: 0 },
    retained30d: { type: Boolean, default: false },
    retained90d: { type: Boolean, default: false },
    retained180d: { type: Boolean, default: false },
    retained365d: { type: Boolean, default: false },
    nonPlacementReason: {
      type: String,
      enum: [
        'SKILL_GAP',
        'LACK_OF_EXPERIENCE',
        'LOCATION',
        'SALARY_EXPECTATION',
        'COMMUNICATION',
        'TRANSPORT',
        'FAMILY_CONSTRAINT',
        'HEALTH_OR_PERSONAL',
        'LACK_OF_JOB_OPENINGS',
        'CERTIFICATION_ISSUE',
        'OTHER',
      ],
    },
    attritionReason: {
      type: String,
      enum: [
        'BETTER_OPPORTUNITY',
        'LOW_SALARY',
        'SKILL_MISMATCH',
        'WORK_ENVIRONMENT',
        'LOCATION',
        'CONTRACT_ENDED',
        'PERSONAL_REASON',
        'OTHER',
      ],
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'CORRECTION_REQUESTED', 'SELF_REPORTED'],
      default: 'PENDING',
      index: true,
    },
    verificationSource: {
      type: String,
      enum: [
        'EMPLOYER_VERIFICATION',
        'TRAINEE_SELF_REPORT',
        'TRAINING_PROVIDER',
        'FOLLOW_UP',
        'IMPORTED_DATA',
        'SYSTEM_SIGNAL',
      ],
      default: 'TRAINEE_SELF_REPORT',
    },
    confidenceScore: { type: Number, min: 0, max: 1, default: 0.7 },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    verificationNotes: { type: String },
  },
  { timestamps: true }
);

EmploymentOutcomeSchema.index({ district: 1, status: 1 });
EmploymentOutcomeSchema.index({ program: 1, status: 1 });
EmploymentOutcomeSchema.index({ institutionId: 1, status: 1 });
EmploymentOutcomeSchema.index({ startDate: 1, status: 1 });

const EmploymentOutcome = mongoose.model<IEmploymentOutcome>('EmploymentOutcome', EmploymentOutcomeSchema);
export default EmploymentOutcome;
