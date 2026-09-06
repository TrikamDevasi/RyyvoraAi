import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  domain: string;
  nsqfLevel: number;
  correctAnswer: string;
  options: string[];
  difficulty: number;
  skillId: mongoose.Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    domain: { type: String, required: true },
    nsqfLevel: { type: Number, min: 1, max: 8, required: true },
    correctAnswer: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length === 4,
        message: 'Options must have exactly 4 choices',
      },
      required: true,
    },
    difficulty: { type: Number, min: 1, max: 5, required: true },
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question;
