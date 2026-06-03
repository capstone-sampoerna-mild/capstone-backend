import express from 'express';
import multer from 'multer';

import { uploadDocument } from '../../controllers/documentController.js';

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

export default router;
