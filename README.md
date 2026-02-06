# ⏳ TimeControl - Sistema de Gestión de Jornadas

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-61DAFB.svg) ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg) ![Vite](https://img.shields.io/badge/Vite-Build-646CFF.svg)

> **Sprint Goal:** Desarrollar un MVP robusto para el control horario de empleados, aplicando metodologías ágiles (Scrum) y arquitectura escalable con React y Supabase.

---

## 📋 Descripción del Proyecto

**TimeControl** es una aplicación web moderna diseñada para simplificar el registro y análisis de jornadas laborales. Permite a los usuarios marcar sus entradas, salidas y pausas de manera intuitiva, visualizando métricas de rendimiento en tiempo real.

El sistema fue construido con un enfoque en **UX/UI minimalista**, **resiliencia de datos** (modo offline/demo) y **escalabilidad arquitectónica**.

### ✨ Características Principales
*   **Gestión de Jornada:** Botones intuitivos para Iniciar, Pausar y Finalizar turnos.
*   **Dashboard Interactivo:** Métricas diarias y semanales con gráficos dinámicos.
*   **Historial Detallado:** Registro completo de jornadas pasadas con estados visuales.
*   **Reportes & Análisis:** Exportación de datos a CSV y visualización de KPIs financieros.
*   **Modo Demo Robusto:** Sistema de fallback automático que permite probar la app sin backend activo.

---

## 🚀 Arquitectura del Sistema

El proyecto sigue una arquitectura modular basada en componentes y servicios desacoplados.

### Diagrama de Flujo de Datos

```mermaid
graph TD
    User[Usuario] -->|Interactúa| UI[Interfaz React]
    UI -->|Llama| Service[Servicios (Supabase/Mock)]
    
    subgraph Frontend Logic
        UI -->|Context| AuthProvider[Auth Context]
        Service -->|Fallback| MockData[Generador de Datos Demo]
    end
    
    subgraph Persistencia
        Service -->|API Call| DB[(Supabase Database)]
        DB -->|JSON| Service
    end
    
    Service -->|Retorna Datos| UI
```

### Estructura de Directorios

```bash
src/
├── components/
│   ├── common/        # Átomos y moléculas UI (Button, Modal, Card)
│   ├── dashboard/     # Organismos específicos (StatsCard, ChartSection)
│   └── layout/        # Estructura base (Sidebar, Header, MainLayout)
├── context/           # Manejo de estado global (AuthContext)
├── pages/             # Vistas principales (Dashboard, Historial, Analytics)
├── services/          # Capa de abstracción de datos
│   ├── jornadasService.js  # Lógica de negocio de turnos (+ Mock Fallback)
│   ├── metricasService.js  # Cálculo de KPIs y reportes
│   └── authService.js      # Autenticación
└── styles/            # Variables CSS y estilos globales
```

---

## 🛠️ Instalación y Ejecución

### Prerrequisitos
*   Node.js 18+
*   NPM o Yarn

### Pasos para Correr el Proyecto

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/base-asistance.git
    cd BaseAsistance
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Base de Datos (Opcional para Demo)**
    *   Si deseas persistencia real, ejecuta el script `database/new_schema.sql` en tu proyecto de Supabase.
    *   Crea un archivo `.env` basado en `.env.example` y agrega tus credenciales.

4.  **Iniciar Servidor de Desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

---

## 🧠 Aprendizajes del Equipo

Durante el desarrollo de este MVP, el equipo consolidó conocimientos clave en ingeniería de software moderna:

1.  **Patrón "Graceful Degradation"**: Implementamos un sistema de servicios que detecta fallos en la base de datos y cambia automáticamente a "Mock Data". Esto permite que la demo nunca falle ante un cliente, incluso sin internet.

2.  **Diseño Atómico & Clean Code**: Aprendimos a separar estrictamente la lógica (Servicios) de la vista (Componentes). Refactorizamos múltiples veces para convertir código monolítico en componentes reutilizables como `<Modal />` y `<Button />`.

3.  **Gestión de Estado Efectiva**: Uso de `Context API` para la autenticación global, evitando el "prop drilling" innecesario y manteniendo el código limpio.

4.  **SQL Dinámico para Demos**: Diseñamos scripts SQL que generan datos con fechas relativas (`CURRENT_DATE`), asegurando que los dashboards de análisis siempre muestren información relevante "de esta semana" sin necesidad de mantenimiento manual.

---

## 📄 Base de Datos

El archivo `database/new_schema.sql` contiene la definición completa de la infraestructura de datos:

*   **Tabla `users`**: Gestión de perfiles.
*   **Tabla `jornadas`**: Registro central de actividad con soporte para pausas.
*   **Tabla `metricas_diarias`**: Agregaciones para reportes rápidos.

---

> Hecho con ❤️ por el equipo de Desarrollo - 2024

