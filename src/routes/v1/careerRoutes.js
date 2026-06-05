import express from 'express';
import { getRoadmap } from '../../controllers/careerController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/career/roadmap:
 *   post:
 *     summary: Generate learning roadmap based on skill gaps
 *     description: Returns a prioritized learning roadmap based on industry demand percentages from Supabase view.
 *     tags:
 *       - Career
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillGaps
 *             properties:
 *               skillGaps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SQL", "GIT", "Power bi", "AWS", "Airflow"]
 *     responses:
 *       200:
 *         description: Roadmap generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 roadmap:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       langkah:
 *                         type: integer
 *                       skill:
 *                         type: string
 *                       skor_urgensi:
 *                         type: string
 *                       kategori:
 *                         type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/career/roadmap', getRoadmap);

export default router;
