import { describe, it, expect } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../src/utils/token.js';
import { AppError } from '../src/utils/errors.js';

describe('auth utilities', () => {
  it('signs and verifies access tokens', () => {
    const token = signAccessToken({ sub: '123', role: 'rider' });
    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe('123');
    expect(decoded.role).toBe('rider');
  });

  it('creates AppError with status', () => {
    const err = new AppError(401, 'Unauthorized');
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Unauthorized');
  });
});
