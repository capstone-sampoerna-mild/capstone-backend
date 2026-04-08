import express from 'express';
import v1Routes from './v1/index.js';

const router = express.Router();

/**
 * API Route Versioning
 * Routes are organized by API version for better maintainability
 */
router.use('/v1', v1Routes);

export default router;
