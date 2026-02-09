---
name: rpsoft-ui
description: Estándares de UI/UX, componentes y arquitectura de frontend para el proyecto RPSoft.
---

# Reglas de UI/UX para RPSoft

Esta skill define los estándares obligatorios para el desarrollo de interfaces en RPSoft.

## 1. Stack Oficial
- **Framework:** React 18+
- **Lenguaje:** TypeScript (Strict Mode)
- **Estilos:** Tailwind CSS (versión más reciente)
- **Iconos:** Lucide React
- **Componentes:** Headless UI o Radix UI para lógica compleja, estilizados con Tailwind.

## 2. Layout & Estructura (SaaS Dashboard)
Todas las vistas principales deben heredar del `DashboardLayout`:
- **Sidebar:** Navegación principal, colapsable en móvil.
- **Header:** Búsqueda global, notificaciones, perfil de usuario.
- **Main Area:** Contenedor con `max-w-7xl` y `mx-auto` para limitar el ancho en pantallas grandes.
- **Espaciado:** Uso estricto de la escala de espaciado de Tailwind (`p-4`, `m-4`, `gap-4`).

## 3. Convenciones de Componentes
- **Atomic Design:** Organizar en `atoms`, `molecules`, `organisms`, `templates`.
- **Props:** Definir interfaces explícitas para todos los componentes.
  ```typescript
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
  }
  ```
- **Estados:** Manejar estados de carga (`isLoading`), error (`isError`) y vacío (`isEmpty`) visualmente.
- **Nombrado:** PascalCase para componentes (`UserProfile.tsx`), kebab-case para archivos de utilidad.

## 4. Accesibilidad (a11y)
- **Semántica:** Usar etiquetas HTML correctas (`<main>`, `<article>`, `<nav>`, `<button>` en lugar de `div` clickeables).
- **Focus:** Nunca eliminar el outline del focus sin proveer una alternativa visible.
- **Colores:** Verificar contraste WCAG AA mínimo.
- **Inputs:** Todos los inputs deben tener `label` asociado o `aria-label`.

## 5. Definition of Done (UI)
- [ ] El componente es responsive (Mobile First).
- [ ] Soporta modo oscuro (si aplica al proyecto).
- [ ] No hay errores de linting ni de tipos TS.
- [ ] Las interacciones tienen feedback visual (hover, focus, active).
- [ ] El código está limpio y modularizado (principio de responsabilidad única).
