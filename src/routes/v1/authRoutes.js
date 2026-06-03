import express from 'express';
import { loginWithGoogle, refreshAccessToken } from '../../controllers/authController.js';

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

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Issue a new access token using a refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/auth/refresh', refreshAccessToken);

export default router;
