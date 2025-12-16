import { asyncHandler } from '../utils/asyncHandler.js';
import { getUser, updateUser, findNearbyUsers } from '../services/userService.js';
import { uploadAvatar, uploadKYCDocument } from '../services/cloudinaryService.js';
import { AppError } from '../utils/errors.js';

export const getUserController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const user = await getUser(id);
  res.json(user);
});

export const updateUserController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const user = await updateUser(id, req.validated.body);
  res.json(user);
});

export const nearbyUsersController = asyncHandler(async (req, res) => {
  const users = await findNearbyUsers(req.validated.query);
  res.json(users);
});

export const uploadAvatarController = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'Missing file');
  const uploadResult = await uploadAvatar(req.file.buffer);
  const user = await updateUser(req.params.id, { 'profile.avatarUrl': uploadResult.secure_url });
  res.json({ avatarUrl: user.profile?.avatarUrl, userId: user.id });
});

export const uploadKYCController = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'Missing file');
  const uploadResult = await uploadKYCDocument(req.file.buffer);
  const user = await updateUser(req.params.id, { 'kyc.documentUrl': uploadResult.secure_url });
  res.json({ documentUrl: user.kyc?.documentUrl, userId: user.id });
});
