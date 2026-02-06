-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table (Use this if you are NOT using Supabase Auth, or sync it via triggers)
-- Ideally in Supabase you use auth.users. This is for local/demo structure.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. JORNADAS Table (Work Shifts)
-- Replaced 'INTERVAL' with 'TEXT' for horas_trabajadas to safely match "HH:MM:SS" format expected by frontend without casting issues.
CREATE TYPE estado_jornada AS ENUM ('activa', 'pausada', 'finalizada');

CREATE TABLE IF NOT EXISTS public.jornadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- In Supabase, usually references auth.users(id)
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME NOT NULL,
    hora_pausa TIME,
    hora_fin TIME,
    horas_trabajadas TEXT, -- Format: "HH:MM:SS" (e.g., "08:30:00")
    estado estado_jornada NOT NULL DEFAULT 'activa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ANALYTICS / METRICS Table
CREATE TABLE IF NOT EXISTS public.metricas_diarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    total_horas_trabajadas DECIMAL(10, 2) DEFAULT 0, -- Numeric representation for easier sums
    total_pausas INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA GENERATION (Dynamic Dates)

-- Insert a Mock User
INSERT INTO public.users (id, email, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Usuario Demo')
ON CONFLICT (id) DO NOTHING;

-- Insert Jornadas for the last 7 days (Dynamic)
INSERT INTO public.jornadas (user_id, fecha, hora_inicio, hora_fin, horas_trabajadas, estado)
VALUES 
-- Today (Active or finished)
('00000000-0000-0000-0000-000000000000', CURRENT_DATE, '09:00:00', '18:00:00', '08:00:00', 'finalizada'),
-- Yesterday
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 1, '08:30:00', '17:30:00', '08:30:00', 'finalizada'),
-- 2 days ago
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 2, '09:00:00', '17:00:00', '07:30:00', 'finalizada'),
-- 3 days ago
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 3, '08:45:00', '18:00:00', '08:15:00', 'finalizada'),
-- 4 days ago
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 4, '09:15:00', '18:15:00', '08:00:00', 'finalizada'),
-- 5 days ago (Half day)
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 5, '09:00:00', '13:00:00', '04:00:00', 'finalizada');

-- Insert Metrics
INSERT INTO public.metricas_diarias (user_id, fecha, total_horas_trabajadas, total_pausas)
VALUES
('00000000-0000-0000-0000-000000000000', CURRENT_DATE, 8.0, 1),
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 1, 8.5, 1),
('00000000-0000-0000-0000-000000000000', CURRENT_DATE - 2, 7.5, 2);

-- Row Level Security (RLS) - Optional but recommended for Supabase
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own jornadas" ON public.jornadas
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jornadas" ON public.jornadas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: user_id '0000...' is for demo/testing. In production, policies protect real UUIDs.
