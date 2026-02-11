-- FIX AUTH LINKAGE MIGRATION
-- This migration re-links tables to Supabase Auth and cleans up the redundant users table.

-- 1. Remove old foreign keys
ALTER TABLE IF EXISTS public.jornadas DROP CONSTRAINT IF EXISTS jornadas_user_id_fkey;
ALTER TABLE IF EXISTS public.metricas_financieras DROP CONSTRAINT IF EXISTS metricas_financieras_user_id_fkey;

-- 2. Link directly to auth.users (Supabase internal table)
ALTER TABLE public.jornadas 
  ADD CONSTRAINT jornadas_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.metricas_financieras 
  ADD CONSTRAINT metricas_financieras_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Cleanup redundant users table (Optional, but recommended to avoid confusion)
-- Before dropping, you might want to migrate data, but since it's an MVP with "seed" data, 
-- we prefer a clean slate for real users.
DROP TABLE IF EXISTS public.users;

-- 4. Re-verify RLS (just in case)
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_financieras ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies if they exist and recreate clean ones
DROP POLICY IF EXISTS "Users can view their own jornadas" ON public.jornadas;
DROP POLICY IF EXISTS "Users can insert their own jornadas" ON public.jornadas;
DROP POLICY IF EXISTS "Users can update their own jornadas" ON public.jornadas;

CREATE POLICY "Users can view their own jornadas"
ON public.jornadas FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own jornadas"
ON public.jornadas FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own jornadas"
ON public.jornadas FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can view their own metrics" ON public.metricas_financieras;
CREATE POLICY "Users can view their own metrics"
ON public.metricas_financieras FOR SELECT
USING ( auth.uid() = user_id );

-- Allow users to insert their own metrics if the app does it directly
CREATE POLICY "Users can insert their own metrics"
ON public.metricas_financieras FOR INSERT
WITH CHECK ( auth.uid() = user_id );
