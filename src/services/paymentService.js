import { Payment, Ride } from '../models/index.js';
import { stripeClient } from '../config/stripe.js';
import { AppError } from '../utils/errors.js';

export async function payForRide(rideId, fromUserId, paymentMethodId) {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(404, 'Ride not found');

  const amount = Math.round(ride.price * 100);
  const intent = await stripeClient.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: false,
    metadata: { rideId, fromUserId, toUserId: ride.driver?.toString() }
  });

  const payment = await Payment.create({
    ride: rideId,
    from: fromUserId,
    to: ride.driver,
    amount: ride.price,
    providerPaymentIntentId: intent.id,
    status: intent.status === 'succeeded' ? 'succeeded' : 'pending'
  });

  return { payment, intentClientSecret: intent.client_secret };
}
