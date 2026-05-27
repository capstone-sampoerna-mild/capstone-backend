import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../../controllers/documentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
