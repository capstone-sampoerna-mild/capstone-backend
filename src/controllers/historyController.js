import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { supabase } from '../utils/supabaseClient.js';
import { resolveProfileId } from './documentController.js';

/**
 * Controller untuk mengelola Progress Tracker (Analisis Histori CV)
 */

// GET /api/v1/history/progress/:userId - Mengambil progress analisis CV user
export const getHistoryProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ValidationError('Parameter userId diperlukan.');
    }

    const profileId = await resolveProfileId(userId);
    if (!profileId) {
      throw new ValidationError('User profile tidak ditemukan.');
    }

    // Mengambil data histori dari yang paling lama ke terbaru (ASC)
    const { data, error } = await supabase
      .from('ai_analysis_history')
      .select('created_at, ai_output_response')
      .eq('user_id', profileId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new InternalServerError('Gagal mengambil histori analisis.', error);
    }

    // Ekstraksi data dari JSONB untuk frontend (Line Chart)
    const progressData = data.map(record => {
      const aiResponse = record.ai_output_response || {};
      
      let role = "Role Tidak Diketahui";
      let score = 0;
      let missing_skills_count = 0;

      // Mengecek array top_roles dari response AI
      if (aiResponse.top_roles && Array.isArray(aiResponse.top_roles) && aiResponse.top_roles.length > 0) {
        const topRole = aiResponse.top_roles[0]; // Mengambil peran pekerjaan utama (index 0)
        
        role = topRole.role || "Role Tidak Diketahui";
        
        // Ekstrak skor (match_score atau dari confidence dikali 100)
        if (topRole.confidence) {
          score = Math.round(topRole.confidence * 100);
        } else if (aiResponse.match_score) {
          score = aiResponse.match_score;
        }

        // Ekstrak jumlah missing skills
        if (topRole.recommended_skill_to_learn && Array.isArray(topRole.recommended_skill_to_learn)) {
          missing_skills_count = topRole.recommended_skill_to_learn.length;
        } else if (topRole.missing_skills && Array.isArray(topRole.missing_skills)) {
          missing_skills_count = topRole.missing_skills.length;
        }
      }

      return {
        date: record.created_at,
        role: role,
        score: score,
        missing_skills_count: missing_skills_count
      };
    });

    return res.status(200).json({
      success: true,
      message: "Data progress tracker berhasil diambil.",
      data: progressData
    });
  } catch (error) {
    next(error);
  }
};
