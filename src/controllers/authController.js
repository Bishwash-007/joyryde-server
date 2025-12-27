import { asyncHandler } from '../utils/asyncHandler.js';
import {
  login,
  refreshSession,
  logout,
  requestOtp,
  verifyOtpLogin,
  biometricLogin,
  completeSignup,
  requestPasswordReset,
  resendPasswordResetOtp,
  resetPasswordWithOtp
} from '../services/authService.js';

export const completeSignupController = asyncHandler(async (req, res) => {
  const result = await completeSignup(req.validated.body);
  res.status(201).json(result);
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await login(req.validated.body);
  res.json(result);
});

export const refreshController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.validated.body;
  const result = await refreshSession(refreshToken);
  res.json(result);
});

export const logoutController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await logout(req.user?.id, refreshToken);
  res.json({ success: true });
});

export const requestOtpController = asyncHandler(async (req, res) => {
  const { email } = req.validated.body;
  const result = await requestOtp(email);
  res.json({ success: true, ...result });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, code } = req.validated.body;
  const result = await verifyOtpLogin(email, code);
  res.json(result);
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.validated.body;
  const result = await requestPasswordReset(email);
  res.json({ success: true, ...result });
});

export const resendForgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.validated.body;
  const result = await resendPasswordResetOtp(email);
  res.json({ success: true, ...result });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await resetPasswordWithOtp(req.validated.body);
  res.json(result);
});

export const biometricLoginController = asyncHandler(async (req, res) => {
  const result = await biometricLogin(req.validated.body);
  res.json(result);
});
