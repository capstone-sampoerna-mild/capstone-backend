import express from 'express';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';
import jobRoleRoutes from './jobRoleRoutes.js';
import documentRoutes from './documentRoutes.js';

const router = express.Router();
// CHECKPOINT: RESTful API versioning for frontend integration
router.use('/', healthRoutes);
router.use('/', authRoutes);
router.use('/', chatRoutes);
router.use('/', jobRoleRoutes);
router.use('/', documentRoutes);

export default router;
