import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { supabase } from '../utils/supabaseClient.js';
import { resolveProfileId } from './documentController.js';

/**
 * Controller untuk mengelola Pathway (Skill Checklist)
 */

// POST /api/v1/pathway - Menambahkan skill baru ke checklist
export const createPathwaySkill = async (req, res, next) => {
  try {
    const { user_id, skill_name, target_role } = req.body;

    if (!user_id || !skill_name || !target_role) {
      throw new ValidationError('user_id, skill_name, dan target_role diperlukan.');
    }

    // Ubah Firebase UID dari req.body menjadi UUID profil dari database
    const profileId = await resolveProfileId(user_id);
    if (!profileId) {
      throw new ValidationError('User profile tidak ditemukan untuk user_id tersebut.');
    }

    const { data, error } = await supabase
      .from('user_target_skills')
      .insert({
        user_id: profileId,
        skill_name,
        target_role,
        status: 'pending', // Default status
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerError('Gagal menyimpan skill ke pathway.', error);
    }

    return res.status(201).json({
      success: true,
      message: 'Skill berhasil ditambahkan ke pathway.',
      data
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/pathway/:userId - Mengambil semua skill dalam checklist user
export const getPathwaySkills = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      throw new ValidationError('Parameter userId diperlukan.');
    }

    const profileId = await resolveProfileId(userId);
    if (!profileId) {
      throw new ValidationError('User profile tidak ditemukan.');
    }

    // Mengambil data dan mengurutkan: target_role ASC, status DESC (pending huruf p lebih tinggi dari completed huruf c)
    const { data, error } = await supabase
      .from('user_target_skills')
      .select('*')
      .eq('user_id', profileId)
      .order('target_role', { ascending: true })
      .order('status', { ascending: false });

    if (error) {
      throw new InternalServerError('Gagal mengambil data pathway.', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Data pathway berhasil diambil.',
      data
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/pathway/:id/status - Memperbarui status skill (misal: 'completed')
export const updatePathwaySkillStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      throw new ValidationError('Parameter id dan body status diperlukan.');
    }

    const { data, error } = await supabase
      .from('user_target_skills')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerError('Gagal memperbarui status skill.', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Status skill berhasil diperbarui.',
      data
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/pathway/:id - Menghapus skill dari checklist
export const deletePathwaySkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Parameter id diperlukan.');
    }

    const { error } = await supabase
      .from('user_target_skills')
      .delete()
      .eq('id', id);

    if (error) {
      throw new InternalServerError('Gagal menghapus skill dari pathway.', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Skill berhasil dihapus dari pathway.'
    });
  } catch (error) {
    next(error);
  }
};
