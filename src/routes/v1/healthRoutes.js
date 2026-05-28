import express from 'express';
import { healthCheck } from '../../controllers/healthController.js';

const router = express.Router();
/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     description: Check API gateway status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CHECKPOINT: RESTful API endpoint for service health
router.get('/health', healthCheck);

export default router;
