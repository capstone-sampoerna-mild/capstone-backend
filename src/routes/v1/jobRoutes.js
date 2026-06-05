import express from 'express';
import { recommendJobs } from '../../controllers/jobController.js';
import { authenticateJwt } from '../../middlewares/jwtAuth.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/jobs/recommendations:
 *   post:
 *     summary: Get job recommendations based on skills
 *     description: Fetch 5 relevant jobs from the job_data table based on the provided skillcore.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillset
 *             properties:
 *               skillset:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *     responses:
 *       200:
 *         description: Job recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           company:
 *                             type: string
 *                           location:
 *                             type: string
 *                           job_url:
 *                             type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/jobs/recommendations', authenticateJwt, recommendJobs);

export default router;
