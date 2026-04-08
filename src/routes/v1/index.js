import express from 'express';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
router.use('/', healthRoutes);
router.use('/', chatRoutes);

export default router;
