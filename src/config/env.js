import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/joyride',
  jwtSecret: process.env.JWT_SECRET || 'insecure-dev-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'insecure-refresh-secret',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'stripe-secret',
  clerkSecret: process.env.CLERK_SECRET_KEY || 'clerk-secret',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'cloud-name',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || 'cloud-key',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'cloud-secret',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'maps-api-key'
};

export const isDev = env.nodeEnv !== 'production';
