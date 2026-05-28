import express from 'express';
import { loginWithGoogle } from '../../controllers/authController.js';

const router = express.Router();
/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Verify Google login via Firebase
 *     description: Validate Firebase ID token from Google sign-in
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthGoogleRequest'
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthGoogleResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CHECKPOINT: RESTful API endpoint for Firebase Google login
router.post('/auth/google', loginWithGoogle);

export default router;
