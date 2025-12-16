import { Router } from 'express';
import {
  signupController,
  loginController,
  refreshController,
  logoutController,
  requestOtpController,
  verifyOtpController,
  biometricLoginController
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import {
  signupSchema,
  loginSchema,
  refreshSchema,
  otpRequestSchema,
  otpVerifySchema,
  biometricSchema
} from '../validators/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);
router.post('/otp/request', validate(otpRequestSchema), requestOtpController);
router.post('/otp/verify', validate(otpVerifySchema), verifyOtpController);
router.post('/refresh', validate(refreshSchema), refreshController);
router.post('/logout', requireAuth, logoutController);
router.post('/biometric', validate(biometricSchema), biometricLoginController);

export default router;
