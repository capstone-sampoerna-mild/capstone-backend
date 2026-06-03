import express from 'express';
import { getUserSkillset } from '../../controllers/profileController.js';
import { authenticateJwt } from '../../middlewares/jwtAuth.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/profile/skillset:
 *   get:
 *     summary: Get user skillset
 *     description: Fetch stored skillset for a user profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (Firebase UID)
 *     responses:
 *       200:
 *         description: Skillset retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSkillsetResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile/skillset', authenticateJwt, getUserSkillset);

export default router;
