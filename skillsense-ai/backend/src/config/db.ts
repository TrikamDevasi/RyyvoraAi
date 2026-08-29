import mongoose from 'mongoose';
import logger from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI_ATLAS || 'mongodb://127.0.0.1:27017/skillsense';
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      logger.info(`MongoDB connected successfully to: ${uri.includes('127.0.0.1') ? 'LOCAL' : 'ATLAS'}`);
      return;
    } catch (err: any) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        logger.info(`Retrying in 3s...`);
        await new Promise(res => setTimeout(res, 3000));
      } else {
        // If Atlas fails, try local as last resort
        if (!uri.includes('127.0.0.1')) {
          logger.warn('Atlas failed. Attempting local MongoDB fallback...');
          try {
            await mongoose.connect('mongodb://127.0.0.1:27017/skillsense');
            logger.info('MongoDB connected via LOCAL fallback');
            return;
          } catch (localErr: any) {
            logger.error('Local MongoDB also failed: ' + localErr.message);
          }
        }
        logger.warn('MongoDB connection unavailable. Server will continue running and reconnect when available.');
      }
    }
  }
};

export default connectDB;
