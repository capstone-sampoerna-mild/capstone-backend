
import { config } from '../config/environment.js';
import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { proxyMultipart } from '../utils/fastApiProxy.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { supabase } from '../utils/supabaseClient.js';

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const normalized = skills
    .map((skill) => (typeof skill === 'string' ? skill.trim() : ''))
    .filter((skill) => skill.length > 0);

  return Array.from(new Set(normalized));
};

const extractSkillset = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidates = [
    payload.skillset,
    payload.skills,
    payload.owned_skills,
    payload.skills_owned,
    payload.data?.skillset,
    payload.data?.skills,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      if (typeof candidate[0] === 'object' && candidate[0] !== null) {
        const mapped = candidate
          .map((item) => (typeof item.skill === 'string' ? item.skill.trim() : ''))
          .filter((skill) => skill.length > 0);
        return normalizeSkills(mapped);
      }

      return normalizeSkills(candidate);
    }
  }

  return [];
};

export const uploadDocument = async (req, res, next) => {
  const payloadFile = req.file;
  const userId = req.body?.userId || req.body?.user_id;

  if (!payloadFile) {
    next(new ValidationError('file is required'));
    return;
  }

  return proxyMultipart(req, res, next, config.fastApi.documentUploadPath, {
    file: payloadFile,
    onResponse: async (upstreamResponse) => {
      if (!userId) {
        return;
      }

      const skillset = extractSkillset(upstreamResponse?.data);

      if (skillset.length === 0) {
        return;
      }

      const { error } = await supabase.from('user_skillsets').upsert(
        {
          user_id: userId,
          skills: skillset,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        throw new InternalServerError('Failed to save skillset', error);
      }
    },
  });
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.query.user_id;

    if (!userId) {
      throw new ValidationError('userId is required');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, user_id, file_name, file_url, file_size_bytes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerError('Failed to fetch documents', error);
    }

    return ResponseFormatter.success(res, 200, 'Documents retrieved', {
      documents: data || [],
    });
  } catch (error) {
    next(error);
  }
};
