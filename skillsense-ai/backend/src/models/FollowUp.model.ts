import mongoose, { Document, Schema } from 'mongoose';

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED';
export type FollowUpInterval = 30 | 60 | 90 | 180 | 365;

export interface IFollowUpResponse {
  isEmployed: boolean;
  employmentType?: string;
  employerName?: string;
  jobRole?: string;
  currentSalary?: number;
  trainingRelevance?: 'HIGHLY_RELEVANT' | 'PARTIALLY_RELEVANT' | 'NOT_RELEVANT' | 'UNKNOWN';
  skillsLacking?: string[];
  barriersFaced?: string[];
  feedback?: string;
}

export interface IFollowUp extends Document {
  traineeId: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  employmentOutcomeId?: mongoose.Types.ObjectId;
  scheduleDays: FollowUpInterval;
  dueDate: Date;
  status: FollowUpStatus;
  responseDate?: Date;
  responses?: IFollowUpResponse;
  channel: 'PORTAL' | 'SMS' | 'EMAIL' | 'WHATSAPP';
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    employmentOutcomeId: { type: Schema.Types.ObjectId, ref: 'EmploymentOutcome' },
    scheduleDays: {
      type: Number,
      required: true,
      enum: [30, 60, 90, 180, 365],
      index: true,
    },
    dueDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'COMPLETED', 'OVERDUE', 'SKIPPED'],
      default: 'PENDING',
      index: true,
    },
    responseDate: { type: Date },
    responses: {
      isEmployed: { type: Boolean },
      employmentType: { type: String },
      employerName: { type: String },
      jobRole: { type: String },
      currentSalary: { type: Number },
      trainingRelevance: {
        type: String,
        enum: ['HIGHLY_RELEVANT', 'PARTIALLY_RELEVANT', 'NOT_RELEVANT', 'UNKNOWN'],
      },
      skillsLacking: { type: [String], default: [] },
      barriersFaced: { type: [String], default: [] },
      feedback: { type: String },
    },
    channel: {
      type: String,
      enum: ['PORTAL', 'SMS', 'EMAIL', 'WHATSAPP'],
      default: 'PORTAL',
    },
  },
  { timestamps: true }
);

FollowUpSchema.index({ institutionId: 1, status: 1 });
FollowUpSchema.index({ dueDate: 1, status: 1 });

const FollowUp = mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);
export default FollowUp;
