import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userRole?: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  dataAccessed: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  userRole: {
    type: String,
    enum: ['student', 'institute', 'industry', 'government', 'admin'],
  },
  action: { type: String, required: true },
  resource: { type: String, required: true, index: true },
  resourceId: { type: String, default: '' },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, default: '' },
  dataAccessed: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

// IMMUTABLE: Prevent any updates or deletions
AuditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next(new Error('AuditLog is immutable and cannot be modified'));
  }
  next();
});

AuditLogSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function () {
  throw new Error('AuditLog is immutable — updates are not permitted');
});

// Only expose create — never update or delete
const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLog;
