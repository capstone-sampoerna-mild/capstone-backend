import express from 'express';
import multer from 'multer';

import { getUserDocuments, uploadDocument } from '../../controllers/documentController.js';

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

router.post('/document/upload', upload.single('file'), uploadDocument);

/**
 * @swagger
 * /api/v1/document:
 *   get:
 *     summary: Get user documents
 *     description: Fetch uploaded documents for a user
 *     tags:
 *       - Document
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
router.get('/document', getUserDocuments);

export default router;
