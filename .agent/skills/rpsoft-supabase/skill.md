---
name: rpsoft-supabase
description: Database architecture and security standards for RPSoft projects
---

# RPSoft - Supabase & Database Standards
**Version**: 1.0.0
**Context**: BaseAsistance (Control Horario MVP)
**Maintainer**: Backend Architecture Team

> [!IMPORTANT]
> Security is paramount. Row Level Security (RLS) must be ENABLED on ALL tables without exception.

## 1. Naming & Conventions
-   **Tables**: `snake_case`, plural and descriptive (e.g., `users`, `shift_logs`, `audit_events`).
-   **Columns**: `snake_case` (e.g., `first_name`, `is_active`, `role_id`).
-   **Primary Keys**:
    -   Name: `id`
    -   Type: `uuid`
    -   Default: `gen_random_uuid()`
-   **Timestamps**: Every table must have:
    -   `created_at` (timestamptz, default: `now()`)
    -   `updated_at` (timestamptz, default: `now()`)

## 2. Security & RLS (MANDATORY)
### 2.1 General Security Rules
1.  **Enable RLS**: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;` is mandatory for every table.
2.  **Service Role**: NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend or commit it to Git.
3.  **Environment Variables**: Access keys via `import.meta.env.VITE_SUPABASE_...`.

### 2.2 Standard Policies
Policies must be restrictive by default (Deny All).
-   **Select**: Users can only see their own data (`auth.uid() = user_id`) or public reference data.
-   **Insert/Update**: Users can only modify their own records. Admin roles require specific checks.

## 3. Architecture & Integration
### 3.1 Service Layer Pattern
**Strict Separation of Concerns**: UI components must NOT make direct Supabase calls.
-   ❌ **Bad**: Calling `supabase.from('...').select()` inside a `useEffect` in `UserProfile.tsx`.
-   ✅ **Good**: Calling `UserService.getProfile(id)` which handles the Supabase complexity.

This allows easier testing, mocking, and error handling centralization.

```typescript
// src/services/shifts.service.ts
import { supabase } from '@/lib/supabase';

export const shiftsService = {
  async getMyShifts() {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
```

## 4. Definition of Done (Database)
A data-related task is NOT considered complete until:
-   [ ] **RLS Enabled**: RLS is strictly enforced and verified for all allowed roles.
-   [ ] **Migrations**: Schema changes are scriptable and reproducible (SQL file), not just manual UI changes.
-   [ ] **Types**: TypeScript interfaces are generated or updated to match the schema.
-   [ ] **Indexes**: Foreign keys and frequently queried columns (user_id, status) are indexed.
-   [ ] **Seed Data**: Relevant mock data exists for development testing.

---

## 5. Reference Examples

### Example: Table Definition (SQL)
```sql
-- Use explicit types and constraints
CREATE TABLE public.shifts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ,
  notes       TEXT,
  status      TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Documentation is code
COMMENT ON TABLE public.shifts IS 'Stores user work shifts for time tracking';
```

### Example: RLS Policy (SQL)
```sql
-- 1. Enable RLS (CRITICAL)
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy: View Own Shifts
CREATE POLICY "Users can view their own shifts"
ON public.shifts
FOR SELECT
USING ( auth.uid() = user_id );

-- 3. Create Policy: Start Shift (Insert)
CREATE POLICY "Users can start their own shifts"
ON public.shifts
FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- 4. Create Policy: Update Own Shift
CREATE POLICY "Users can update their own unfinished shifts"
ON public.shifts
FOR UPDATE
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );
```
