import express from 'express';
import { loginWithGoogle } from '../../controllers/authController.js';

const router = express.Router();
router.post('/auth/google', loginWithGoogle);

export default router;
