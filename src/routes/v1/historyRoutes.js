import express from 'express';
import { getHistoryProgress } from '../../controllers/historyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: History
 *   description: API untuk mengelola histori analisis CV user
 */

router.get('/history/progress/:userId', getHistoryProgress);

export default router;
