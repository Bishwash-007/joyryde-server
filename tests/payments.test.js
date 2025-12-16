import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/config/stripe.js', () => ({
  stripeClient: {
    paymentIntents: {
      create: vi.fn().mockResolvedValue({ id: 'pi_123', client_secret: 'secret', status: 'requires_payment_method' })
    }
  }
}));

vi.mock('../src/models/index.js', () => ({
  Ride: { findById: vi.fn().mockResolvedValue({ id: 'ride1', price: 25, driver: 'driver1' }) },
  Payment: { create: vi.fn().mockResolvedValue({ id: 'pay1' }) }
}));

import { payForRide } from '../src/services/paymentService.js';
import { stripeClient } from '../src/config/stripe.js';
import { Payment, Ride } from '../src/models/index.js';

describe('payment service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a payment intent and record', async () => {
    const result = await payForRide('ride1', 'user1', 'pm_123');
    expect(stripeClient.paymentIntents.create).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ ride: 'ride1', from: 'user1', to: 'driver1' })
    );
    expect(result.payment.id).toBe('pay1');
  });
});
