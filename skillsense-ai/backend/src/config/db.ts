import mongoose from 'mongoose';
import logger from '../utils/logger';

let retryTimer: NodeJS.Timeout | null = null;

const attemptConnection = async (uri: string): Promise<boolean> => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected successfully to: ${uri.includes('127.0.0.1') ? 'LOCAL' : 'ATLAS'}`);
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    return true;
  } catch (err: any) {
    logger.warn(`MongoDB connection attempt failed: ${err.message}`);
    return false;
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI_ATLAS || 'mongodb://127.0.0.1:27017/skillsense';

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established.');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error: ' + err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Retrying in background...');
    if (!retryTimer) {
      retryTimer = setInterval(() => {
        attemptConnection(uri);
      }, 5000);
    }
  });

  const connected = await attemptConnection(uri);
  if (!connected) {
    logger.warn('MongoDB initial connection unavailable. Starting background connection polling...');
    retryTimer = setInterval(() => {
      attemptConnection(uri);
    }, 4000);
  }
};

export default connectDB;
