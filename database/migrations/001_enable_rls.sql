-- DATA SECURITY MIGRATION
-- Enables Row Level Security (RLS) and defines access policies

-- 1. USERS Table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- 2. JORNADAS Table
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own jornadas"
ON public.jornadas
FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own jornadas"
ON public.jornadas
FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own jornadas"
ON public.jornadas
FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

-- 3. METRICAS_FINANCIERAS Table
ALTER TABLE public.metricas_financieras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics"
ON public.metricas_financieras
FOR SELECT
USING ( auth.uid() = user_id );

-- Note: Financial metrics might be updated by system functions or triggers, 
-- but if users can update them manually, add policy below:
-- CREATE POLICY "Users can update their own metrics" ...
