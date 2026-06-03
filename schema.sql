-- =========================================================================
-- SKEMA DATABASE SUPABASE (POSTGRESQL) - Firebase Authentication Backend
-- =========================================================================
-- ARCHITECTURE NOTE:
--   This project uses Firebase Authentication (NOT Supabase Auth).
--   The `profiles` table therefore does NOT reference `auth.users`.
--   The Firebase UID (a string like "abc123xyz") is stored in `firebase_uid`.
--   The `id` column is a Supabase-generated UUID used for internal FK relations.
-- =========================================================================

-- 1. TABEL PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id                 UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid       TEXT  UNIQUE NOT NULL,          -- Firebase UID (sub claim dari JWT)
  email              TEXT  UNIQUE NOT NULL,
  full_name          TEXT,
  picture_url        TEXT,
  provider           TEXT  DEFAULT 'google.com',
  access_token       TEXT,
  refresh_token      TEXT,
  access_expires_at  TIMESTAMP WITH TIME ZONE,
  refresh_expires_at TIMESTAMP WITH TIME ZONE,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABEL DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name       TEXT    NOT NULL,
  file_url        TEXT    NOT NULL,
  file_size_bytes INTEGER,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL REKOMENDASI & ANALISIS AI
CREATE TABLE IF NOT EXISTS public.ai_analysis_history (
  id                 UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID  REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_id        UUID  REFERENCES public.documents(id) ON DELETE SET NULL,
  user_prompt        TEXT,
  input_skillset     TEXT[],
  ai_output_response JSONB NOT NULL,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABEL SKILLSET USER
CREATE TABLE IF NOT EXISTS public.user_skillsets (
  user_id    UUID    REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  skills     TEXT[]  NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- SECURITY POLICY (RLS)
-- NOTE: Backend uses `service_role` key which bypasses RLS automatically.
--       These policies are still defined for best practices / future use.
-- =========================================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skillsets      ENABLE ROW LEVEL SECURITY;

-- Allow backend (service_role) full access
CREATE POLICY "Allow service role full access on profiles"
  ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access on documents"
  ON public.documents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access on ai_analysis_history"
  ON public.ai_analysis_history FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access on user_skillsets"
  ON public.user_skillsets FOR ALL USING (true) WITH CHECK (true);
