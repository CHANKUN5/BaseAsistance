# Registro de Errores y Mejoras (Sprint 0)

Este log documenta la aplicación de las skills de RPSoft para corregir y mejorar el MVP de Control Horario.

## Bug 1: Error de Redondeo en Segundos (:60)
- **Descripción**: El formateador de tiempo mostraba ocasionalmente `07:02:60` en lugar de saltar al siguiente minuto debido a un error de redondeo (`Math.round`) en los segundos.
- **Causa**: Uso de `Math.round` en el cálculo de segundos residuales a partir de horas decimales.
- **Corrección**: Implementación de `Math.floor` con un pequeño offset de precisión (`+0.1`) en `formatearDuracion` para asegurar que los segundos nunca excedan 59.
- **Skill Aplicada**: `rpsoft-ui` (Time Formatting Precision).

## Bug 2: Inconsistencia en Formato de Tiempo (Mixto vs Digital)
- **Descripción**: El historial mezclaba formatos como `2m 34s` con `--`, creando una visualización desordenada y poco profesional.
- **Causa**: Lógica condicional redundante en el JSX de la tabla que intentaba formatear manualmente si faltaba el dato en DB.
- **Corrección**: Creación de `calcularDuracionDinamica` y unificación de toda la tabla bajo el formato estricto `HH:MM:SS`.
- **Skill Aplicada**: `rpsoft-ui` (Layout Standards & Time Formatting).

## Mejora: Alineación Atómica de Botones
- **Descripción**: Los iconos y el texto en los botones de acción del Dashboard no estaban centrados correctamente.
- **Corrección**: Refactorización de `.action-btn` en `Dashboard.css` usando Flexbox y `gap`, eliminando estilos inline negativos.
- **Skill Aplicada**: `rpsoft-ui` (Component Guidelines).
