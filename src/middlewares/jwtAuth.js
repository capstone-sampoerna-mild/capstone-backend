import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/APIError.js';
import { config } from '../config/environment.js';

export const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    next(new AuthenticationError('Missing access token'));
    return;
  }

  if (!config.jwt.accessSecret) {
    next(new AuthenticationError('JWT secret is not configured'));
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.userId = payload.sub;
    req.jwtPayload = payload;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired access token'));
  }
};
