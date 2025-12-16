import mongoose from 'mongoose';
import { env, isDev } from './env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: isDev
    });
    logger.info({ mongoUri: env.mongoUri }, 'MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect MongoDB');
    process.exit(1);
  }
}
