---
name: rpsoft-ui
description: Estándares de UI/UX para el ecosistema RPSoft
---

# RPSoft UI Skill

Este skill define cómo se deben diseñar y construir las interfaces de usuario en los proyectos de RPSoft para asegurar consistencia, accesibilidad y una estética premium.

## Stack Tecnológico
- **Core**: React (JSX/TSX)
- **Estilos**: CSS nativo con variables semánticas o TailwindCSS (según el proyecto).
- **Iconos**: Lucide React.

## Reglas de Layout (Dashboard)
- **Sidebar**: Fijo a la izquierda (`260px`). En móvil debe ocultarse y abrirse mediante un menú hamburguesa.
- **Main Content**: Debe ocupar el resto del ancho disponible. Padding estándar: `var(--space-6)`.
- **Responsive**: 
  - Prohibido el scroll horizontal.
  - El Sidebar debe transformarse en un overlay en móvil.
  - Uso de `min-width: 0` para evitar desbordamientos de flexbox.

## Tokens de Diseño (Variables)
- **Colores**: Usar siempre variables `--color-primary-*`, `--color-neutral-*`.
- **Espaciados**: Usar el sistema de pasos `--space-1` a `--space-16`.
- **Bordes**: Radio estándar `var(--radius-lg)` (8-12px).

## Estética "Light" (Minimalismo Premium)
- **Fondos de Datos**: Usar fondos verdes ultra-claros (`#EEFBF7`) para días o filas con información completada.
- **Resaltado de Selección**: El elemento seleccionado debe usar un borde sólido del color primario (`#10B981`) con fondo blanco para máxima limpieza.
- **Jerarquía en Detalle**: La fila de resultados totales debe ocupar todo el ancho del contenedor con fondo diferenciado y texto destacado en verde oscuro.
- **Responsive Stacking**: En dispositivos móviles, los paneles de detalle laterales deben apilarse verticalmente bajo el componente principal en lugar de usar modales, para mantener el flujo visual.

## DoD UI (Definition of Done)
- [ ] No hay errores en la consola del navegador.
- [ ] La interfaz es 100% responsiva (móvil, tablet, escritorio).
- [ ] Los estados "Loading" y "Error" están implementados.
- [ ] El contraste de color cumple con WCAG AA.
- [ ] No existen "magic numbers" en el código CSS/inline styles.
