# Debug Log - Sprint 1 (BaseAsistance)

## Bug 1: Desconexión Arquitectónica entre Supabase Auth y Base de Datos

### Descripción
Las operaciones de `INSERT` y `SELECT` en las tablas `jornadas` y `metricas_financieras` fallaban sistemáticamente, incluso cuando el usuario estaba autenticado correctamente en el frontend.

### Causa
La base de datos local utilizaba una tabla manual `public.users` con sus propios UUIDs generados por `uuid_generate_v4()`. Las claves foráneas de las tablas de negocio apuntaban a esta tabla manual. Sin embargo, el cliente de Supabase enviaba el `auth.uid()` del sistema interno de Supabase Auth, el cual no existía en la tabla manual, provocando violaciones de integridad referencial.

### Solución aplicada
Se eliminó la tabla redundante `public.users` y se refactorizaron las claves foráneas para que apunten directamente a `auth.users(id)`. Se actualizaron las políticas RLS para validar contra el `auth.uid()` global de la sesión.

### Lección aprendida
En proyectos con Supabase, la tabla `auth.users` es la única fuente de verdad para la identidad. Si se requiere almacenar metadatos adicionales, se debe usar un patrón de "Profiles" vinculado por `REFERENCES auth.users(id)`, nunca intentar simular una tabla de usuarios independiente para la lógica de negocio principal.

---

## Bug 2: Errores Silenciosos en la Capa de Servicios

### Descripción
Al fallar una consulta a Supabase (por ejemplo, por una política RLS mal configurada), el frontend no mostraba ningún error claro. La aplicación simplemente "no hacía nada" o mostraba datos vacíos sin explicación.

### Causa
Las funciones en `jornadasService.js` y `metricasService.js` capturaban el objeto `error` de Supabase pero no lo propagaban ni lo logueaban con suficiente detalle. Además, se usaban valores por defecto (como `[]` o `0`) sin alertar que la carga de datos había fallado por un error técnico (HTTP 400/403).

### Solución aplicada
Se implementó un logging detallado en la capa de servicios que captura y muestra en consola el mensaje (`message`), detalle (`details`), pista (`hint`) y código de error (`code`) de Supabase. Se modificaron las funciones críticas para que lancen (`throw`) el error en lugar de silenciarlo, permitiendo que la UI maneje el estado de error.

### Lección aprendida
La transparencia en la capa de servicios es vital para el debugging en producción. Capturar errores sin loguear sus metadatos es equivalente a un error silencioso. Siempre se debe diferenciar entre "sin datos" y "error de acceso".

---

## Bug 3: Incompatibilidad de Codificación en Archivo .env (Vite)

### Descripción
El servidor de desarrollo de Vite fallaba al arrancar o no cargaba las variables de entorno, lanzando errores de "supabaseUrl is required" a pesar de que el archivo `.env` existía y tenía datos.

### Causa
El archivo `.env` fue creado con codificación UTF-16LE por el sistema operativo, mientras que Vite y la mayoría de las herramientas de Node.js esperan codificación UTF-8. Esto hacía que el contenido fuera invisible para el motor de carga de variables de entorno.

### Solución aplicada
Se re-generó el archivo `.env` forzando explícitamente la codificación UTF-8 eliminando caracteres nulos invisibles de la codificación anterior.

### Lección aprendida
Los archivos de configuración deben ser siempre UTF-8. En entornos Windows (`PowerShell`), es común que los redireccionamientos de salida generen UTF-16 por defecto, lo cual rompe la compatibilidad con el ecosistema JavaScript moderno.

---

## Resultado del Sprint
El MVP del Sprint 1 concluye con una arquitectura sólida y limpia conforme a los estándares **RPSoft**. 
- **Integridad**: Los datos ahora se guardan y recuperan correctamente vinculados a usuarios reales.
- **Seguridad**: RLS está activo y verificado en todas las tablas sensibles.
- **Estabilidad**: La consola del navegador está limpia de errores de sintaxis y warnings de React (className fixed).
- **Documentación**: Estructura de servicios y cliente Supabase unificada y documentada.
