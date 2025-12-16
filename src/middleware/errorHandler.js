import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export function errorHandler(err, _req, res, _next) {
  const isZod = err instanceof ZodError;
  const statusCode = err.statusCode || (isZod ? 400 : 500);
  const message = isZod ? 'Validation failed' : err.message || 'Server error';

  if (statusCode >= 500) {
    logger.error({ err }, 'Server error');
  }

  res.status(statusCode).json({
    error: {
      message,
      details: isZod ? err.issues : err.details || null
    }
  });
}
