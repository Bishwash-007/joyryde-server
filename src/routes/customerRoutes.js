import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerRideHistory,
  deleteCustomerAccount
} from '../controllers/customerController.js';

const router = Router();

// Get customer profile
router.get('/profile', requireAuth, getCustomerProfile);

// Update customer profile
router.put('/profile', requireAuth, updateCustomerProfile);

// Get customer ride history
router.get('/rides', requireAuth, getCustomerRideHistory);

// Delete customer account
router.delete('/account', requireAuth, deleteCustomerAccount);

export default router;
