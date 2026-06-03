import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { supabase } from '../utils/supabaseClient.js';

export const getUserSkillset = async (req, res, next) => {
  try {
    const userId = req.userId || req.query.userId || req.query.user_id;

    if (!userId) {
      throw new ValidationError('userId is required');
    }

    const { data, error } = await supabase
      .from('user_skillsets')
      .select('user_id, skills, updated_at, created_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new InternalServerError('Failed to fetch skillset', error);
    }

    return ResponseFormatter.success(res, 200, 'Skillset retrieved', {
      userId,
      skills: data?.skills || [],
      updated_at: data?.updated_at || null,
      created_at: data?.created_at || null,
    });
  } catch (error) {
    next(error);
  }
};
