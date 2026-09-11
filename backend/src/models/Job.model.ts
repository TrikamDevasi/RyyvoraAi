// backend/src/models/Job.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  domain: string;
  requiredSkills: string[];
  salaryRange: string;
  nsqfMinLevel: number;
  experience: string;
  employmentType: 'Full-time' | 'Apprenticeship' | 'Contract' | 'Internship';
  description: string;
  isActive: boolean;
  applyUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: mongoose.Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true, uppercase: true, index: true },
    requiredSkills: [{ type: String, trim: true }],
    salaryRange: { type: String, default: 'Competitive' },
    nsqfMinLevel: { type: Number, default: 5 },
    experience: { type: String, default: '0-2 Years' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Apprenticeship', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    applyUrl: { type: String, default: '#' },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models && mongoose.models.Job)
  ? (mongoose.models.Job as mongoose.Model<IJob>)
  : mongoose.model<IJob>('Job', JobSchema);
