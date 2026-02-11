---
name: rpsoft-supabase
description: Estándares de Base de Datos y Seguridad para Supabase en RPSoft
---

# RPSoft Supabase Skill

Define las mejores prácticas y convenciones para el uso de Supabase y PostgreSQL dentro de RPSoft.

## Convenciones de Naming
- **Tablas/Columnas**: Siempre en `snake_case` y plural para tablas (ej: `user_profiles`).
- **Timestamps**: Todas las tablas deben incluir `created_at` y `updated_at` (con triggers automáticos).
- **Primary Keys**: Usar `uuid` o `bigint` autoincremental según el caso.

## Seguridad y RLS (Row Level Security)
- **Principio de Mínimo Privilegio**: RLS debe estar activado en TODAS las tablas.
- **Políticas Base**:
  - `SELECT`: Permitir si el usuario está autenticado y posee el registro (`auth.uid() = user_id`).
  - `INSERT/UPDATE`: Validar siempre el `user_id` contra `auth.uid()`.
- **Service Role**: Nunca usar la `service_role` key en el cliente (Frontend).

## Gestión de Entorno
- Usar siempre variables de entorno `.env` para `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Validar la existencia de las keys antes de inicializar el cliente.

## DoD Supabase
- [ ] Las migraciones SQL están versionadas.
- [ ] RLS está habilitado y verificado.
- [ ] No hay keys expuestas en el código fuente.
- [ ] El esquema sigue la documentación en `/docs/db-standards.md`.
