import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { supabase } from '../utils/supabaseClient.js';
import { resolveProfileId, extractSkillset } from './documentController.js';

const getCvSkills = async (userId) => {
  const { data, error } = await supabase
    .from('ai_analysis_history')
    .select('ai_output_response')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return [];
  return extractSkillset(data.ai_output_response) || [];
};

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

    // Jika status completed, tambahkan ke user_skillsets
    if (status === 'completed' && data && data.user_id && data.skill_name) {
      const userId = data.user_id;
      const skillName = data.skill_name;

      const { data: skillsetRecord, error: skillsetError } = await supabase
        .from('user_skillsets')
        .select('skills')
        .eq('user_id', userId)
        .single();
      
      let updatedSkills = [skillName];

      if (!skillsetError && skillsetRecord && Array.isArray(skillsetRecord.skills)) {
        const currentSkills = skillsetRecord.skills;
        const normalizedNewSkill = skillName.trim();
        const exists = currentSkills.some(s => typeof s === 'string' && s.toLowerCase() === normalizedNewSkill.toLowerCase());
        
        if (!exists) {
          updatedSkills = [...currentSkills, normalizedNewSkill];
          await supabase
            .from('user_skillsets')
            .upsert({
              user_id: userId,
              skills: updatedSkills,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }
      } else {
        await supabase
            .from('user_skillsets')
            .upsert({
              user_id: userId,
              skills: updatedSkills,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
      }
    } else if (status === 'pending' && data && data.user_id && data.skill_name) {
      const userId = data.user_id;
      const skillName = data.skill_name.trim().toLowerCase();

      const { data: skillsetRecord } = await supabase
        .from('user_skillsets')
        .select('skills')
        .eq('user_id', userId)
        .single();
      
      if (skillsetRecord && Array.isArray(skillsetRecord.skills)) {
        const cvSkills = await getCvSkills(userId);
        const cvSkillsLower = cvSkills.map(s => s.toLowerCase());

        if (!cvSkillsLower.includes(skillName)) {
          const updatedSkills = skillsetRecord.skills.filter(s => typeof s === 'string' && s.toLowerCase() !== skillName);
          await supabase
            .from('user_skillsets')
            .update({ skills: updatedSkills, updated_at: new Date().toISOString() })
            .eq('user_id', userId);
        }
      }
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

    const { data: skillData } = await supabase
      .from('user_target_skills')
      .select('user_id, skill_name, status')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('user_target_skills')
      .delete()
      .eq('id', id);

    if (error) {
      throw new InternalServerError('Gagal menghapus skill dari pathway.', error);
    }

    if (skillData && skillData.status === 'completed') {
      const userId = skillData.user_id;
      const skillName = skillData.skill_name.trim().toLowerCase();

      const { data: skillsetRecord } = await supabase
        .from('user_skillsets')
        .select('skills')
        .eq('user_id', userId)
        .single();

      if (skillsetRecord && Array.isArray(skillsetRecord.skills)) {
        const cvSkills = await getCvSkills(userId);
        const cvSkillsLower = cvSkills.map(s => s.toLowerCase());

        if (!cvSkillsLower.includes(skillName)) {
          const updatedSkills = skillsetRecord.skills.filter(s => typeof s === 'string' && s.toLowerCase() !== skillName);
          await supabase
            .from('user_skillsets')
            .update({ skills: updatedSkills, updated_at: new Date().toISOString() })
            .eq('user_id', userId);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Skill berhasil dihapus dari pathway.'
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/pathway/user/:userId/reset - Menghapus semua skill pathway dari seorang user
export const resetPathwaySkills = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ValidationError('Parameter userId diperlukan.');
    }

    const profileId = await resolveProfileId(userId);
    if (!profileId) {
      throw new ValidationError('User profile tidak ditemukan.');
    }

    const { error } = await supabase
      .from('user_target_skills')
      .delete()
      .eq('user_id', profileId);

    if (error) {
      throw new InternalServerError('Gagal me-reset skill dari pathway.', error);
    }

    const cvSkills = await getCvSkills(profileId);
    await supabase
      .from('user_skillsets')
      .update({ skills: cvSkills, updated_at: new Date().toISOString() })
      .eq('user_id', profileId);

    return res.status(200).json({
      success: true,
      message: 'Semua skill berhasil di-reset (dihapus) dari pathway.'
    });
  } catch (error) {
    next(error);
  }
};
