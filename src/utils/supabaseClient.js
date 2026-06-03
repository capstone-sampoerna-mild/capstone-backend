import { createClient } from '@supabase/supabase-js';
import { config } from '../config/environment.js';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  throw new Error('Supabase configuration is missing');
}

export const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
