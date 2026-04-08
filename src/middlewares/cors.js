import cors from 'cors';
import { config } from '../config/environment.js';

/**
 * CORS Middleware Configuration
 * Enables Cross-Origin Resource Sharing with specified origin and credentials
 */
export const corsMiddleware = cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
});
