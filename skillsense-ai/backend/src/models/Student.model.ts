import mongoose, { Document, Schema } from 'mongoose';

interface ISkillEntry {
  skillId: mongoose.Types.ObjectId;
  score: number;
  lastAssessed: Date;
  history: { score: number; date: Date }[];
}

interface IIntervention {
  type: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  enrollmentNumber: string;
  program: string;
  nsqfLevel: number;
  batch?: string;
  state: string;
  gender: string;
  skills: ISkillEntry[];
  overallScore: number;
  careerPathways: string[];
  placementStatus: 'studying' | 'placed' | 'seeking' | 'higher_education';
  placedAt?: Date;
  placedRole?: string;
  salary?: number;
  passportHash?: string;
  interventions: IIntervention[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    enrollmentNumber: { type: String, required: true, unique: true, index: true },
    program: { type: String, required: true, default: 'Vocational Technology' },
    nsqfLevel: { type: Number, min: 1, max: 8, required: true, default: 4 },
    batch: { type: String, default: '2025-2026' },
    state: { type: String, required: true, default: 'Karnataka' },
    gender: { type: String, required: true, default: 'male' },
    skills: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        score: { type: Number, min: 0, max: 100, default: 70 },
        lastAssessed: { type: Date, default: Date.now },
        history: [{ score: Number, date: { type: Date, default: Date.now } }],
      },
    ],
    careerPathways: [{ type: String }],
    placementStatus: {
      type: String,
      enum: ['studying', 'placed', 'seeking', 'higher_education'],
      default: 'seeking',
      index: true,
    },
    placedAt: { type: Date },
    placedRole: { type: String },
    salary: { type: Number },
    passportHash: { type: String, index: true },
    interventions: [
      {
        type: { type: String },
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for analytics queries
StudentSchema.index({ institutionId: 1, placementStatus: 1 });
StudentSchema.index({ state: 1, nsqfLevel: 1 });

StudentSchema.virtual('overallScore').get(function (this: IStudent) {
  if (!this.skills || this.skills.length === 0) return 75;
  const total = this.skills.reduce((sum, s) => sum + (s.score || 0), 0);
  return Math.round(total / this.skills.length);
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
