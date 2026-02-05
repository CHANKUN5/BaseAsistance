-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table (Simulating Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Simulated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. JORNADAS Table
CREATE TYPE estado_jornada AS ENUM ('activa', 'pausada', 'finalizada');

CREATE TABLE IF NOT EXISTS jornadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME NOT NULL,
    hora_pausa TIME,
    hora_fin TIME,
    horas_trabajadas INTERVAL, -- Stores duration
    estado estado_jornada NOT NULL DEFAULT 'activa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. METRICAS_FINANCIERAS Table
CREATE TABLE IF NOT EXISTS metricas_financieras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingresos_totales DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    costos_totales DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    clientes_nuevos INT NOT NULL DEFAULT 0,
    clientes_recurrentes INT NOT NULL DEFAULT 0,
    utilidad_neta DECIMAL(10, 2) GENERATED ALWAYS AS (ingresos_totales - costos_totales) STORED,
    porcentaje_utilidad DECIMAL(5, 2), -- Calculated in app or via trigger, keeping simple here
    periodo DATE NOT NULL, -- The date/month this metric represents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA

-- Users (10 rows)
INSERT INTO users (id, email, password_hash) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'juan.perez@example.com', 'hashed_pw_1'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'maria.garcia@example.com', 'hashed_pw_2'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'carlos.lopez@example.com', 'hashed_pw_3'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'ana.martinez@example.com', 'hashed_pw_4'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'pedro.sanchez@example.com', 'hashed_pw_5'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'laura.torres@example.com', 'hashed_pw_6'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'jorge.ramirez@example.com', 'hashed_pw_7'),
('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'sofia.vargas@example.com', 'hashed_pw_8'),
('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'miguel.castro@example.com', 'hashed_pw_9'),
('39eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'elena.diaz@example.com', 'hashed_pw_10');

-- Jornadas (10 rows - varied states)
INSERT INTO jornadas (user_id, fecha, hora_inicio, hora_pausa, hora_fin, horas_trabajadas, estado) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2023-10-26', '08:00:00', NULL, NULL, NULL, 'activa'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2023-10-26', '08:15:00', '13:00:00', NULL, NULL, 'pausada'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2023-10-25', '08:00:00', '13:00:00', '17:00:00', '8 hours', 'finalizada'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-10-25', '09:00:00', NULL, '18:00:00', '9 hours', 'finalizada'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2023-10-26', '08:30:00', NULL, NULL, NULL, 'activa'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2023-10-24', '08:00:00', '12:00:00', '16:00:00', '7 hours', 'finalizada'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2023-10-26', '07:45:00', NULL, NULL, NULL, 'activa'),
('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2023-10-23', '08:00:00', NULL, '17:00:00', '9 hours', 'finalizada'),
('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '2023-10-26', '10:00:00', NULL, NULL, NULL, 'activa'),
('39eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2023-10-26', '08:00:00', '12:30:00', NULL, NULL, 'pausada');

-- Metricas Financieras (10 rows)
INSERT INTO metricas_financieras (user_id, ingresos_totales, costos_totales, clientes_nuevos, clientes_recurrentes, porcentaje_utilidad, periodo) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5000.00, 2000.00, 15, 30, 60.00, '2023-10-01'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3500.50, 1200.00, 8, 20, 65.70, '2023-10-01'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 7200.00, 3000.00, 25, 50, 58.33, '2023-10-01'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 4100.00, 1500.00, 12, 18, 63.41, '2023-10-01'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 2800.00, 900.00, 5, 15, 67.86, '2023-10-01'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 6000.00, 2500.00, 20, 40, 58.33, '2023-10-01'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 5500.00, 1800.00, 18, 35, 67.27, '2023-10-01'),
('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 3200.00, 1100.00, 7, 22, 65.62, '2023-10-01'),
('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 4800.00, 1600.00, 14, 28, 66.67, '2023-10-01'),
('39eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 3900.00, 1300.00, 10, 25, 66.67, '2023-10-01');
