import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustryInquiry extends Document {
    companyName: string;
    email: string;
    phone?: string;
    plan: string;
    teamSize: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const IndustryInquirySchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        plan: { 
            type: String, 
            required: true 
        },
        teamSize: { type: String, required: true },
        message: { type: String },
        status: { 
            type: String, 
            enum: ['new', 'contacted', 'converted', 'rejected'], 
            default: 'new' 
        }
    },
    { timestamps: true }
);

export default mongoose.model<IIndustryInquiry>('IndustryInquiry', IndustryInquirySchema);
