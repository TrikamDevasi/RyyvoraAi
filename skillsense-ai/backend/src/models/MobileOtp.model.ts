import mongoose, { Document, Schema } from 'mongoose';

export interface IMobileOtp extends Document {
  phone: string;
  otpHash: string;
  attempts: number;
  lastSentAt: Date;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MobileOtpSchema = new Schema<IMobileOtp>(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      index: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: [true, 'OTP hash is required'],
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: MongoDB automatically purges documents when expiresAt timestamp is reached
      index: { expires: 0 },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast phone lookups ordered by newest creation
MobileOtpSchema.index({ phone: 1, createdAt: -1 });

const MobileOtp = mongoose.model<IMobileOtp>('MobileOtp', MobileOtpSchema);
export default MobileOtp;
