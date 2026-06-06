import express from 'express';
import multer from 'multer';

import { getUserDocuments, uploadDocument, extractFromGithub } from '../../controllers/documentController.js';
import { authenticateJwt } from '../../middlewares/jwtAuth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * @swagger
 * /api/v1/document/upload:
 *   post:
 *     summary: Upload PDF for analysis
 *     description: Upload a PDF file for AI processing
 *     tags:
 *       - Document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file
 *               userId:
 *                 type: string
 *                 description: User ID (Firebase UID) to persist skillset
 *
 *     responses:
 *       200:
 *         description: Document processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentUploadResponse'
 *
 *       400:
 *         description: Invalid request
 *
 *       500:
 *         description: Internal server error
 */

router.post('/document/upload', authenticateJwt, upload.single('file'), uploadDocument);

/**
 * @swagger
 * /api/v1/document/github:
 *   post:
 *     summary: Extract skills from Github Repository
 *     description: Process a Github repository URL via AI to extract skills
 *     tags:
 *       - Document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               github_url:
 *                 type: string
 *                 description: GitHub repository URL
 *     responses:
 *       200:
 *         description: Extracted skills from github repository
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/document/github', authenticateJwt, extractFromGithub);

/**
 * @swagger
 * /api/v1/document:
 *   get:
 *     summary: Get user documents
 *     description: Fetch uploaded documents for a user
 *     tags:
 *       - Document
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
 *         description: Documents retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentListResponse'
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
router.get('/document', authenticateJwt, getUserDocuments);

export default router;
