import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  refreshToken?: string;
  lastLogin?: Date | null;
  bio?: string;
  location?: string;
  skills: string[];
  // OAuth fields
  googleId?: string;
  githubId?: string;
  authProvider: 'local' | 'google' | 'github';
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: [8, 'Password must be at least 8 characters'] },
    role: { 
      type: String, 
      enum: ['student', 'employer', 'institute', 'industry', 'government', 'admin'], 
      default: 'student' 
    },
    avatar: { type: String, default: '' },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    // OAuth
    googleId: { type: String, sparse: true, index: true },
    githubId: { type: String, sparse: true, index: true },
    authProvider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
    lastLogin: { type: Date, default: null },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: { type: [String], default: [] },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
