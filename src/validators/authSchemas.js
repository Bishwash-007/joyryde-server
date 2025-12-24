import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({ email: z.email(), password: z.string() })
});

export const otpRequestSchema = z.object({
  body: z.object({ email: z.email() })
});

export const otpVerifySchema = z.object({
  body: z.object({ email: z.email(), code: z.string().length(6) })
});

export const completeSignupSchema = z.object({
  body: z.object({
    email: z.email(),
    code: z.string().length(6),
    password: z.string().min(8),
    name: z.string().optional(),
    phone: z.string().optional()
  })
});

export const passwordResetRequestSchema = z.object({
  body: z.object({ email: z.email() })
});

export const passwordResetResendSchema = z.object({
  body: z.object({ email: z.email() })
});

export const passwordResetSchema = z.object({
  body: z.object({
    email: z.email(),
    code: z.string().length(6),
    password: z.string().min(8)
  })
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
