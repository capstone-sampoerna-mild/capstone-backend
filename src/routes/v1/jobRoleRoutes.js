import express from 'express';
import {
  recommendJobRole,
  recommendJobRoleGemini,
  recommendJobRoleStream,
  recommendJobRoleGeminiStream,
} from '../../controllers/jobRoleController.js';

const router = express.Router();
// CHECKPOINT: AI/ML integration for job role recommendations
router.post('/job-role/recommend', recommendJobRole);
router.post('/job-role/recommend/gemini', recommendJobRoleGemini);
router.post('/job-role/recommend/stream', recommendJobRoleStream);
router.post('/job-role/recommend/gemini/stream', recommendJobRoleGeminiStream);

export default router;
