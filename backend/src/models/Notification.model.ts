// backend/src/models/Notification.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'passport' | 'ai' | 'compliance' | 'job' | 'system';
  href: string;
  unread: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['passport', 'ai', 'compliance', 'job', 'system'],
      default: 'system',
    },
    href: { type: String, default: '/student' },
    unread: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models && mongoose.models.Notification)
  ? (mongoose.models.Notification as mongoose.Model<INotification>)
  : mongoose.model<INotification>('Notification', NotificationSchema);
