import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { extractSkillset } from './src/controllers/documentController.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testExtract() {
  const { data, error } = await supabase
    .from('ai_analysis_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error:", error);
  } else {
    const aiOutput = data[0].ai_output_response;
    console.log("Raw AI Output has top_roles:", !!aiOutput.top_roles);
    console.log("Extracted Skills:");
    console.log(extractSkillset(aiOutput));
  }
}

testExtract();
