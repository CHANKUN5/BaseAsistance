# Estándares de Base de Datos RPSoft

Este documento detalla los estándares técnicos para la capa de datos en proyectos RPSoft.

## 1. Estructura de Tablas

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Primary Key) |
| `created_at` | `timestamptz` | Fecha de creación (default: `now()`) |
| `updated_at` | `timestamptz` | Fecha de actualización (trigger) |
| `user_id` | `uuid` | Referencia a `auth.users(id)` |

## 2. Row Level Security (RLS)

### Ejemplo de Política de Seguridad
```sql
-- Habilitar RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Solo el dueño puede ver sus datos
CREATE POLICY "Users can view own data" 
ON user_data FOR SELECT 
USING (auth.uid() = user_id);

-- Política de inserción: Solo el dueño puede insertar con su ID
CREATE POLICY "Users can insert own data" 
ON user_data FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

## 3. Consultas y Performance

- **Selects**: Solicitar solo las columnas necesarias (evitar `*`).
- **Índices**: Crear índices en columnas usadas frecuentemente en `WHERE` (ej: `user_id`, `created_at`).
- **Filtros**: Aplicar filtros en el lado del servidor usando el cliente de Supabase.
