import { config } from '../config/environment.js';

/**
 * Health Check Controller
 * Provides system health status and server information
 */
export const healthCheck = (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'Server is running and healthy',
    timestamp: new Date().toISOString(),
    version: config.apiVersion,
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
};
