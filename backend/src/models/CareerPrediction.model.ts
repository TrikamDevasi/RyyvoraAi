import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerPrediction extends Document {
  userId: mongoose.Types.ObjectId;
  skills: string[];
  interests: string[];
  education: string;
  careers: Array<{
    title: string;
    match: number;
    salaryRange: string;
    growth: string;
    missingSkills: string[];
    timeToReady: string;
    roadmap: string[];
  }>;
  createdAt: Date;
}

const CareerPredictionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [{ type: String }],
    interests: [{ type: String }],
    education: { type: String },
    careers: [
      {
        title: { type: String, required: true },
        match: { type: Number },
        salaryRange: { type: String },
        growth: { type: String },
        missingSkills: [{ type: String }],
        timeToReady: { type: String },
        roadmap: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICareerPrediction>('CareerPrediction', CareerPredictionSchema);
