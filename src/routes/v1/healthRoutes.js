import express from 'express';
import { healthCheck } from '../../controllers/healthController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health Check Endpoint
 *     description: Checks if the API server is running and healthy. Returns server status, version, and uptime.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ['ok']
 *                   example: 'ok'
 *                 message:
 *                   type: string
 *                   example: 'Server is running and healthy'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-04-08T10:30:00Z'
 *                 version:
 *                   type: string
 *                   example: 'v1'
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 1234.5
 *                 environment:
 *                   type: string
 *                   enum: ['development', 'production']
 *                   example: 'development'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/health', healthCheck);

export default router;
