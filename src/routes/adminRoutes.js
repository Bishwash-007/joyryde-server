import { Router } from 'express';
import {
  dashboardController,
  kycController,
  reportsController
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, requireRole('admin'), dashboardController);
router.patch('/kyc/:userId', requireAuth, requireRole('admin'), kycController);
router.get('/reports', requireAuth, requireRole('admin'), reportsController);

export default router;
