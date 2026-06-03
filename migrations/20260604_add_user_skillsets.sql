-- Add user_skillsets table for storing AI-derived skill ownership per user
CREATE TABLE IF NOT EXISTS public.user_skillsets (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.user_skillsets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skillsets" ON public.user_skillsets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skillsets" ON public.user_skillsets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skillsets" ON public.user_skillsets
  FOR UPDATE USING (auth.uid() = user_id);
