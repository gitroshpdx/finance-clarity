-- Add columns for quality tracking and EEAT compliance
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS source_urls text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS eeat_signals jsonb DEFAULT '{}'::jsonb;