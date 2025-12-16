import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
    provider: { type: String, default: 'stripe' },
    providerPaymentIntentId: { type: String }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', PaymentSchema);
