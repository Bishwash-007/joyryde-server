import { Router } from 'express';
import {
  loginController,
  refreshController,
  logoutController,
  requestOtpController,
  verifyOtpController,
  biometricLoginController,
  completeSignupController,
  forgotPasswordController,
  resendForgotPasswordController,
  resetPasswordController
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import {
  loginSchema,
  refreshSchema,
  otpRequestSchema,
  otpVerifySchema,
  biometricSchema,
  completeSignupSchema,
  passwordResetRequestSchema,
  passwordResetResendSchema,
  passwordResetSchema
} from '../validators/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', validate(loginSchema), loginController);
router.post('/otp/request', validate(otpRequestSchema), requestOtpController);
router.post('/otp/verify', validate(otpVerifySchema), verifyOtpController);
router.post('/otp/complete', validate(completeSignupSchema), completeSignupController);
router.post('/password/forgot', validate(passwordResetRequestSchema), forgotPasswordController);
router.post(
  '/password/forgot/resend',
  validate(passwordResetResendSchema),
  resendForgotPasswordController
);
router.post('/password/reset', validate(passwordResetSchema), resetPasswordController);
router.post('/refresh', validate(refreshSchema), refreshController);
router.post('/logout', requireAuth, logoutController);
router.post('/biometric', validate(biometricSchema), biometricLoginController);

export default router;
