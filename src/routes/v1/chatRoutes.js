import express from 'express';
import { streamAiChat } from '../../controllers/chatController.js';

const router = express.Router();
/**
 * @swagger
 * /api/v1/chat/ai/stream:
 *   post:
 *     summary: Stream AI chat response
 *     description: Proxy streaming chat response from FastAPI (SSE)
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Streamed chat response
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
 *       500:
 *         description: Upstream or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CHECKPOINT: AI/ML integration via chat stream proxy
router.post('/chat/ai/stream', streamAiChat);

export default router;