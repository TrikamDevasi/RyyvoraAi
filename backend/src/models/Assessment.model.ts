import mongoose, { Document, Schema } from 'mongoose';

interface IResponse {
  questionId: mongoose.Types.ObjectId;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
}

export interface IAssessment extends Document {
  studentId: mongoose.Types.ObjectId;
  category: string;
  score: number;
  totalQuestions: number;
  aiAnalysis: string;
  completedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  aiAnalysis: { type: String, default: '' },
  completedAt: { type: Date, default: Date.now },
});

const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export default Assessment;
