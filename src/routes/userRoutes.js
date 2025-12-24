import { Router } from 'express';
import {
  getUserController,
  updateUserController,
  nearbyUsersController,
  uploadAvatarController,
  uploadKYCController,
  updateSelfController
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  getUserSchema,
  updateUserSchema,
  updateSelfSchema,
  nearbyUsersSchema
} from '../validators/userSchemas.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateSelfSchema), updateSelfController);
router.get('/:id', requireAuth, validate(getUserSchema), getUserController);
router.patch('/:id', requireAuth, validate(updateUserSchema), updateUserController);
router.patch(
  '/:id/avatar',
  requireAuth,
  upload.single('file'),
  validate(getUserSchema),
  uploadAvatarController
);
router.patch(
  '/:id/kyc',
  requireAuth,
  upload.single('file'),
  validate(getUserSchema),
  uploadKYCController
);

export default router;
