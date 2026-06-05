import express from 'express';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import jobRoleRoutes from './jobRoleRoutes.js';
import documentRoutes from './documentRoutes.js';
import profileRoutes from './profileRoutes.js';
import jobRoutes from './jobRoutes.js';

const router = express.Router();
// CHECKPOINT: RESTful API versioning for frontend integration
router.use('/', healthRoutes);
router.use('/', authRoutes);
router.use('/', jobRoleRoutes);
router.use('/', documentRoutes);
router.use('/', profileRoutes);
router.use('/', jobRoutes);

export default router;
