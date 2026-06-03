
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

const extractDocumentUrl = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const candidates = [
    payload.file_url,
    payload.fileUrl,
    payload.document_url,
    payload.documentUrl,
    payload.data?.file_url,
    payload.data?.fileUrl,
    payload.data?.document_url,
    payload.data?.documentUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
};

export const uploadDocument = async (req, res, next) => {
  const payloadFile = req.file;
  const firebaseUid = req.userId || req.body?.userId || req.body?.user_id;

  if (!payloadFile) {
    next(new ValidationError('file is required'));
    return;
  }

  if (!firebaseUid) {
    next(new ValidationError('userId is required'));
    return;
  }

  // --- Lookup profile UUID from firebase_uid ---
  // req.userId contains the Firebase UID (string), but all tables
  // reference profiles(id) which is a UUID. We must resolve it first.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (profileError || !profile) {
    next(new InternalServerError('Profile not found for this user'));
    return;
  }

  const userId = profile.id; // ← actual UUID

  return proxyMultipart(req, res, next, config.fastApi.documentUploadPath, {
    file: payloadFile,
    onResponse: async (upstreamResponse) => {
      const skillset = extractSkillset(upstreamResponse?.data);

      const fileUrl =
        extractDocumentUrl(upstreamResponse?.data) || payloadFile.originalname || 'unknown';

      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          file_name: payloadFile.originalname,
          file_url: fileUrl,
          file_size_bytes: payloadFile.size ?? null,
        })
        .select('id')
        .single();

      if (documentError) {
        throw new InternalServerError('Failed to save document', documentError);
      }

      const { error: analysisError } = await supabase.from('ai_analysis_history').insert({
        user_id: userId,
        document_id: document.id,
        ai_output_response: upstreamResponse?.data ?? {},
      });

      if (analysisError) {
        throw new InternalServerError('Failed to save analysis history', analysisError);
      }

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
