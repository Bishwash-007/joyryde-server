import { asyncHandler } from '../utils/asyncHandler.js';
import { createRide, listDriverRides, updateRide } from '../services/rideService.js';

export const createRideController = asyncHandler(async (req, res) => {
  const ride = await createRide(req.user.id, req.validated.body);
  res.status(201).json(ride);
});

export const driverRidesController = asyncHandler(async (req, res) => {
  const rides = await listDriverRides(req.user.id);
  res.json(rides);
});

export const updateRideController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const ride = await updateRide(id, req.validated.body);
  res.json(ride);
});
