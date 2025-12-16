import mongoose from 'mongoose';

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  { _id: false }
);

const RideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: GeoPointSchema, required: true },
    destination: { type: GeoPointSchema, required: true },
    seatsAvailable: { type: Number, default: 1 },
    price: { type: Number, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    departureTime: { type: Date }
  },
  { timestamps: true }
);

RideSchema.index({ origin: '2dsphere' });
RideSchema.index({ destination: '2dsphere' });

export const Ride = mongoose.model('Ride', RideSchema);
