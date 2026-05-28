import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../../controllers/documentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/v1/document/upload:
 *   post:
 *     summary: Upload CV or certificate PDF
 *     description: Upload a single PDF file for AI processing
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
 *                 description: PDF file (alternative to cv/certificate)
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: PDF CV file (optional)
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: PDF certificate file (optional)
 *               documentType:
 *                 type: string
 *                 enum: [cv, certificate]
 *                 description: Document type label
 *     responses:
 *       200:
 *         description: Document processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentUploadResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Upstream or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// CHECKPOINT: RESTful API upload endpoint (CV/sertifikat) for AI processing
router.post(
	'/document/upload',
	upload.fields([
		{ name: 'cv', maxCount: 1 },
		{ name: 'certificate', maxCount: 1 },
		{ name: 'file', maxCount: 1 },
	]),
	uploadDocument
);

export default router;
