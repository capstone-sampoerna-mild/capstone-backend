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

/**
 * @swagger
 * /api/v1/pathway:
 *   post:
 *     summary: Menambahkan skill baru ke checklist
 *     tags: [Pathway]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - skill_name
 *               - target_role
 *             properties:
 *               user_id:
 *                 type: string
 *               skill_name:
 *                 type: string
 *               target_role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill berhasil ditambahkan
 *       400:
 *         description: Parameter tidak lengkap
 *       500:
 *         description: Internal server error
 */
router.post('/pathway', createPathwaySkill);

/**
 * @swagger
 * /api/v1/pathway/{userId}:
 *   get:
 *     summary: Mengambil semua skill dalam checklist user
 *     tags: [Pathway]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 *       400:
 *         description: Parameter userId diperlukan
 *       500:
 *         description: Internal server error
 */
router.get('/pathway/:userId', getPathwaySkills);

/**
 * @swagger
 * /api/v1/pathway/{id}/status:
 *   patch:
 *     summary: Memperbarui status skill
 *     tags: [Pathway]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Status berhasil diperbarui
 *       400:
 *         description: Parameter tidak valid
 *       500:
 *         description: Internal server error
 */
router.patch('/pathway/:id/status', updatePathwaySkillStatus);

/**
 * @swagger
 * /api/v1/pathway/{id}:
 *   delete:
 *     summary: Menghapus skill dari checklist
 *     tags: [Pathway]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Skill berhasil dihapus
 *       400:
 *         description: Parameter id diperlukan
 *       500:
 *         description: Internal server error
 */
router.delete('/pathway/:id', deletePathwaySkill);

export default router;
