import express from 'express';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';
import jobRoleRoutes from './jobRoleRoutes.js';
import documentRoutes from './documentRoutes.js';

const router = express.Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
router.use('/', healthRoutes);
router.use('/', authRoutes);
router.use('/', chatRoutes);
router.use('/', jobRoleRoutes);
router.use('/', documentRoutes);

export default router;
