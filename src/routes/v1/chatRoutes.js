import express from 'express';
import { streamAiChat } from '../../controllers/chatController.js';

const router = express.Router();
// CHECKPOINT: AI/ML integration via chat stream proxy
router.post('/chat/ai/stream', streamAiChat);

export default router;