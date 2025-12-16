import { Router } from 'express';
import {
  listRidesController,
  bidController,
  payController,
  reviewController
} from '../controllers/riderController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listRidesSchema, bidSchema, paySchema, reviewSchema } from '../validators/rideSchemas.js';

const router = Router();

router.get(
  '/rides',
  requireAuth,
  requireRole('rider'),
  validate(listRidesSchema),
  listRidesController
);
router.post(
  '/rides/:id/bid',
  requireAuth,
  requireRole('rider'),
  validate(bidSchema),
  bidController
);
router.post(
  '/rides/:id/pay',
  requireAuth,
  requireRole('rider'),
  validate(paySchema),
  payController
);
router.post(
  '/rides/:id/review',
  requireAuth,
  requireRole('rider'),
  validate(reviewSchema),
  reviewController
);

export default router;
