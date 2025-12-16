import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadRidePhoto, uploadVehiclePhoto } from '../services/cloudinaryService.js';
import { updateRide } from '../services/rideService.js';
import { updateUser } from '../services/userService.js';
import { AppError } from '../utils/errors.js';

export const uploadRidePhotoController = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'Missing file');
  const uploadResult = await uploadRidePhoto(req.file.buffer);
  res.json({ photoUrl: uploadResult.secure_url, publicId: uploadResult.public_id });
});

export const uploadVehiclePhotoController = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'Missing file');
  const uploadResult = await uploadVehiclePhoto(req.file.buffer);
  // You can save this to user profile or a separate Vehicle model
  res.json({ photoUrl: uploadResult.secure_url, publicId: uploadResult.public_id });
});
