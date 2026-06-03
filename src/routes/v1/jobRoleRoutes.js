import express from 'express';
import {
  recommendJobRole,
} from '../../controllers/jobRoleController.js';

const router = express.Router();
/**
 * @swagger
 * /api/v1/job-role/recommend:
 *   post:
 *     summary: Recommend job role (local model)
 *     description: Generate job role recommendation based on skills
 *     tags:
 *       - Job Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRoleRecommendRequest'
 *     responses:
 *       200:
 *         description: Recommendation result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleRecommendResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */
// CHECKPOINT: AI/ML integration for job role recommendations
router.post('/job-role/recommend', recommendJobRole);

export default router;
