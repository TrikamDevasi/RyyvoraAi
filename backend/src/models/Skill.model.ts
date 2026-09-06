import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  domain: string;
  nsqfLevel: number;
  description: string;
  industryDemandScore: number;
  demandTrend: { month: string; score: number }[];
  assessmentQuestions: mongoose.Types.ObjectId[];
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    domain: { type: String, required: true },
    nsqfLevel: { type: Number, min: 1, max: 8, required: true },
    description: { type: String, required: true },
    industryDemandScore: { type: Number, min: 0, max: 100, default: 50 },
    demandTrend: [
      {
        month: { type: String },
        score: { type: Number },
      },
    ],
    assessmentQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true }
);

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;
