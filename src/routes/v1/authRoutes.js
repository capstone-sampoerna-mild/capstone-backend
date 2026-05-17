import express from 'express';
import { loginWithGoogle } from '../../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Login with Google via Firebase
 *     description: Verifies Firebase ID token issued from Google sign-in and returns user profile claims.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthGoogleRequest'
 *           examples:
 *             firebaseToken:
 *               summary: Firebase ID token
 *               value:
 *                 idToken: eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
 *     responses:
 *       200:
 *         description: Google login verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthGoogleResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication failed
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
router.post('/auth/google', loginWithGoogle);

export default router;
