import { Router } from 'express';
import {
	getUserController,
	updateUserController,
	nearbyUsersController,
  uploadAvatarController,
  uploadKYCController
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { getUserSchema, updateUserSchema, nearbyUsersSchema } from '../validators/userSchemas.js';

const router = Router();

router.get('/:id', requireAuth, validate(getUserSchema), getUserController);
router.patch('/:id', requireAuth, validate(updateUserSchema), updateUserController);
router.patch('/:id/avatar', requireAuth, upload.single('file'), validate(getUserSchema), uploadAvatarController);
router.patch('/:id/kyc', requireAuth, upload.single('file'), validate(getUserSchema), uploadKYCController);

export default router;
