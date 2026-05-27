import express from 'express';
import { streamAiChat } from '../../controllers/chatController.js';

const router = express.Router();
router.post('/chat/ai/stream', streamAiChat);

export default router;