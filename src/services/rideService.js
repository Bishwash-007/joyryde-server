import { Ride, Bid } from '../models/index.js';
import { AppError } from '../utils/errors.js';

export async function createRide(driverId, payload) {
  return Ride.create({ ...payload, driver: driverId });
}

export async function listDriverRides(driverId) {
  return Ride.find({ driver: driverId });
}

export async function listAvailableRides({ lng, lat, radiusKm }) {
  const query = { status: 'open' };
  if (lng !== undefined && lat !== undefined) {
    query.origin = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusKm * 1000
      }
    };
  }
  return Ride.find(query).limit(50);
}

export async function updateRide(id, updates) {
  const ride = await Ride.findByIdAndUpdate(id, updates, { new: true });
  if (!ride) throw new AppError(404, 'Ride not found');
  return ride;
}

export async function placeBid(rideId, riderId, offerPrice) {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(404, 'Ride not found');
  return Bid.create({ ride: rideId, rider: riderId, offerPrice });
}
