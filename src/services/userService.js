import { User } from '../models/index.js';
import { AppError } from '../utils/errors.js';

export async function getUser(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function updateUser(id, updates) {
  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function findNearbyUsers({ lng, lat, radiusKm }) {
  return User.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusKm * 1000
      }
    }
  });
}
