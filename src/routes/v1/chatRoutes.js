import express from 'express';
import { streamAiChat } from '../../controllers/chatController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/chat/ai/stream:
 *   post:
 *     summary: Stream AI Chat Response
 *     description: Proxies the request to FastAPI `/chat-ai/stream` and streams the upstream response back to client.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *           examples:
 *             simplePrompt:
 *               summary: Prompt request
 *               value:
 *                 prompt: Jelaskan skill gap untuk menjadi Data Engineer.
 *     responses:
 *       200:
 *         description: Stream or JSON response from FastAPI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *           text/event-stream:
 *             schema:
 *               type: string
 *       422:
 *         description: Validation error from upstream FastAPI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Gateway server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/chat/ai/stream', streamAiChat);

export default router;