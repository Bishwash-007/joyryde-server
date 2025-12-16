import { Router } from 'express';
import {
  uploadRidePhotoController,
  uploadVehiclePhotoController
} from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/ride', requireAuth, upload.single('file'), uploadRidePhotoController);
router.post('/vehicle', requireAuth, upload.single('file'), uploadVehiclePhotoController);

export default router;
