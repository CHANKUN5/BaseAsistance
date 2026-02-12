# RPSoft Supabase Standards

## Name: rpsoft-supabase
## Description: Standards for database architecture, security, and integration within the RPSoft ecosystem.

### 1. Database Naming Conventions
- **Tables**: Plural, lowercase, underscore separated (e.g., `jornadas`, `usuarios`).
- **Columns**: camelCase or snake_case (sticking to `snake_case` for PostgreSQL defaults like `usuario_id`, `created_at`).
- **Timestamps**: Every table must have `created_at` and `updated_at` with `timezone` support.

### 2. Row Level Security (RLS)
- **Mandatory**: All tables must have RLS enabled.
- **Policies**:
  - `Select`: `auth.uid() = usuario_id`
  - `Insert`: `auth.uid() = usuario_id`
  - `Update`: `auth.uid() = usuario_id`
  - `Delete`: `auth.uid() = usuario_id`

### 3. Security Checklist
- NEVER expose `service_role` keys in the frontend.
- Use `maybeSingle()` instead of `single()` for queries that might return no results to avoid 406 errors.
- Always include `usuario_id` as a foreign key to the `auth.users` table.

### 4. Integration Standards
- CENTRALIZED SERVICES: All DB calls must go through files in `src/services/`.
- ERROR HANDLING: Always wrap Supabase calls in try/catch and return `{ data, error }`.

### 5. Recommended Schema (Core)
```sql
create table public.jornadas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users not null,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time,
  horas_trabajadas text,
  estado text check (estado in ('activa', 'pausada', 'finalizada')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.jornadas enable row level security;
```
