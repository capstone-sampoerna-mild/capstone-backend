import express from 'express';
import { loginWithGoogle } from '../../controllers/authController.js';

const router = express.Router();
// CHECKPOINT: RESTful API endpoint for Firebase Google login
router.post('/auth/google', loginWithGoogle);

export default router;
