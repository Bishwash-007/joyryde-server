import { Router } from 'express';
import { createRideController, driverRidesController, updateRideController } from '../controllers/driverController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRideSchema, updateRideSchema } from '../validators/rideSchemas.js';

const router = Router();

router.post('/ride', requireAuth, requireRole('driver'), validate(createRideSchema), createRideController);
router.get('/rides', requireAuth, requireRole('driver'), driverRidesController);
router.patch('/ride/:id', requireAuth, requireRole('driver'), validate(updateRideSchema), updateRideController);

export default router;
