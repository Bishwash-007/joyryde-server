import { createClerkClient } from '@clerk/express';
import { env } from './env.js';

export const clerkClient = createClerkClient({
  secretKey: env.clerkSecret
});

export async function verifyClerkToken(sessionToken) {
  if (!sessionToken) return null;
  try {
    const session = await clerkClient.verifyToken(sessionToken);
    return session;
  } catch (error) {
    return null;
  }
}
