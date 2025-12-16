import mongoose from 'mongoose';

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  { _id: false }
);

const PaymentMethodSchema = new mongoose.Schema(
  {
    provider: { type: String },
    providerCustomerId: { type: String },
    last4: { type: String },
    brand: { type: String }
  },
  { _id: false }
);

const KYCSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    documentUrl: { type: String },
    notes: { type: String }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    phone: { type: String },
    role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
    profile: {
      name: { type: String },
      avatarUrl: { type: String }
    },
    location: { type: GeoPointSchema, index: '2dsphere' },
    kyc: { type: KYCSchema, default: () => ({}) },
    paymentMethods: { type: [PaymentMethodSchema], default: [] },
    isBiometricEnabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
