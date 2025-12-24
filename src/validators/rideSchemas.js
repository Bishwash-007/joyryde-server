import { z } from 'zod';

const geoPoint = z.object({ coordinates: z.tuple([z.number(), z.number()]) });

export const createRideSchema = z.object({
  body: z.object({
    origin: geoPoint,
    destination: geoPoint,
    seatsAvailable: z.number().min(1),
    price: z.number().positive(),
    departureTime: z.date().optional()
  })
});

export const updateRideSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({
    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
    seatsAvailable: z.number().min(0).optional()
  })
});

export const listRidesSchema = z.object({
  query: z.object({
    lng: z.coerce.number().optional(),
    lat: z.coerce.number().optional(),
    radiusKm: z.coerce.number().default(10)
  })
});

export const bidSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({ offerPrice: z.number().positive() })
});

export const paySchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({ paymentMethodId: z.string().optional() })
});

export const reviewSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({ rating: z.number().min(1).max(5), comment: z.string().optional() })
});
