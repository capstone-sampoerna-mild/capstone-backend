import express from 'express';
import { getHistoryProgress } from '../../controllers/historyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: History
 *   description: API untuk mengelola histori analisis CV user
 */

/**
 * @swagger
 * /api/v1/history/progress/{userId}:
 *   get:
 *     summary: Mengambil progress analisis CV user
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data progress tracker berhasil diambil
 *       400:
 *         description: Parameter userId diperlukan
 *       500:
 *         description: Internal server error
 */
router.get('/history/progress/:userId', getHistoryProgress);

export default router;
