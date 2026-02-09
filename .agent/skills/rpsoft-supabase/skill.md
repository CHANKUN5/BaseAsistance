---
name: rpsoft-supabase
description: Normas de diseño de base de datos, seguridad y backend con Supabase para RPSoft.
---

# Estándares de Supabase para RPSoft

Esta skill define cómo interactuar con la infraestructura de backend y base de datos en Supabase.

## 1. Convenciones de Base de Datos
- **Nombres de Tablas:** `snake_case` y en plural (ej: `users`, `subscription_plans`).
- **Columnas:** `snake_case` (ej: `first_name`, `is_active`).
- **Claves Primarias:** UUID v4 predeterminado.
- **Timestamps:** Todas las tablas deben tener:
  - `created_at` (default: `now()`)
  - `updated_at` (actualizado vía trigger/función).
- **Relaciones:** Siempre usar `user_id` (UUID) para referenciar al propietario del dato (`auth.users`).

## 2. Row Level Security (RLS)
RLS debe estar **HABILITADO** en todas las tablas públicas.

### Patrones de Políticas Comunes:
- **Lectura propia:**
  ```sql
  CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
  ```
- **Escritura propia:**
  ```sql
  CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **Admin Access:** Usar roles personalizados o tablas de roles si se requiere acceso administrativo.

## 3. Seguridad & Auth
- **Email Confirmation:** Habilitado para producción.
- **Provider:** Usar autenticación por email/password o OAuth (Google/GitHub) según requerimiento.
- **Exposición:** Nunca exponer la `service_role` key en el cliente. Solo usar `anon` key.

## 4. Variables de Entorno
El proyecto debe tener un archivo `.env` validado con Zod o similar:
- `VITE_SUPABASE_URL`: URL del proyecto.
- `VITE_SUPABASE_ANON_KEY`: Clave pública anónima.

## 5. Checklist de Seguridad
- [ ] RLS activado en todas las tablas.
- [ ] Políticas de RLS probadas (positivo y negativo).
- [ ] `metrics` y `logs` sensibles en esquemas privados o protegidos.
- [ ] Funciones Postgres (`RPC`) definidas con `SECURITY DEFINER` solo si es estrictamente necesario.
