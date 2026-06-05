import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { supabase } from '../utils/supabaseClient.js';

export const getRoadmap = async (req, res, next) => {
  try {
    const { skillGaps } = req.body;

    if (!skillGaps || !Array.isArray(skillGaps) || skillGaps.length === 0) {
      throw new ValidationError('skillGaps is required and must be a non-empty array of strings.');
    }

    // Transform array to lowercase
    const lowerSkillGaps = skillGaps.map(skill => {
      return typeof skill === 'string' ? skill.toLowerCase() : '';
    }).filter(skill => skill !== '');

    if (lowerSkillGaps.length === 0) {
      throw new ValidationError('skillGaps must contain valid strings.');
    }

    // Fetch from Supabase View
    const { data, error } = await supabase
      .from('v_job_skill_percentages')
      .select('skill_name, persentase_industri')
      .in('skill_name', lowerSkillGaps)
      .order('persentase_industri', { ascending: false });

    if (error) {
      throw new InternalServerError('Failed to fetch skill percentages from database', error);
    }

    // Mapping output for frontend
    const roadmap = data.map((item, index) => {
      const persentase = parseFloat(item.persentase_industri);
      let kategori = "Nilai Tambah (Good to Have)";
      
      if (persentase >= 60) {
        kategori = "Sangat Penting (Wajib Dipelajari)";
      } else if (persentase >= 30) {
        kategori = "Penting (Direkomendasikan)";
      }

      return {
        langkah: index + 1,
        skill: item.skill_name.toUpperCase(),
        skor_urgensi: `${persentase}% loker meminta ini`,
        kategori: kategori
      };
    });

    return res.status(200).json({
      success: true,
      message: "Roadmap berhasil disusun berdasarkan prioritas industri.",
      roadmap: roadmap
    });
  } catch (error) {
    next(error);
  }
};
