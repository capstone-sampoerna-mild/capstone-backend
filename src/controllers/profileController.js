import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { supabase } from '../utils/supabaseClient.js';

export const getUserSkillset = async (req, res, next) => {
  try {
    const firebaseUid = req.userId || req.query.userId || req.query.user_id;

    if (!firebaseUid) {
      throw new ValidationError('userId is required');
    }

    // Resolve firebase_uid → profile UUID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (profileError || !profile) {
      throw new InternalServerError('Profile not found for this user');
    }

    const userId = profile.id;

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
