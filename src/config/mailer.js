import nodemailer from 'nodemailer';
import { isDev } from './env.js';

let mailer;

async function createMailer() {
  if (isDev) {
    // Use Ethereal Email for development (free test service)
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
  // Production: configure with SendGrid, Mailgun, or your email service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export async function verifyMailer() {
  try {
    mailer = await createMailer();
    await mailer.verify();
  } catch (error) {
    // Non-fatal in dev, but log for visibility
    // eslint-disable-next-line no-console
    console.error('Email setup failed', error);
  }
}

export { mailer };
