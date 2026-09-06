import mongoose, { Document, Schema } from 'mongoose';

export type TargetScopeType = 'STATE' | 'DISTRICT' | 'PROGRAMME' | 'PROVIDER';
export type InterventionStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'IMPLEMENTED' | 'DISMISSED';

export interface IPolicyIntervention extends Document {
  title: string;
  targetType: TargetScopeType;
  targetName: string;
  observation: string;
  evidence: {
    metric: string;
    value: string | number;
    baseline: string | number;
    sampleSize: number;
  };
  confidence: number;
  reasoning: string;
  recommendedAction: string;
  impactPotential: 'HIGH' | 'MEDIUM' | 'MODERATE';
  status: InterventionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PolicyInterventionSchema = new Schema<IPolicyIntervention>(
  {
    title: { type: String, required: true, trim: true },
    targetType: {
      type: String,
      required: true,
      enum: ['STATE', 'DISTRICT', 'PROGRAMME', 'PROVIDER'],
      index: true,
    },
    targetName: { type: String, required: true, index: true },
    observation: { type: String, required: true },
    evidence: {
      metric: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
      baseline: { type: Schema.Types.Mixed, required: true },
      sampleSize: { type: Number, required: true },
    },
    confidence: { type: Number, min: 0, max: 1, default: 0.85 },
    reasoning: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    impactPotential: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'MODERATE'],
      default: 'HIGH',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'UNDER_REVIEW', 'IMPLEMENTED', 'DISMISSED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true }
);

const PolicyIntervention = mongoose.model<IPolicyIntervention>('PolicyIntervention', PolicyInterventionSchema);
export default PolicyIntervention;
