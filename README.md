# Control Horario App

Sistema web moderno para gestión de jornadas laborales y métricas de proyectos.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura tus credenciales de Supabase en `.env`:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

6. Abre http://localhost:5173 en tu navegador

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticación
│   ├── common/        # Componentes reutilizables (Button, Input, Card, etc.)
│   ├── dashboard/     # Widgets del dashboard
│   └── layout/        # Layout, Sidebar, Header
├── context/           # React Contexts (Auth, Jornada)
├── pages/             # Páginas de la aplicación
├── services/          # Servicios para Supabase
├── styles/            # CSS global y variables
└── utils/             # Utilidades y helpers
```

## 🛠️ Tecnologías

- **React 18** - UI Library
- **Vite** - Build tool
- **React Router** - Navegación
- **Supabase** - Backend y autenticación
- **Recharts** - Gráficos

## 📝 Funcionalidades

- ✅ Autenticación (Login/Signup)
- ✅ Dashboard con métricas
- ✅ Time Tracker
- ✅ Gráficos de progreso
- ✅ Team Collaboration
- ✅ Diseño responsive

## 🎨 Diseño

El diseño está basado en el mockup "Donezo" con paleta de colores verde profesional.
