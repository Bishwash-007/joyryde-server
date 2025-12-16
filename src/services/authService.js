import bcrypt from 'bcryptjs';
import { User, RefreshToken } from '../models/index.js';
import { AppError } from '../utils/errors.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/token.js';
import { createOtp, verifyOtp } from './otpService.js';
import { mailer } from '../config/mailer.js';
import { otpEmailTemplate } from '../utils/emailTemplates.js';
import { addMinutes } from './time.js';

const SALT_ROUNDS = 10;

async function saveRefreshToken(userId, refreshToken) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = addMinutes(new Date(), 30 * 24 * 60);
  await RefreshToken.create({ user: userId, tokenHash, expiresAt });
}

function buildTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

export async function signup({ email, password, role, phone }) {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError(400, 'User already exists');
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, password: hashed, role: role || 'rider', phone });
  const tokens = buildTokens(user);
  await saveRefreshToken(user.id, tokens.refreshToken);
  return { user, ...tokens };
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
  const template = otpEmailTemplate(code);
  await mailer.sendMail({
    to: email,
    from: 'no-reply@joyride.local',
    subject: template.subject,
    html: template.html
  });
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

export async function biometricLogin({ userId, deviceId }) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (!user.isBiometricEnabled) throw new AppError(403, 'Biometric login not enabled');
  // In production, validate deviceId + signed challenge. Stub only.
  const tokens = buildTokens(user);
  await saveRefreshToken(user.id, tokens.refreshToken);
  return { user, ...tokens, deviceId };
}
