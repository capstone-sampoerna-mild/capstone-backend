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
    console.log('[jwtAuth] Token received (first 20 chars):', token.substring(0, 20) + '...');
    console.log('[jwtAuth] Token length:', token.length);
    console.log('[jwtAuth] JWT_SECRET loaded:', config.jwt.accessSecret ? `yes (${config.jwt.accessSecret.substring(0, 8)}...)` : 'NO - EMPTY!');
    const payload = jwt.verify(token, config.jwt.accessSecret);
    console.log('[jwtAuth] Token verified OK. sub:', payload.sub);
    req.userId = payload.sub;
    req.jwtPayload = payload;
    next();
  } catch (error) {
    console.error('[jwtAuth] jwt.verify FAILED:', error.message);
    console.error('[jwtAuth] Error name:', error.name);
    next(new AuthenticationError('Invalid or expired access token'));
  }
};
