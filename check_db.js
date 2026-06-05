import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestAiOutput() {
  const { data, error } = await supabase
    .from('ai_analysis_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(JSON.stringify(data[0].ai_output_response, null, 2));
  }
}

checkLatestAiOutput();
