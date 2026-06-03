-- =========================================================================
-- SKEMA DATABASE SUPABASE (POSTGRESQL) - ALIGNED WITH AI SKILLSGAP SERVICE
-- =========================================================================

-- 1. TABEL PROFILES (Tetap sama)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABEL DOCUMENTS (Tetap sama untuk menyimpan file resume/CV PDF)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, 
  file_size_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL REKOMENDASI & ANALISIS AI (Diubah agar match dengan output FastAPI)
CREATE TABLE IF NOT EXISTS public.ai_analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL, -- Terisi jika analisis lewat PDF
  
  -- Input dari user (Bisa berupa prompt teks biasa atau array skillset dari frontend)
  user_prompt TEXT,
  input_skillset TEXT[], -- Menyimpan array ["python", "sql"] jika menggunakan endpoint /job-role/recommend
  
  -- Output hasil analisis AI dari FastAPI (Disimpan dalam format JSONB agar struktur top_roles tetap utuh)
  ai_output_response JSONB NOT NULL, 
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- AUTOMATION TRIGGER & SECURITY POLICY (RLS)
-- =========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own analysis" ON public.ai_analysis_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analysis" ON public.ai_analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);