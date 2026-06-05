import { InternalServerError, ValidationError } from '../utils/APIError.js';
import { ResponseFormatter } from '../utils/ResponseFormatter.js';
import { supabase } from '../utils/supabaseClient.js';

export const recommendJobs = async (req, res, next) => {
  try {
    const { skillset } = req.body;

    if (!skillset || !Array.isArray(skillset) || skillset.length === 0) {
      throw new ValidationError('skillset is required and must be a non-empty array');
    }

    // Berdasarkan skema tabel job_data: id, title, search_role, job_level, company, location
    // Kita gunakan title dan search_role untuk pencocokan skill/role.
    const orConditions = skillset
      .map((skill) => `title.ilike.%${skill}%,search_role.ilike.%${skill}%`)
      .join(',');

    const { data: jobs, error } = await supabase
      .from('job_data')
      .select('id, title, company, location, job_url')
      .or(orConditions)
      .limit(5);

    if (error) {
      throw new InternalServerError('Failed to fetch job recommendations', error);
    }

    return ResponseFormatter.success(res, 200, 'Job recommendations retrieved', {
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
