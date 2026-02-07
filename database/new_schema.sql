-- Esquema de Base de Datos - TimeControl (Español - Completo)
-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla USUARIOS (Sincronizada con auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS en usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios FOR SELECT USING (auth.uid() = id);

-- Función y Trigger para sincronizar auth.users con public.usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si ya existe para evitar errores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabla CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gestionan sus propios clientes" ON public.clientes FOR ALL USING (auth.uid() = usuario_id);

-- 3. Tabla PROYECTOS
CREATE TABLE IF NOT EXISTS public.proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    color VARCHAR(20) DEFAULT '#C5FF00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gestionan sus propios proyectos" ON public.proyectos FOR ALL USING (auth.uid() = usuario_id);

-- 4. Tabla TAREAS
CREATE TABLE IF NOT EXISTS public.tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    estimacion_horas DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gestionan sus propias tareas" ON public.tareas FOR ALL USING (auth.uid() = usuario_id);

-- 5. Tabla JORNADAS (Actualizada con Proyectos y Tareas)
CREATE TYPE estado_jornada AS ENUM ('activa', 'pausada', 'finalizada');

CREATE TABLE IF NOT EXISTS public.jornadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE SET NULL,
    tarea_id UUID REFERENCES public.tareas(id) ON DELETE SET NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME NOT NULL,
    hora_pausa TIME,
    hora_fin TIME,
    horas_trabajadas TEXT,
    estado estado_jornada NOT NULL DEFAULT 'activa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gestionan sus propias jornadas" ON public.jornadas FOR ALL USING (auth.uid() = usuario_id);

-- 6. Tabla METRICAS
CREATE TABLE IF NOT EXISTS public.metricas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    total_horas_trabajadas DECIMAL(10, 2) DEFAULT 0,
    total_pausas INT DEFAULT 0,
    eficiencia_porcentaje INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.metricas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios ven sus propias metricas" ON public.metricas FOR ALL USING (auth.uid() = usuario_id);

-- SEED DATA (Solo para el usuario que se registre o para demo si usas un UUID real)
-- Nota: El trigger se encargará de crear la fila en public.usuarios cuando te registres en Supabase Auth.
