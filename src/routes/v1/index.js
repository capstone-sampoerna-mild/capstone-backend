import express from 'express';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
router.use('/', healthRoutes);

export default router;
