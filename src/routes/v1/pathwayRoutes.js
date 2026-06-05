import express from 'express';
import { 
  createPathwaySkill, 
  getPathwaySkills, 
  updatePathwaySkillStatus, 
  deletePathwaySkill 
} from '../../controllers/pathwayController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pathway
 *   description: API untuk mengelola to-do list skill user (My Pathway)
 */

router.post('/pathway', createPathwaySkill);
router.get('/pathway/:userId', getPathwaySkills);
router.patch('/pathway/:id/status', updatePathwaySkillStatus);
router.delete('/pathway/:id', deletePathwaySkill);

export default router;
