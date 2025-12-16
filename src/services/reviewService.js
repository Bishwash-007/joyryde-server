import { Review } from '../models/index.js';
import { AppError } from '../utils/errors.js';

export async function leaveReview(rideId, reviewerId, revieweeId, payload) {
  const review = await Review.create({
    ride: rideId,
    reviewer: reviewerId,
    reviewee: revieweeId,
    ...payload
  });
  return review;
}

export async function aggregateRating(userId) {
  const result = await Review.aggregate([
    { $match: { reviewee: userId } },
    { $group: { _id: '$reviewee', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (!result.length) throw new AppError(404, 'No reviews');
  return result[0];
}
