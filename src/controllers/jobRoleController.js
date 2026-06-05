import { config } from '../config/environment.js';
import { proxyJson } from '../utils/fastApiProxy.js';
import { extractSkillset, resolveProfileId } from './documentController.js';
import { supabase } from '../utils/supabaseClient.js';

const buildJobRolePayload = (req) => {
  const payload = { ...(req.body || {}) };

  if (!payload.name && payload.nama) {
    payload.name = payload.nama;
  }

  return payload;
};

export const recommendJobRole = async (req, res, next) => {
  const firebaseUid = req.userId || req.body?.userId || req.body?.user_id;

  return proxyJson(
    req,
    res,
    next,
    config.fastApi.jobRoleRecommendPath,
    buildJobRolePayload(req),
    {
      onResponse: async (upstreamResponse) => {
        const fastApiStatus = upstreamResponse?.status;
        if (!fastApiStatus || fastApiStatus >= 400) return;

        // Skills from user input body
        const inputSkillset = extractSkillset(req.body || {});

        // AI Response
        let aiOutput = upstreamResponse?.data;
        if (typeof aiOutput === 'string') {
          try { aiOutput = JSON.parse(aiOutput); } 
          catch { aiOutput = { raw_response: aiOutput }; }
        }
        if (!aiOutput || typeof aiOutput !== 'object') aiOutput = {};

        if (firebaseUid) {
          const userId = await resolveProfileId(firebaseUid);
          if (userId) {
            const { error: analysisError } = await supabase.from('ai_analysis_history').insert({
              user_id: userId,
              document_id: null,
              user_prompt: req.body?.prompt || req.body?.user_prompt || null,
              input_skillset: inputSkillset.length > 0 ? inputSkillset : null,
              ai_output_response: aiOutput,
            });

            if (analysisError) {
              console.error('[recommendJobRole] Failed to save analysis history:', analysisError);
            }

            const aiSkills = extractSkillset(aiOutput);
            const combinedSkills = Array.from(new Set([...inputSkillset, ...aiSkills]));

            if (combinedSkills.length > 0) {
              const { error: skillsetError } = await supabase.from('user_skillsets').upsert(
                {
                  user_id: userId,
                  skills: combinedSkills,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
              );
              
              if (skillsetError) {
                console.error('[recommendJobRole] Failed to save skillset:', skillsetError);
              }
            }
          }
        }
      }
    }
  );
};
