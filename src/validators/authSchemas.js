import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['rider', 'driver']).optional(),
    phone: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string() })
});

export const otpRequestSchema = z.object({
  body: z.object({ email: z.string().email() })
});

export const otpVerifySchema = z.object({
  body: z.object({ email: z.string().email(), code: z.string().length(6) })
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string() })
});

export const biometricSchema = z.object({
  body: z.object({
    userId: z.string(),
    deviceId: z.string(),
    publicKey: z.string().optional()
  })
});
