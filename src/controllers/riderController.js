import { asyncHandler } from '../utils/asyncHandler.js';
import { listAvailableRides, placeBid } from '../services/rideService.js';
import { payForRide } from '../services/paymentService.js';
import { leaveReview } from '../services/reviewService.js';
import { Ride } from '../models/index.js';
import { getIo } from '../socket/index.js';

export const listRidesController = asyncHandler(async (req, res) => {
  const rides = await listAvailableRides(req.validated.query);
  res.json(rides);
});

export const bidController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { offerPrice } = req.validated.body;
  const bid = await placeBid(id, req.user.id, offerPrice);
  try {
    getIo()
      .to(`ride:${id}`)
      .emit('bid:placed', { bidId: bid.id, rideId: id, offerPrice, riderId: req.user.id });
  } catch (err) {
    // socket not initialized or other non-critical issues
  }
  res.status(201).json(bid);
});

export const payController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { paymentMethodId } = req.validated.body;
  const { payment, intentClientSecret } = await payForRide(id, req.user.id, paymentMethodId);
  res.json({ payment, intentClientSecret });
});

export const reviewController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const ride = await Ride.findById(id);
  const review = await leaveReview(id, req.user.id, ride?.driver, req.validated.body);
  res.status(201).json(review);
});
