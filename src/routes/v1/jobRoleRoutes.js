import express from 'express';
import {
  recommendJobRole,
  recommendJobRoleGemini,
  recommendJobRoleStream,
  recommendJobRoleGeminiStream,
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
 * /api/v1/job-role/recommend/gemini:
 *   post:
 *     summary: Recommend job role (Gemini)
 *     description: Generate job role recommendation via Gemini
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
 * /api/v1/job-role/recommend/stream:
 *   post:
 *     summary: Stream job role recommendation (local model)
 *     description: Stream recommendation via SSE
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
 *         description: Streamed recommendation
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job-role/recommend/gemini/stream:
 *   post:
 *     summary: Stream job role recommendation (Gemini)
 *     description: Stream recommendation via SSE from Gemini
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
 *         description: Streamed recommendation
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CHECKPOINT: AI/ML integration for job role recommendations
router.post('/job-role/recommend', recommendJobRole);
router.post('/job-role/recommend/gemini', recommendJobRoleGemini);
router.post('/job-role/recommend/stream', recommendJobRoleStream);
router.post('/job-role/recommend/gemini/stream', recommendJobRoleGeminiStream);

export default router;
