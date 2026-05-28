import express from 'express';
import multer from 'multer';

import {
  uploadDocument,
} from '../../controllers/documentController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * @swagger
 * /api/v1/document/upload:
 *   post:
 *     summary: Upload CV or certificate PDF
 *     description: Upload CV/certificate and combine with manual skill input for AI analysis
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
 *                 description: Generic PDF file
 *
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: CV PDF file
 *
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate PDF file
 *
 *               skillset:
 *                 type: string
 *                 example: '["react","nodejs","mysql"]'
 *                 description: JSON stringified skill array
 *
 *               name:
 *                 type: string
 *                 example: Eval Putra
 *
 *               documentType:
 *                 type: string
 *                 enum: [cv, certificate]
 *
 *     responses:
 *       200:
 *         description: Document processed successfully
 *
 *       400:
 *         description: Invalid request
 *
 *       500:
 *         description: Internal server error
 */

router.post(
  '/document/upload',

  upload.fields([
    {
      name: 'cv',
      maxCount: 1,
    },
    {
      name: 'certificate',
      maxCount: 1,
    },
    {
      name: 'file',
      maxCount: 1,
    },
  ]),

  uploadDocument
);

export default router;
