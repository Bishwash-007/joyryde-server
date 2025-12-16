import crypto from 'crypto';
import { addMinutes } from './time.js';
import { OtpCode } from '../models/index.js';
import { hashToken } from '../utils/token.js';

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createOtp(userId) {
  const code = generateCode();
  const expiresAt = addMinutes(new Date(), 10);
  await OtpCode.create({ user: userId, code: hashToken(code), expiresAt });
  return { code, expiresAt };
}

export async function verifyOtp(userId, code) {
  const hashed = hashToken(code);
  const otp = await OtpCode.findOne({ user: userId, code: hashed, consumed: false, expiresAt: { $gt: new Date() } });
  if (!otp) return false;
  otp.consumed = true;
  await otp.save();
  return true;
}
