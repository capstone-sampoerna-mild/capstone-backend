
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

export const extractSkillset = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  let allSkills = [];

  // Check top-level candidates like 'extracted_skills'
  const candidates = [
    payload.extracted_skills,
    payload.skillset,
    payload.skills,
    payload.owned_skills,
    payload.skills_owned,
    payload.data?.extracted_skills,
    payload.data?.skillset,
    payload.data?.skills,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      if (typeof candidate[0] === 'object' && candidate[0] !== null) {
        const mapped = candidate
          .map((item) => (typeof item.skill === 'string' ? item.skill.trim() : ''))
          .filter((skill) => skill.length > 0);
        allSkills = allSkills.concat(mapped);
      } else {
        allSkills = allSkills.concat(candidate);
      }
    }
  }

  // Check top_roles nested arrays ('user_skill' is array of objects)
  if (Array.isArray(payload.top_roles)) {
    payload.top_roles.forEach(role => {
      const roleCandidates = [role.user_skill, role.skills, role.skillset];
      roleCandidates.forEach(rc => {
        if (Array.isArray(rc)) {
          rc.forEach(item => {
            if (typeof item === 'string') {
              allSkills.push(item);
            } else if (typeof item === 'object' && typeof item.skill === 'string') {
              allSkills.push(item.skill);
            }
          });
        }
      });
    });
  }

  if (allSkills.length > 0) {
    return normalizeSkills(allSkills);
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

/**
 * Resolve firebase_uid (string) → profile UUID.
 * All DB tables reference profiles(id) which is a UUID,
 * but req.userId contains the Firebase UID from the JWT `sub` claim.
 */
export const resolveProfileId = async (firebaseUid) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (error || !profile) {
    console.error('[resolveProfileId] Profile lookup failed for firebase_uid:', firebaseUid, error);
    return null;
  }

  return profile.id;
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

  // --- Step 1: Resolve Firebase UID → Profile UUID ---
  const userId = await resolveProfileId(firebaseUid);

  if (!userId) {
    next(new InternalServerError('Profile not found for this user'));
    return;
  }

  console.info('[uploadDocument] Resolved firebase_uid:', firebaseUid, '→ profile.id:', userId);

  // --- Step 2: Proxy file to FastAPI for AI analysis ---
  return proxyMultipart(req, res, next, config.fastApi.documentUploadPath, {
    file: payloadFile,
    onResponse: async (upstreamResponse) => {
      const fastApiStatus = upstreamResponse?.status;
      console.info('[uploadDocument] FastAPI responded with status:', fastApiStatus);

      // If FastAPI returned an error, skip DB saves but still forward the response
      if (!fastApiStatus || fastApiStatus >= 400) {
        console.error('[uploadDocument] FastAPI returned error status:', fastApiStatus,
          'body:', JSON.stringify(upstreamResponse?.data)?.substring(0, 500));
        // Don't throw — let proxyMultipart forward the FastAPI error response as-is
        return;
      }

      // --- Step 3: Save document metadata to Supabase ---
      const skillset = extractSkillset(upstreamResponse?.data);
      const fileUrl =
        extractDocumentUrl(upstreamResponse?.data) || payloadFile.originalname || 'unknown';

      console.info('[uploadDocument] Extracted skills:', skillset.length, '| fileUrl:', fileUrl);

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
        console.error('[uploadDocument] Failed to save document:', {
          message: documentError.message,
          code: documentError.code,
          details: documentError.details,
          hint: documentError.hint,
        });
        throw new InternalServerError('Failed to save document', documentError);
      }

      console.info('[uploadDocument] Document saved. document.id:', document.id);

      // --- Step 4: Save AI analysis history ---
      // Ensure ai_output_response is a valid JSON object for the JSONB column
      let aiOutput = upstreamResponse?.data;
      if (typeof aiOutput === 'string') {
        try {
          aiOutput = JSON.parse(aiOutput);
        } catch {
          aiOutput = { raw_response: aiOutput };
        }
      }
      if (!aiOutput || typeof aiOutput !== 'object') {
        aiOutput = {};
      }

      const { error: analysisError } = await supabase.from('ai_analysis_history').insert({
        user_id: userId,
        document_id: document.id,
        ai_output_response: aiOutput,
      });

      if (analysisError) {
        console.error('[uploadDocument] Failed to save analysis history:', {
          message: analysisError.message,
          code: analysisError.code,
          details: analysisError.details,
          hint: analysisError.hint,
        });
        // Non-fatal: document was saved, log but continue
        console.warn('[uploadDocument] Continuing despite analysis history save failure');
      } else {
        console.info('[uploadDocument] Analysis history saved.');
      }

      // --- Step 5: Upsert user skillset ---
      if (skillset.length === 0) {
        console.info('[uploadDocument] No skills extracted, skipping skillset upsert.');
        return;
      }

      const { error: skillsetError } = await supabase.from('user_skillsets').upsert(
        {
          user_id: userId,
          skills: skillset,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (skillsetError) {
        console.error('[uploadDocument] Failed to save skillset:', {
          message: skillsetError.message,
          code: skillsetError.code,
          details: skillsetError.details,
          hint: skillsetError.hint,
        });
        // Non-fatal: log and continue
        console.warn('[uploadDocument] Continuing despite skillset save failure');
      } else {
        console.info('[uploadDocument] Skillset upserted. Skills count:', skillset.length);
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
    const userId = await resolveProfileId(firebaseUid);

    if (!userId) {
      throw new InternalServerError('Profile not found for this user');
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
