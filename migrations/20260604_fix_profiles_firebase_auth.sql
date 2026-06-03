-- =========================================================================
-- MIGRATION: Redesign profiles table for Firebase Authentication
--
-- PROBLEM: The original schema used `id UUID REFERENCES auth.users` which
-- requires Supabase Auth (auth.users table). But this project uses Firebase
-- Authentication. The Firebase UID is a plain string (e.g. "abc123xyz"),
-- not a Supabase-managed UUID. This caused:
--   - "null value in column id violates not-null constraint"
--   - Data never being saved to Supabase
--
-- SOLUTION: Recreate profiles table using firebase_uid as the primary key.
-- Also update all dependent tables and remove the Supabase Auth trigger.
-- =========================================================================

-- Step 1: Drop the Supabase Auth trigger (not used with Firebase Auth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Drop dependent tables (order matters: dependents first)
DROP TABLE IF EXISTS public.user_skillsets CASCADE;
DROP TABLE IF EXISTS public.ai_analysis_history CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 3: Recreate profiles using firebase_uid as primary key
-- NOTE: firebase_uid is a TEXT string assigned by Firebase (e.g. "Zf3kLm...")
--       It is NOT a UUID, so we use TEXT type here.
CREATE TABLE public.profiles (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT        UNIQUE NOT NULL,
  email        TEXT        UNIQUE NOT NULL,
  full_name    TEXT,
  picture_url  TEXT,
  provider     TEXT        DEFAULT 'google.com',
  access_token TEXT,
  refresh_token TEXT,
  access_expires_at  TIMESTAMP WITH TIME ZONE,
  refresh_expires_at TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 4: Recreate documents table
CREATE TABLE public.documents (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name      TEXT    NOT NULL,
  file_url       TEXT    NOT NULL,
  file_size_bytes INTEGER,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 5: Recreate ai_analysis_history table
CREATE TABLE public.ai_analysis_history (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_id     UUID    REFERENCES public.documents(id) ON DELETE SET NULL,
  user_prompt     TEXT,
  input_skillset  TEXT[],
  ai_output_response JSONB NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 6: Recreate user_skillsets table
CREATE TABLE public.user_skillsets (
  user_id    UUID    REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  skills     TEXT[]  NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 7: Enable RLS on all tables
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skillsets     ENABLE ROW LEVEL SECURITY;

-- Step 8: RLS Policies
-- profiles: service_role key (used in backend) bypasses RLS automatically.
-- These policies allow future use of anon/user keys if needed.
CREATE POLICY "Allow service role full access on profiles"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.profiles WHERE firebase_uid = current_setting('app.firebase_uid', true))
  );

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM public.profiles WHERE firebase_uid = current_setting('app.firebase_uid', true))
  );

CREATE POLICY "Allow service role full access on documents"
  ON public.documents FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access on ai_analysis_history"
  ON public.ai_analysis_history FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access on user_skillsets"
  ON public.user_skillsets FOR ALL
  USING (true)
  WITH CHECK (true);
