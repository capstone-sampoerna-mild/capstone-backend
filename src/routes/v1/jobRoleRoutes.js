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
 *     summary: Job role recommendation
 *     description: Proxies the request to FastAPI job role recommendation endpoint.
 *     tags:
 *       - Job Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRoleRecommendRequest'
 *           examples:
 *             basic:
 *               summary: Job role request
 *               value:
 *                 name: Budi
 *                 skillset: ["React", "NextJS"]
 *     responses:
 *       200:
 *         description: Job role recommendation response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleRecommendResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/job-role/recommend', recommendJobRole);

/**
 * @swagger
 * /api/v1/job-role/recommend/gemini:
 *   post:
 *     summary: Job role recommendation (Gemini)
 *     description: Proxies the request to FastAPI Gemini job role recommendation endpoint.
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
 *         description: Job role recommendation response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleRecommendResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/job-role/recommend/gemini', recommendJobRoleGemini);

/**
 * @swagger
 * /api/v1/job-role/recommend/stream:
 *   post:
 *     summary: Job role recommendation stream
 *     description: Proxies the request to FastAPI job role streaming endpoint.
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
 *         description: SSE stream of recommendation tokens
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/job-role/recommend/stream', recommendJobRoleStream);

/**
 * @swagger
 * /api/v1/job-role/recommend/gemini/stream:
 *   post:
 *     summary: Job role recommendation stream (Gemini)
 *     description: Proxies the request to FastAPI Gemini job role streaming endpoint.
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
 *         description: SSE stream of recommendation tokens
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/job-role/recommend/gemini/stream', recommendJobRoleGeminiStream);

export default router;
