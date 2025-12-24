import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';

export const getCustomerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json(user);
});

export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl, phone } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      phone,
      'profile.name': name,
      'profile.avatarUrl': avatarUrl
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.json(updatedUser);
});

export const getCustomerRideHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json({ userId: user._id, rides: [] });
});

export const deleteCustomerAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.json({ message: 'Account deleted successfully' });
});
