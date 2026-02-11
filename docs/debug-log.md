# Debug Log - Sprint 0 MVP

## Bug #1: Dashboard No Responsivo
- **Descripción**: En pantallas menores a 1024px, el sidebar se oculta (transform: translateX(-100%)) pero no existe una forma de abrirlo nuevamente desde la interfaz.
- **Impacto**: Crítico (Inaccesibilidad en móvil).
- **Estado**: Por corregir.
- **Acción**: Implementar estado `isSidebarOpen` en `Layout.jsx` y botón toggle en `Header.jsx`.

## Bug #2: Scroll Horizontal en Móvil
- **Descripción**: Algunos componentes del dashboard desbordan el contenedor principal en dispositivos móviles, causando un scroll horizontal indeseado.
- **Impacto**: Medio (UI inconsistente).
- **Estado**: Por corregir.
- **Acción**: Aplicar `overflow-x: hidden` al contenedor principal y revisar anchos de componentes (Charts/Tablas).
