import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, RefreshToken, OtpCode } from '../models/index.js';
import { AppError } from '../utils/errors.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/token.js';
import { createOtp, verifyOtp } from './otpService.js';
import transporter from '../config/mailer.js';
import { logger } from '../config/logger.js';
import { otpEmailTemplate } from '../utils/emailTemplates.js';
import { addMinutes } from './time.js';

const SALT_ROUNDS = 10;

import { env } from '../config/env.js';

async function sendOtpEmail(email, code) {
  const template = otpEmailTemplate(code);
  try {
    await transporter.sendMail({
      to: email,
      from: env.emailFrom,
      subject: template.subject,
      html: template.html
    });
  } catch (error) {
    logger.error(
      `Failed to send OTP email: ${error && error.stack ? error.stack : error} | email: ${email} | code: ${code}`
    );
    throw new AppError(500, 'Failed to send OTP email');
  }
}

async function saveRefreshToken(userId, refreshToken, session) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = addMinutes(new Date(), 30 * 24 * 60);
  const tokenDoc = new RefreshToken({ user: userId, tokenHash, expiresAt });
  if (session) {
    await tokenDoc.save({ session });
  } else {
    await tokenDoc.save();
  }
}

function buildTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError(401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.password || '');
  if (!valid) throw new AppError(401, 'Invalid credentials');
  const tokens = buildTokens(user);
  await saveRefreshToken(user.id, tokens.refreshToken);
  return { user, ...tokens };
}

export async function refreshSession(refreshToken) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const stored = await RefreshToken.findOne({ user: payload.sub, tokenHash });
    if (!stored) throw new AppError(401, 'Invalid refresh token');
    await RefreshToken.deleteOne({ _id: stored._id });
    const user = await User.findById(payload.sub);
    const tokens = buildTokens(user);
    await saveRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, 'Invalid refresh token');
  }
}

export async function logout(userId, refreshToken) {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await RefreshToken.deleteOne({ user: userId, tokenHash });
}

export async function requestOtp(email) {
  const user = (await User.findOne({ email })) || (await User.create({ email }));
  const { code, expiresAt } = await createOtp(user.id);
  await sendOtpEmail(email, code);
  logger.info(`Sent OTP ${code} to ${email}`);
  return { expiresAt };
}

export async function verifyOtpLogin(email, code) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, 'User not found');
  const ok = await verifyOtp(user.id, code);
  if (!ok) throw new AppError(400, 'Invalid or expired code');
  const tokens = buildTokens(user);
  await saveRefreshToken(user.id, tokens.refreshToken);
  return { user, ...tokens };
}

export async function completeSignup({ email, code, password, name, phone }) {
  const session = await mongoose.startSession();
  try {
    let response;
    await session.withTransaction(async () => {
      const user = await User.findOne({ email }).session(session);
      if (!user) throw new AppError(404, 'User not found');
      if (user.emailVerifiedAt && user.password) {
        throw new AppError(400, 'Account already completed');
      }

      const verified = await verifyOtp(user.id, code, session);
      if (!verified) throw new AppError(400, 'Invalid or expired code');

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      user.password = hashed;
      user.emailVerifiedAt = new Date();
      if (name !== undefined) {
        user.profile = user.profile || {};
        user.profile.name = name;
      }
      if (phone) {
        user.phone = phone;
      }

      await user.save({ session });
      const tokens = buildTokens(user);
      await saveRefreshToken(user.id, tokens.refreshToken, session);
      response = { user, ...tokens };
    });

    return response;
  } finally {
    session.endSession();
  }
}

export async function biometricLogin({ userId, deviceId }) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (!user.isBiometricEnabled) throw new AppError(403, 'Biometric login not enabled');
  // In production, validate deviceId + signed challenge. Stub only.
  const tokens = buildTokens(user);
  await saveRefreshToken(user.id, tokens.refreshToken);
  return { user, ...tokens, deviceId };
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) throw new AppError(404, 'Account not found');

  const activeOtp = await OtpCode.findOne({ user: user.id, consumed: false })
    .sort({ createdAt: -1 })
    .lean();

  if (activeOtp && activeOtp.expiresAt > new Date()) {
    throw new AppError(429, 'OTP already sent, please wait until it expires');
  }

  if (activeOtp) {
    await OtpCode.updateOne({ _id: activeOtp._id }, { consumed: true });
  }

  const { code, expiresAt } = await createOtp(user.id);
  await sendOtpEmail(email, code);
  return { expiresAt };
}

export async function resendPasswordResetOtp(email) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) throw new AppError(404, 'Account not found');

  const latestOtp = await OtpCode.findOne({ user: user.id }).sort({ createdAt: -1 }).lean();

  if (!latestOtp) {
    throw new AppError(400, 'No previous OTP request found');
  }

  if (!latestOtp.consumed && latestOtp.expiresAt > new Date()) {
    throw new AppError(429, 'Current OTP still valid');
  }

  if (!latestOtp.consumed) {
    await OtpCode.updateOne({ _id: latestOtp._id }, { consumed: true });
  }

  const { code, expiresAt } = await createOtp(user.id);
  await sendOtpEmail(email, code);
  return { expiresAt };
}

export async function resetPasswordWithOtp({ email, code, password }) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await User.findOne({ email }).select('+password').session(session);
      if (!user || !user.password) throw new AppError(404, 'Account not found');

      const verified = await verifyOtp(user.id, code, session);
      if (!verified) throw new AppError(400, 'Invalid or expired code');

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      user.password = hashed;
      if (!user.emailVerifiedAt) {
        user.emailVerifiedAt = new Date();
      }

      await user.save({ session });
      await RefreshToken.deleteMany({ user: user.id }).session(session);
    });

    return { success: true };
  } finally {
    session.endSession();
  }
}
