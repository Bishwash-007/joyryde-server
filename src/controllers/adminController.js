import { asyncHandler } from '../utils/asyncHandler.js';
import { User, Ride, Payment } from '../models/index.js';
import { AppError } from '../utils/errors.js';

export const dashboardController = asyncHandler(async (_req, res) => {
  const [users, rides, payments] = await Promise.all([
    User.countDocuments(),
    Ride.countDocuments(),
    Payment.countDocuments()
  ]);
  res.json({ users, rides, payments });
});

export const kycController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status, notes } = req.body;
  const user = await User.findByIdAndUpdate(userId, { 'kyc.status': status, 'kyc.notes': notes }, { new: true });
  if (!user) throw new AppError(404, 'User not found');
  res.json(user);
});

export const reportsController = asyncHandler(async (_req, res) => {
  const byRole = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  res.json({ usersByRole: byRole });
});
