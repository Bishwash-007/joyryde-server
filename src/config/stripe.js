import Stripe from 'stripe';
import { env } from './env.js';

export const stripeClient = new Stripe(env.stripeSecretKey, {
  apiVersion: '2024-10-28.acacia'
});
