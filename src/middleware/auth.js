import { verifyAccessToken } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import { User } from '../models/index.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError(401, 'Missing token');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError(401, 'Invalid user');
    req.user = user;
    next();
  } catch (error) {
    next(new AppError(401, 'Unauthorized', error.message));
  }
}

export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden'));
    }
    next();
  };
