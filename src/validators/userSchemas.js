import { z } from 'zod';

export const getUserSchema = z.object({
  params: z.object({ id: z.string().length(24) })
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({
    profile: z
      .object({ name: z.string().optional(), avatarUrl: z.string().url().optional() })
      .optional(),
    phone: z.string().optional(),
    location: z.object({ coordinates: z.tuple([z.number(), z.number()]) }).optional(),
    paymentMethods: z
      .array(
        z.object({
          provider: z.string(),
          providerCustomerId: z.string().optional(),
          last4: z.string().optional()
        })
      )
      .optional()
  })
});

export const nearbyUsersSchema = z.object({
  query: z.object({
    lng: z.coerce.number(),
    lat: z.coerce.number(),
    radiusKm: z.coerce.number().default(5)
  })
});
