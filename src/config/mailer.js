import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort || 587,
  secure: env.smtpSecure ?? false,
  auth:
    env.smtpUser && env.smtpPass
      ? {
          user: env.smtpUser,
          pass: env.smtpPass
        }
      : undefined
});

export default transporter;
