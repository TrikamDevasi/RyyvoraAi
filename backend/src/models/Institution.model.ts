import mongoose, { Document, Schema } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  type: 'ITI' | 'Polytechnic' | 'Vocational' | 'University' | 'Corporate';
  state: string;
  district: string;
  nsqfAffiliation: string;
  studentCount: number;
  placementRate: number;
  programRoiScores: { program: string; roi: number }[];
  programs: string[];
  contactEmail: string;
  isVerified: boolean;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['ITI', 'Polytechnic', 'Vocational', 'University', 'Corporate'],
      required: true,
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    nsqfAffiliation: { type: String, required: true },
    studentCount: { type: Number, default: 0 },
    placementRate: { type: Number, default: 0 },
    programRoiScores: [
      {
        program: { type: String },
        roi: { type: Number },
      },
    ],
    programs: [{ type: String }],
    contactEmail: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Institution = mongoose.model<IInstitution>('Institution', InstitutionSchema);
export default Institution;
