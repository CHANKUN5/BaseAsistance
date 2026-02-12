# Estándares de Base de Datos RPSoft

## 1. Convenciones de Nomenclatura
- **Tablas**: Plural y minúsculas (ej: `usuarios`, `jornadas`, `metricas`).
- **Columnas**: snake_case para compatibilidad nativa con PostgreSQL.
- **Foreign Keys**: `nombre_tabla_singular_id` (ej: `usuario_id`).

## 2. Seguridad y RLS (Row Level Security)
- **Aislamiento**: Ningún usuario debe poder ver datos de otro usuario.
- **Políticas**: Usar siempre `auth.uid()` para filtrar el acceso.
- **Keys**: Utilizar únicamente la `anon_key` en el cliente.

## 3. Manejo de Fechas y Horas
- **Fechas**: Almacenar como tipo `DATE` (YYYY-MM-DD).
- **Horas**: Almacenar como tipo `TIME` sin zona horaria para registros de entrada/salida.
- **Cálculos**: Las duraciones deben almacenarse como `TEXT` en formato `HH:MM:SS` para facilitar el renderizado directo.

## 4. Auditoría
- Todas las tablas deben tener una columna `created_at` con valor por defecto `now()`.
- Se recomienda el uso de triggers para actualizar una columna `updated_at`.

## 5. Ejemplo de Implementación
Para añadir una nueva tabla de "Mensajes":
```sql
CREATE TABLE public.mensajes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios solo ven sus mensajes" 
ON public.mensajes FOR SELECT 
USING (auth.uid() = usuario_id);
```
