# DOCUMENTO DE ESPECIFICACIÓN DE REQUERIMIENTOS (SRS)

## APLICACIÓN DE CONTROL HORARIO

**Versión:** 1.0  
**Fecha:** 04 de Febrero de 2026  
**Proyecto:** Sprint 0 - Sistema de Control Horario con Supabase MCP  
**Equipo:** Grupo X  

---

## TABLA DE CONTENIDOS

1. Introducción
2. Descripción General
3. Requerimientos Específicos
4. Arquitectura del Sistema
5. Modelo de Datos
6. Interfaces Externas
7. Restricciones del Sistema
8. Criterios de Aceptación
9. Apéndices

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento

El presente documento tiene como propósito especificar los requerimientos funcionales y no funcionales de la Aplicación de Control Horario. Este documento servirá como guía para el equipo de desarrollo durante el Sprint 0 y como referencia para la validación del producto final.

### 1.2 Alcance del Producto

La Aplicación de Control Horario es una aplicación web moderna diseñada para la gestión y control de horarios laborales. El sistema permitirá a los usuarios registrar sus entradas y salidas, gestionar pausas durante la jornada laboral y generar reportes visuales del tiempo trabajado. El MVP (Producto Mínimo Viable) se enfoca en proporcionar las funcionalidades esenciales de registro de jornadas y visualización de métricas financieras básicas.

### 1.3 Definiciones, Acrónimos y Abreviaciones

**MVP:** Producto Mínimo Viable (Minimum Viable Product)  
**Jornada:** Período de trabajo completo desde el inicio hasta la finalización  
**Pausa:** Interrupción temporal de la jornada laboral  
**Supabase:** Plataforma de base de datos y autenticación utilizada en el backend  
**MCP:** Model Context Protocol - Protocolo de integración con Supabase  
**UI:** Interfaz de Usuario (User Interface)  
**UX:** Experiencia de Usuario (User Experience)  
**Responsive:** Diseño adaptable a diferentes tamaños de pantalla  
**SPA:** Single Page Application  
**API:** Application Programming Interface  

### 1.4 Referencias

- Documentación oficial de Supabase: https://supabase.com/docs  
- Guía de Sprint Planning del proyecto  
- Video de referencia del proyecto: https://www.youtube.com/watch?v=liqfwPC4FmA  
- React Documentation: https://react.dev  

### 1.5 Visión General del Documento

Este documento se estructura en las siguientes secciones: Introducción, Descripción General del Sistema, Requerimientos Específicos (funcionales y no funcionales), Arquitectura del Sistema, Modelo de Datos, Interfaces Externas, Restricciones del Sistema y Criterios de Aceptación.

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto

La Aplicación de Control Horario es un sistema web independiente que utiliza tecnología moderna de frontend (React/Next.js) conectada a un backend gestionado por Supabase. El sistema está diseñado para ser utilizado por trabajadores individuales o pequeños equipos que necesitan llevar un registro preciso de sus horas laborales y métricas financieras asociadas.

### 2.2 Funciones del Producto

El sistema proporciona las siguientes funciones principales:

**Gestión de Usuarios:** Registro de nuevos usuarios, inicio de sesión seguro mediante Supabase Auth, cierre de sesión y gestión de sesiones persistentes.

**Gestión de Jornadas Laborales:** Registro de inicio de jornada con timestamp automático, funcionalidad de pausa temporal de jornada, finalización de jornada con cálculo automático de horas trabajadas y visualización de estado actual de la jornada (activa, pausada, finalizada).

**Historial de Jornadas:** Consulta de registros históricos de jornadas del usuario, visualización de fechas, horarios y duración de cada jornada, y ordenamiento cronológico de registros.

**Dashboard de Métricas Financieras:** Visualización de ingresos totales en soles, cálculo y visualización de costos totales del inventario, identificación y conteo de clientes nuevos versus recurrentes, cálculo de utilidad neta en valor absoluto y porcentaje, y gráfico de flujo de ingresos y egresos.

### 2.3 Características de los Usuarios

**Usuario Final:** Trabajador o profesional que necesita registrar sus horas laborales. Nivel de experiencia técnica básico a intermedio. Accede al sistema mediante navegador web en computadora o dispositivo móvil. Requiere una interfaz intuitiva y de fácil uso.

**Administrador/Product Owner:** Persona encargada de validar el funcionamiento del sistema y revisar las métricas generadas. Requiere acceso a reportes y visualizaciones claras de datos.

### 2.4 Restricciones Generales

**Tecnológicas:** El sistema debe utilizar Supabase como plataforma de base de datos y autenticación. El frontend debe desarrollarse utilizando React o Next.js. El desarrollo debe realizarse utilizando Google Antigravity IDE. La integración con Supabase debe hacerse mediante Supabase MCP.

**Temporales:** El MVP debe completarse en un sprint de 3 días (72 horas). El horario de trabajo del equipo es de 8:00 AM a 3:00 PM diariamente.

**De Recursos:** El equipo está conformado por 5 integrantes con roles definidos. No se permite el desarrollo directo en la rama main de GitHub.

### 2.5 Suposiciones y Dependencias

**Suposiciones:** Los usuarios tienen acceso a conexión a internet estable. Los usuarios utilizan navegadores web modernos (Chrome, Firefox, Safari, Edge actualizados). Supabase estará disponible durante todo el desarrollo y uso del sistema.

**Dependencias:** Disponibilidad de la plataforma Supabase. Funcionamiento correcto de Google Antigravity IDE. Acceso a Supabase MCP para la integración.

---

## 3. REQUERIMIENTOS ESPECÍFICOS

### 3.1 Requerimientos Funcionales

#### RF-001: Registro de Usuario
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a nuevos usuarios crear una cuenta proporcionando email y contraseña.  

**Entradas:** Email válido, contraseña (mínimo 6 caracteres), confirmación de contraseña.  

**Proceso:** Validar formato de email, verificar que las contraseñas coincidan, verificar que el email no esté registrado previamente, crear registro en Supabase Auth, enviar confirmación al usuario.  

**Salidas:** Cuenta de usuario creada exitosamente, mensaje de confirmación, redirección a página de login.  

**Criterios de Aceptación:** El email debe ser único en el sistema. La contraseña debe tener al menos 6 caracteres. El sistema debe mostrar mensajes de error claros si la validación falla. El usuario debe ser registrado en la tabla users de Supabase.

#### RF-002: Inicio de Sesión
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a usuarios registrados acceder al sistema mediante email y contraseña.  

**Entradas:** Email registrado, contraseña correcta.  

**Proceso:** Validar credenciales contra Supabase Auth, generar token de sesión, almacenar sesión del usuario, redirigir a dashboard principal.  

**Salidas:** Sesión de usuario activa, token de autenticación, acceso al dashboard.  

**Criterios de Aceptación:** Solo usuarios registrados pueden iniciar sesión. Las credenciales incorrectas deben mostrar mensaje de error. La sesión debe persistir al refrescar la página. El usuario debe ser redirigido al dashboard después del login exitoso.

#### RF-003: Cierre de Sesión
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a los usuarios cerrar sesión de forma segura.  

**Entradas:** Acción de logout del usuario autenticado.  

**Proceso:** Invalidar token de sesión, limpiar datos de sesión del navegador, redirigir a página de login.  

**Salidas:** Sesión cerrada, usuario no autenticado, redirección a login.  

**Criterios de Aceptación:** El token de sesión debe invalidarse completamente. El usuario debe ser redirigido a la página de login. No debe ser posible acceder a páginas protegidas después del logout.

#### RF-004: Iniciar Jornada Laboral
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir al usuario iniciar una nueva jornada laboral registrando el timestamp de inicio.  

**Entradas:** Usuario autenticado, acción de "Iniciar Jornada".  

**Proceso:** Verificar que no exista jornada activa, registrar timestamp actual como hora de inicio, guardar user_id asociado, establecer estado de jornada como "activa", guardar registro en tabla jornadas de Supabase.  

**Salidas:** Jornada creada con estado activo, timestamp de inicio registrado, confirmación visual al usuario.  

**Criterios de Aceptación:** Un usuario solo puede tener una jornada activa a la vez. El timestamp debe registrarse automáticamente al momento de iniciar. El botón de iniciar debe deshabilitarse cuando hay jornada activa. El registro debe persistir en Supabase.

#### RF-005: Pausar Jornada Laboral
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir al usuario pausar temporalmente una jornada activa.  

**Entradas:** Usuario con jornada activa, acción de "Pausar Jornada".  

**Proceso:** Verificar que existe jornada activa, registrar timestamp de pausa, calcular tiempo trabajado hasta la pausa, actualizar estado de jornada a "pausada", actualizar registro en Supabase.  

**Salidas:** Jornada con estado pausado, timestamp de pausa registrado, tiempo acumulado calculado, confirmación visual.  

**Criterios de Aceptación:** Solo se puede pausar una jornada en estado activo. El tiempo trabajado hasta la pausa debe calcularse correctamente. El usuario debe poder reanudar la jornada posteriormente. Los datos deben actualizarse en Supabase.

#### RF-006: Finalizar Jornada Laboral
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir al usuario finalizar una jornada activa o pausada.  

**Entradas:** Usuario con jornada activa o pausada, acción de "Finalizar Jornada".  

**Proceso:** Verificar que existe jornada activa o pausada, registrar timestamp de finalización, calcular horas totales trabajadas (excluyendo pausas), actualizar estado de jornada a "finalizada", actualizar registro en Supabase.  

**Salidas:** Jornada finalizada, timestamp de fin registrado, horas totales calculadas, confirmación visual con resumen.  

**Criterios de Aceptación:** Solo se puede finalizar una jornada activa o pausada. Las horas totales deben calcularse restando las pausas. Una jornada finalizada no puede modificarse. El cálculo debe ser preciso al minuto. Los datos deben guardarse en Supabase.

#### RF-007: Visualizar Historial de Jornadas
**Prioridad:** Alta  
**Descripción:** El sistema debe mostrar un listado de todas las jornadas registradas por el usuario.  

**Entradas:** Usuario autenticado accediendo a sección de historial.  

**Proceso:** Consultar tabla jornadas filtrando por user_id, ordenar registros por fecha descendente, formatear fechas y horas para visualización, mostrar duración de cada jornada, presentar datos en formato tabla o lista.  

**Salidas:** Lista de jornadas con fecha, hora inicio, hora fin, duración y estado.  

**Criterios de Aceptación:** Solo se muestran jornadas del usuario autenticado. Los registros se ordenan del más reciente al más antiguo. Las fechas y horas se muestran en formato legible. La duración se calcula y muestra correctamente. Los datos provienen de Supabase.

#### RF-008: Dashboard de Ingresos Totales
**Prioridad:** Media  
**Descripción:** El sistema debe calcular y visualizar los ingresos totales en soles del período.  

**Entradas:** Datos de producción registrados en tabla metricas_financieras.  

**Proceso:** Consultar tabla metricas_financieras, sumar todos los ingresos del usuario, formatear valor en soles peruanos, mostrar en card del dashboard.  

**Salidas:** Valor total de ingresos en formato S/ XX,XXX.XX.  

**Criterios de Aceptación:** El cálculo debe ser preciso. El formato debe incluir símbolo de moneda y decimales. El valor debe actualizarse al cargar el dashboard. Los datos provienen de Supabase.

#### RF-009: Dashboard de Costos Totales
**Prioridad:** Media  
**Descripción:** El sistema debe calcular y visualizar los costos totales del inventario.  

**Entradas:** Datos de inventario registrados en tabla metricas_financieras.  

**Proceso:** Consultar tabla metricas_financieras, sumar todos los costos del usuario, formatear valor en soles, mostrar en card del dashboard.  

**Salidas:** Valor total de costos en formato S/ XX,XXX.XX.  

**Criterios de Aceptación:** El cálculo debe incluir todos los costos del inventario. El formato debe ser consistente con ingresos. El valor debe provenir de Supabase.

#### RF-010: Dashboard de Clientes
**Prioridad:** Media  
**Descripción:** El sistema debe identificar y mostrar la cantidad de clientes nuevos versus recurrentes.  

**Entradas:** Datos de clientes en tabla metricas_financieras.  

**Proceso:** Consultar tabla de clientes o metricas_financieras, identificar clientes por fecha de primer registro, clasificar como nuevos (primera compra en período) o recurrentes (compras anteriores), contar cada categoría, mostrar en card del dashboard.  

**Salidas:** Cantidad de clientes nuevos y cantidad de clientes recurrentes.  

**Criterios de Aceptación:** La clasificación debe ser precisa basada en fechas. Los números deben actualizarse dinámicamente. Los datos provienen de Supabase.

#### RF-011: Dashboard de Utilidad Neta
**Prioridad:** Media  
**Descripción:** El sistema debe calcular y mostrar la utilidad neta en soles y porcentaje.  

**Entradas:** Ingresos totales y costos totales previamente calculados.  

**Proceso:** Calcular utilidad neta (Ingresos - Costos), calcular porcentaje de utilidad ((Utilidad / Ingresos) * 100), formatear valores, mostrar ambos en card del dashboard.  

**Salidas:** Utilidad neta en S/ XX,XXX.XX y porcentaje XX.XX%.  

**Criterios de Aceptación:** Los cálculos deben ser matemáticamente correctos. Se deben mostrar ambos formatos (valor y porcentaje). Los valores deben reflejar datos actuales de Supabase.

#### RF-012: Gráfico de Flujo de Ingresos y Egresos
**Prioridad:** Media  
**Descripción:** El sistema debe visualizar gráficamente el flujo de ingresos y egresos.  

**Entradas:** Datos históricos de ingresos y egresos.  

**Proceso:** Consultar datos agrupados por período (día/semana/mes), preparar datos para visualización gráfica, renderizar gráfico de líneas o barras, mostrar en dashboard.  

**Salidas:** Gráfico visual mostrando tendencia de ingresos vs egresos.  

**Criterios de Aceptación:** El gráfico debe ser legible y claro. Los datos deben corresponder a Supabase. El gráfico debe ser responsive.

#### RF-013: Protección de Rutas
**Prioridad:** Alta  
**Descripción:** El sistema debe proteger las rutas privadas permitiendo acceso solo a usuarios autenticados.  

**Entradas:** Intento de acceso a ruta protegida.  

**Proceso:** Verificar existencia de token de sesión válido, validar token con Supabase, permitir acceso si es válido, redirigir a login si no es válido.  

**Salidas:** Acceso concedido o redirección a login.  

**Criterios de Aceptación:** Todas las rutas excepto login y signup deben estar protegidas. Usuarios no autenticados deben ser redirigidos. El token debe validarse en cada navegación.

### 3.2 Requerimientos No Funcionales

#### RNF-001: Usabilidad
**Descripción:** La interfaz debe ser intuitiva y fácil de usar para usuarios con nivel básico de experiencia técnica.  

**Métrica:** Un usuario nuevo debe poder registrar su primera jornada en menos de 2 minutos después del registro. Los botones principales deben ser claramente identificables. Los mensajes de error deben ser comprensibles sin conocimiento técnico.

#### RNF-002: Diseño Responsive
**Descripción:** La aplicación debe funcionar correctamente en dispositivos de diferentes tamaños de pantalla.  

**Métrica:** La interfaz debe adaptarse correctamente a resoluciones desde 320px (móvil) hasta 1920px (desktop). Todos los elementos deben ser accesibles y utilizables en pantallas móviles. No debe haber scroll horizontal en ninguna resolución.

#### RNF-003: Rendimiento
**Descripción:** El sistema debe responder rápidamente a las acciones del usuario.  

**Métrica:** El tiempo de carga inicial de la aplicación no debe exceder 3 segundos. Las operaciones de registro de jornada deben completarse en menos de 1 segundo. La consulta de historial debe cargar en menos de 2 segundos.

#### RNF-004: Disponibilidad
**Descripción:** El sistema debe estar disponible durante el horario laboral.  

**Métrica:** Uptime del 95% o superior durante horas laborales. Dependencia de la disponibilidad de Supabase.

#### RNF-005: Seguridad
**Descripción:** El sistema debe proteger los datos sensibles de los usuarios.  

**Métrica:** Las contraseñas deben almacenarse hasheadas (manejado por Supabase Auth). Las comunicaciones deben usar HTTPS. Los tokens de sesión deben tener tiempo de expiración. Un usuario solo puede acceder a sus propios datos.

#### RNF-006: Mantenibilidad
**Descripción:** El código debe ser legible y bien documentado para facilitar mantenimiento futuro.  

**Métrica:** Código debe seguir convenciones de nomenclatura estándar. Funciones deben tener comentarios explicativos. README debe incluir instrucciones completas de instalación y ejecución.

#### RNF-007: Escalabilidad
**Descripción:** El sistema debe poder soportar crecimiento en número de usuarios.  

**Métrica:** La arquitectura debe permitir agregar usuarios sin degradación significativa de rendimiento. Supabase debe manejar la escalabilidad de la base de datos.

#### RNF-008: Compatibilidad de Navegadores
**Descripción:** La aplicación debe funcionar en los navegadores web modernos más utilizados.  

**Métrica:** Compatibilidad con Chrome (versión 90+), Firefox (versión 88+), Safari (versión 14+), Edge (versión 90+).

#### RNF-009: Accesibilidad Básica
**Descripción:** La interfaz debe seguir principios básicos de accesibilidad web.  

**Métrica:** Los botones deben tener tamaño mínimo de 44x44px para facilitar click/tap. El contraste de colores debe ser suficiente para legibilidad. Los elementos interactivos deben tener estados visuales claros (hover, focus, active).

#### RNF-010: Persistencia de Datos
**Descripción:** Todos los datos críticos deben persistir correctamente en la base de datos.  

**Métrica:** Los datos de jornadas deben guardarse en Supabase inmediatamente después de cada acción. Los datos de métricas deben actualizarse en tiempo real. No debe haber pérdida de datos al cerrar el navegador.

---

## 4. ARQUITECTURA DEL SISTEMA

### 4.1 Arquitectura General

La aplicación sigue una arquitectura de tres capas (Three-Tier Architecture) adaptada para aplicaciones web modernas:

**Capa de Presentación (Frontend):**
Implementada con React/Next.js, esta capa maneja toda la interfaz de usuario y la experiencia del usuario. Se ejecuta en el navegador del cliente y se comunica con la capa de datos mediante APIs REST.

**Capa de Lógica de Negocio (Middleware):**
Implementada parcialmente en el frontend (validaciones, cálculos locales) y parcialmente gestionada por Supabase (triggers, funciones de base de datos, políticas de seguridad Row Level Security).

**Capa de Datos (Backend):**
Completamente gestionada por Supabase, incluye la base de datos PostgreSQL, el sistema de autenticación Supabase Auth, y las APIs autogeneradas.

### 4.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     NAVEGADOR WEB                           │
│                    (Cliente Frontend)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Páginas    │  │ Componentes  │  │   Servicios  │     │
│  │ (Pages/Views)│  │     UI       │  │   (API)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│          │                 │                  │            │
│          └─────────────────┴──────────────────┘            │
│                         │                                  │
│                    ┌────▼────┐                             │
│                    │  Router │                             │
│                    └────┬────┘                             │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                   HTTPS/REST API
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                   SUPABASE PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Supabase    │  │  PostgreSQL  │  │  Row Level   │     │
│  │    Auth      │  │   Database   │  │  Security    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auto REST   │  │   Realtime   │  │   Storage    │     │
│  │     API      │  │  Subscript.  │  │   (Futuro)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                   ┌──────▼──────┐
                   │  Supabase   │
                   │     MCP     │
                   └─────────────┘
                          │
                   ┌──────▼──────┐
                   │  Antigravity│
                   │     IDE     │
                   └─────────────┘
```

### 4.3 Patrones de Arquitectura Utilizados

**SPA (Single Page Application):**
La aplicación carga una única página HTML y actualiza dinámicamente el contenido sin recargar la página completa. Esto proporciona una experiencia de usuario más fluida y rápida.

**Component-Based Architecture:**
La interfaz está construida con componentes React reutilizables y modulares. Cada componente es responsable de su propia lógica y presentación.

**Client-Side Routing:**
La navegación entre vistas se maneja en el cliente mediante React Router, sin recargas de página.

**API-First Design:**
Toda la comunicación con el backend se realiza mediante APIs REST de Supabase, permitiendo separación clara entre frontend y backend.

**Authentication as a Service:**
La autenticación es gestionada completamente por Supabase Auth, siguiendo el patrón de servicios externos especializados.

### 4.4 Estructura de Directorios del Proyecto

```
control-horario-app/
│
├── public/                          # Archivos estáticos públicos
│   ├── index.html                   # HTML principal
│   ├── favicon.ico                  # Icono de la aplicación
│   └── assets/                      # Imágenes, logos, etc.
│
├── src/                             # Código fuente principal
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── layout/                  # Componentes de estructura
│   │   │   ├── Header.jsx           # Navbar/Header principal
│   │   │   ├── Footer.jsx           # Pie de página
│   │   │   ├── Sidebar.jsx          # Barra lateral (si aplica)
│   │   │   └── Layout.jsx           # Contenedor layout general
│   │   │
│   │   ├── auth/                    # Componentes de autenticación
│   │   │   ├── LoginForm.jsx        # Formulario de login
│   │   │   ├── SignupForm.jsx       # Formulario de registro
│   │   │   └── ProtectedRoute.jsx   # HOC para rutas protegidas
│   │   │
│   │   ├── dashboard/               # Componentes del dashboard
│   │   │   ├── MetricCard.jsx       # Card genérica para métricas
│   │   │   ├── IncomeCard.jsx       # Card de ingresos
│   │   │   ├── CostsCard.jsx        # Card de costos
│   │   │   ├── ClientsCard.jsx      # Card de clientes
│   │   │   ├── ProfitCard.jsx       # Card de utilidad neta
│   │   │   └── FlowChart.jsx        # Gráfico de flujo
│   │   │
│   │   ├── jornadas/                # Componentes de jornadas
│   │   │   ├── JornadaControls.jsx  # Botones de control
│   │   │   ├── JornadaStatus.jsx    # Estado actual de jornada
│   │   │   ├── JornadaTimer.jsx     # Reloj/temporizador
│   │   │   └── HistorialTable.jsx   # Tabla de historial
│   │   │
│   │   └── common/                  # Componentes comunes
│   │       ├── Button.jsx           # Botón reutilizable
│   │       ├── Input.jsx            # Input reutilizable
│   │       ├── Card.jsx             # Card genérica
│   │       ├── Loading.jsx          # Indicador de carga
│   │       ├── Alert.jsx            # Mensajes de alerta
│   │       └── Modal.jsx            # Modal genérico
│   │
│   ├── pages/                       # Páginas/Vistas principales
│   │   ├── Login.jsx                # Página de inicio de sesión
│   │   ├── Signup.jsx               # Página de registro
│   │   ├── Dashboard.jsx            # Dashboard principal
│   │   ├── Jornada.jsx              # Página de registro jornada
│   │   ├── Historial.jsx            # Página de historial
│   │   └── NotFound.jsx             # Página 404
│   │
│   ├── services/                    # Servicios y lógica de negocio
│   │   ├── supabase.js              # Cliente de Supabase
│   │   ├── authService.js           # Servicios de autenticación
│   │   ├── jornadasService.js       # Servicios de jornadas
│   │   ├── metricasService.js       # Servicios de métricas
│   │   └── apiClient.js             # Cliente HTTP genérico
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.js               # Hook de autenticación
│   │   ├── useJornada.js            # Hook de jornada actual
│   │   ├── useHistorial.js          # Hook de historial
│   │   └── useMetricas.js           # Hook de métricas
│   │
│   ├── context/                     # Context API de React
│   │   ├── AuthContext.jsx          # Contexto de autenticación
│   │   └── JornadaContext.jsx       # Contexto de jornada activa
│   │
│   ├── utils/                       # Utilidades y helpers
│   │   ├── dateFormatters.js        # Formateo de fechas
│   │   ├── timeCalculators.js       # Cálculos de tiempo
│   │   ├── validators.js            # Validaciones de formularios
│   │   └── constants.js             # Constantes de la app
│   │
│   ├── styles/                      # Estilos CSS
│   │   ├── global.css               # Estilos globales
│   │   ├── variables.css            # Variables CSS
│   │   └── components/              # Estilos por componente
│   │
│   ├── config/                      # Configuraciones
│   │   ├── supabaseConfig.js        # Config de Supabase
│   │   └── appConfig.js             # Config general de la app
│   │
│   ├── App.jsx                      # Componente raíz de la app
│   ├── index.jsx                    # Punto de entrada
│   └── routes.jsx                   # Definición de rutas
│
├── .env                             # Variables de entorno
├── .env.example                     # Ejemplo de variables
├── .gitignore                       # Archivos ignorados por Git
├── package.json                     # Dependencias y scripts
├── README.md                        # Documentación del proyecto
└── vite.config.js                   # Configuración de Vite/Build
```

### 4.5 Componentes Principales y sus Responsabilidades

#### 4.5.1 Componentes de Layout

**Header (Navbar):**
Responsabilidad: Mostrar el logo de la aplicación, nombre del usuario autenticado, menú de navegación principal y botón de logout.
Props: user (objeto de usuario), onLogout (función callback).
Estado interno: Ninguno (stateless component).

**Footer:**
Responsabilidad: Mostrar información del copyright, enlaces a términos y condiciones, información de contacto.
Props: Ninguno.
Estado interno: Ninguno.

**Layout:**
Responsabilidad: Contenedor principal que estructura la página con Header, contenido principal y Footer. Aplica estilos de diseño responsive.
Props: children (componentes hijos a renderizar).
Estado interno: Ninguno.

#### 4.5.2 Componentes de Autenticación

**LoginForm:**
Responsabilidad: Renderizar formulario de login, validar inputs, manejar submit, mostrar errores de autenticación.
Props: onLoginSuccess (callback después de login exitoso).
Estado interno: email, password, loading, error.
Servicios consumidos: authService.login().

**SignupForm:**
Responsabilidad: Renderizar formulario de registro, validar inputs (email, contraseña, confirmación), manejar submit, mostrar errores.
Props: onSignupSuccess (callback después de registro exitoso).
Estado interno: email, password, confirmPassword, loading, error.
Servicios consumidos: authService.signup().

**ProtectedRoute:**
Responsabilidad: HOC (Higher Order Component) que protege rutas verificando autenticación antes de renderizar componente hijo.
Props: children (componente a proteger).
Estado interno: Ninguno (usa contexto de autenticación).
Lógica: Si usuario autenticado, renderiza children. Si no, redirige a /login.

#### 4.5.3 Componentes del Dashboard

**MetricCard (Genérica):**
Responsabilidad: Componente base reutilizable para mostrar una métrica con título, valor, icono y color.
Props: title, value, icon, color, trend (opcional).
Estado interno: Ninguno.

**IncomeCard:**
Responsabilidad: Mostrar ingresos totales en soles. Extiende MetricCard.
Props: value (número).
Estado interno: Ninguno.
Servicios consumidos: metricasService.getIngresos().

**CostsCard:**
Responsabilidad: Mostrar costos totales. Extiende MetricCard.
Props: value (número).
Estado interno: Ninguno.
Servicios consumidos: metricasService.getCostos().

**ClientsCard:**
Responsabilidad: Mostrar cantidad de clientes nuevos y recurrentes.
Props: nuevos (número), recurrentes (número).
Estado interno: Ninguno.
Servicios consumidos: metricasService.getClientes().

**ProfitCard:**
Responsabilidad: Mostrar utilidad neta en soles y porcentaje.
Props: value (número), percentage (número).
Estado interno: Ninguno.
Servicios consumidos: metricasService.getUtilidad().

**FlowChart:**
Responsabilidad: Renderizar gráfico de líneas o barras mostrando flujo de ingresos vs egresos.
Props: data (array de objetos con ingresos y egresos por período).
Estado interno: Ninguno.
Librerías: Chart.js o Recharts.
Servicios consumidos: metricasService.getFlujo().

#### 4.5.4 Componentes de Jornadas

**JornadaControls:**
Responsabilidad: Renderizar botones de Iniciar, Pausar y Finalizar jornada con estados habilitados/deshabilitados según estado actual.
Props: jornadaActual (objeto o null), onIniciar, onPausar, onFinalizar (callbacks).
Estado interno: loading (durante operaciones).
Servicios consumidos: jornadasService.iniciar(), pausar(), finalizar().

**JornadaStatus:**
Responsabilidad: Mostrar el estado actual de la jornada (activa, pausada, finalizada, sin jornada).
Props: jornadaActual (objeto o null).
Estado interno: Ninguno.
Lógica: Renderiza diferentes mensajes/colores según el estado.

**JornadaTimer:**
Responsabilidad: Mostrar un reloj en tiempo real contando las horas trabajadas en la jornada activa.
Props: jornadaActual (objeto con hora_inicio).
Estado interno: tiempoTranscurrido (actualizado cada segundo con useEffect).
Lógica: Calcula diferencia entre hora actual y hora_inicio, excluyendo pausas.

**HistorialTable:**
Responsabilidad: Renderizar tabla con listado de jornadas históricas del usuario.
Props: jornadas (array de objetos).
Estado interno: Ninguno.
Lógica: Mapea el array de jornadas a filas de tabla con fecha, hora inicio, hora fin, duración formateada.

#### 4.5.5 Componentes Comunes

**Button:**
Responsabilidad: Botón reutilizable con variantes de estilo (primary, secondary, danger).
Props: children, onClick, variant, disabled, loading.
Estado interno: Ninguno.

**Input:**
Responsabilidad: Input de texto reutilizable con label, validación y mensajes de error.
Props: label, type, value, onChange, error, placeholder.
Estado interno: Ninguno (controlled component).

**Card:**
Responsabilidad: Contenedor de tarjeta genérico con padding y sombra.
Props: children, className.
Estado interno: Ninguno.

**Loading:**
Responsabilidad: Indicador de carga (spinner o skeleton).
Props: tipo (spinner, skeleton), size.
Estado interno: Ninguno.

**Alert:**
Responsabilidad: Mostrar mensajes de éxito, error, advertencia o información.
Props: message, type (success, error, warning, info), onClose.
Estado interno: Ninguno.

**Modal:**
Responsabilidad: Modal genérico para mostrar contenido sobre la página.
Props: isOpen, onClose, children, title.
Estado interno: Ninguno.

### 4.6 Flujo de Datos

#### 4.6.1 Flujo de Autenticación

1. Usuario ingresa credenciales en LoginForm
2. LoginForm llama a authService.login(email, password)
3. authService hace request a Supabase Auth API
4. Supabase valida credenciales y retorna token JWT
5. authService almacena token en localStorage y actualiza AuthContext
6. AuthContext notifica a todos los componentes suscritos
7. ProtectedRoute detecta usuario autenticado y permite acceso
8. Usuario es redirigido a Dashboard

#### 4.6.2 Flujo de Registro de Jornada

1. Usuario hace click en botón "Iniciar Jornada" en JornadaControls
2. JornadaControls llama a jornadasService.iniciar()
3. jornadasService hace INSERT a tabla jornadas en Supabase con timestamp actual
4. Supabase retorna el registro creado
5. jornadasService actualiza JornadaContext con la jornada activa
6. JornadaContext notifica a JornadaStatus y JornadaTimer
7. JornadaStatus muestra "Jornada Activa"
8. JornadaTimer comienza a contar tiempo transcurrido
9. JornadaControls deshabilita botón "Iniciar" y habilita "Pausar" y "Finalizar"

#### 4.6.3 Flujo de Carga de Dashboard

1. Usuario navega a página Dashboard
2. Dashboard renderiza y ejecuta useEffect al montar
3. useEffect llama a múltiples servicios en paralelo:
   - metricasService.getIngresos()
   - metricasService.getCostos()
   - metricasService.getClientes()
   - metricasService.getUtilidad()
   - metricasService.getFlujo()
4. Cada servicio hace query a Supabase
5. Supabase retorna los datos calculados
6. Dashboard actualiza su estado con los datos recibidos
7. Cada MetricCard renderiza con los datos actualizados
8. FlowChart renderiza el gráfico con los datos de flujo

### 4.7 Gestión de Estado

**Estado Local (useState):**
Utilizado para estado que solo afecta a un componente específico. Ejemplos: valores de inputs de formulario, estados de loading, errores de validación.

**Context API:**
Utilizado para estado global que debe compartirse entre múltiples componentes. Ejemplos: información del usuario autenticado (AuthContext), jornada activa actual (JornadaContext).

**Custom Hooks:**
Encapsulan lógica de estado y efectos secundarios reutilizables. Ejemplos: useAuth (maneja autenticación), useJornada (maneja jornada activa), useHistorial (carga historial de jornadas).

### 4.8 Comunicación con Backend (Supabase)

**Cliente Supabase:**
Archivo: src/services/supabase.js
Responsabilidad: Crear y exportar instancia configurada del cliente Supabase.
Configuración: Usa SUPABASE_URL y SUPABASE_ANON_KEY de variables de entorno.

**Servicios por Dominio:**
Cada dominio de la aplicación tiene su propio archivo de servicio que encapsula todas las operaciones relacionadas.

authService.js:
- signup(email, password): Registra nuevo usuario
- login(email, password): Autentica usuario existente
- logout(): Cierra sesión
- getCurrentUser(): Obtiene usuario actual
- onAuthStateChange(callback): Suscribe a cambios de autenticación

jornadasService.js:
- iniciar(userId): Crea nueva jornada activa
- pausar(jornadaId): Pausa jornada activa
- finalizar(jornadaId): Finaliza jornada
- getActiva(userId): Obtiene jornada activa del usuario
- getHistorial(userId): Obtiene listado de jornadas

metricasService.js:
- getIngresos(userId): Calcula ingresos totales
- getCostos(userId): Calcula costos totales
- getClientes(userId): Obtiene conteo de clientes
- getUtilidad(userId): Calcula utilidad neta
- getFlujo(userId, periodo): Obtiene flujo de ingresos/egresos

### 4.9 Seguridad en la Arquitectura

**Row Level Security (RLS) en Supabase:**
Cada tabla tiene políticas RLS que garantizan que un usuario solo pueda acceder a sus propios datos.

Política para tabla jornadas:
- SELECT: user_id = auth.uid()
- INSERT: user_id = auth.uid()
- UPDATE: user_id = auth.uid() AND id = jornada.id
- DELETE: false (no permitido)

Política para tabla metricas_financieras:
- SELECT: user_id = auth.uid()
- INSERT: user_id = auth.uid()
- UPDATE: user_id = auth.uid()
- DELETE: false (no permitido)

**Validación en Frontend:**
Todas las entradas del usuario son validadas antes de enviarse a Supabase. Se utilizan librerías de validación o funciones custom en utils/validators.js.

**Tokens JWT:**
Supabase Auth genera tokens JWT que se envían en el header Authorization de cada request. Los tokens tienen tiempo de expiración y se renuevan automáticamente.

**HTTPS:**
Toda la comunicación entre frontend y Supabase se realiza sobre HTTPS, protegiendo datos en tránsito.

---

## 5. MODELO DE DATOS

### 5.1 Diagrama Entidad-Relación Conceptual

```
┌─────────────────────┐
│       USERS         │
│  (Supabase Auth)    │
├─────────────────────┤
│ id (UUID, PK)       │
│ email (String)      │
│ password_hash       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│     JORNADAS        │
├─────────────────────┤
│ id (UUID, PK)       │
│ user_id (UUID, FK)  │◄──────────┐
│ fecha (Date)        │           │
│ hora_inicio (Time)  │           │
│ hora_pausa (Time)   │           │
│ hora_fin (Time)     │           │
│ horas_trabajadas    │           │
│ estado (Enum)       │           │
│ created_at          │           │
│ updated_at          │           │
└─────────────────────┘           │
                                  │
                                  │
┌─────────────────────┐           │
│ METRICAS_FINANCIERAS│           │
├─────────────────────┤           │
│ id (UUID, PK)       │           │
│ user_id (UUID, FK)  │───────────┘
│ ingresos_totales    │
│ costos_totales      │
│ clientes_nuevos     │
│ clientes_recurrentes│
│ utilidad_neta       │
│ porcentaje_utilidad │
│ periodo (Date)      │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

### 5.2 Descripción Detallada de Tablas

#### 5.2.1 Tabla: users (Gestionada por Supabase Auth)

**Descripción:** Almacena información de usuarios registrados en el sistema. Esta tabla es gestionada automáticamente por Supabase Auth.

**Campos:**

| Campo         | Tipo      | Restricciones          | Descripción                        |
|---------------|-----------|------------------------|------------------------------------|
| id            | UUID      | PK, NOT NULL           | Identificador único del usuario    |
| email         | String    | UNIQUE, NOT NULL       | Correo electrónico del usuario     |
| password_hash | String    | NOT NULL               | Contraseña encriptada              |
| created_at    | Timestamp | NOT NULL, DEFAULT NOW()| Fecha de creación de la cuenta     |
| updated_at    | Timestamp | NOT NULL, DEFAULT NOW()| Fecha de última actualización      |

**Índices:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)

**Políticas RLS:**
Gestionadas automáticamente por Supabase Auth.

#### 5.2.2 Tabla: jornadas

**Descripción:** Almacena los registros de jornadas laborales de cada usuario.

**Campos:**

| Campo            | Tipo      | Restricciones            | Descripción                           |
|------------------|-----------|--------------------------|---------------------------------------|
| id               | UUID      | PK, NOT NULL             | Identificador único de la jornada     |
| user_id          | UUID      | FK, NOT NULL             | Referencia al usuario propietario     |
| fecha            | Date      | NOT NULL                 | Fecha de la jornada                   |
| hora_inicio      | Timestamp | NOT NULL                 | Timestamp de inicio de jornada        |
| hora_pausa       | Timestamp | NULL                     | Timestamp de pausa (si aplica)        |
| hora_fin         | Timestamp | NULL                     | Timestamp de finalización             |
| horas_trabajadas | Decimal   | NULL                     | Total de horas trabajadas calculadas  |
| estado           | Enum      | NOT NULL, DEFAULT 'activa' | Estado: activa, pausada, finalizada |
| created_at       | Timestamp | NOT NULL, DEFAULT NOW()  | Fecha de creación del registro        |
| updated_at       | Timestamp | NOT NULL, DEFAULT NOW()  | Fecha de última actualización         |

**Relaciones:**
- user_id REFERENCES users(id) ON DELETE CASCADE

**Índices:**
- PRIMARY KEY (id)
- INDEX idx_jornadas_user_id (user_id)
- INDEX idx_jornadas_fecha (fecha)
- INDEX idx_jornadas_estado (estado)

**Políticas RLS:**
```sql
-- Política de SELECT
CREATE POLICY "Users can view own jornadas"
ON jornadas FOR SELECT
USING (auth.uid() = user_id);

-- Política de INSERT
CREATE POLICY "Users can insert own jornadas"
ON jornadas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE
CREATE POLICY "Users can update own jornadas"
ON jornadas FOR UPDATE
USING (auth.uid() = user_id);

-- Política de DELETE (deshabilitada para MVP)
CREATE POLICY "Users cannot delete jornadas"
ON jornadas FOR DELETE
USING (false);
```

**Restricciones de Negocio:**
- Un usuario no puede tener más de una jornada en estado "activa" simultáneamente (validado en frontend y mediante trigger en Supabase).
- hora_fin debe ser posterior a hora_inicio.
- horas_trabajadas se calcula automáticamente: (hora_fin - hora_inicio) - tiempo_pausas.

#### 5.2.3 Tabla: metricas_financieras

**Descripción:** Almacena métricas financieras calculadas para cada usuario por período.

**Campos:**

| Campo                 | Tipo      | Restricciones           | Descripción                           |
|-----------------------|-----------|-------------------------|---------------------------------------|
| id                    | UUID      | PK, NOT NULL            | Identificador único del registro      |
| user_id               | UUID      | FK, NOT NULL            | Referencia al usuario propietario     |
| ingresos_totales      | Decimal   | NOT NULL, DEFAULT 0     | Suma total de ingresos                |
| costos_totales        | Decimal   | NOT NULL, DEFAULT 0     | Suma total de costos                  |
| clientes_nuevos       | Integer   | NOT NULL, DEFAULT 0     | Cantidad de clientes nuevos           |
| clientes_recurrentes  | Integer   | NOT NULL, DEFAULT 0     | Cantidad de clientes recurrentes      |
| utilidad_neta         | Decimal   | NULL                    | Calculado: ingresos - costos          |
| porcentaje_utilidad   | Decimal   | NULL                    | Calculado: (utilidad / ingresos) * 100|
| periodo               | Date      | NOT NULL                | Período de la métrica (día/semana/mes)|
| created_at            | Timestamp | NOT NULL, DEFAULT NOW() | Fecha de creación del registro        |
| updated_at            | Timestamp | NOT NULL, DEFAULT NOW() | Fecha de última actualización         |

**Relaciones:**
- user_id REFERENCES users(id) ON DELETE CASCADE

**Índices:**
- PRIMARY KEY (id)
- INDEX idx_metricas_user_id (user_id)
- INDEX idx_metricas_periodo (periodo)
- UNIQUE INDEX idx_metricas_user_periodo (user_id, periodo)

**Políticas RLS:**
```sql
-- Política de SELECT
CREATE POLICY "Users can view own metrics"
ON metricas_financieras FOR SELECT
USING (auth.uid() = user_id);

-- Política de INSERT
CREATE POLICY "Users can insert own metrics"
ON metricas_financieras FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE
CREATE POLICY "Users can update own metrics"
ON metricas_financieras FOR UPDATE
USING (auth.uid() = user_id);

-- Política de DELETE (deshabilitada para MVP)
CREATE POLICY "Users cannot delete metrics"
ON metricas_financieras FOR DELETE
USING (false);
```

**Restricciones de Negocio:**
- utilidad_neta debe calcularse automáticamente mediante trigger o computed column.
- porcentaje_utilidad debe calcularse automáticamente.
- No puede haber registros duplicados para user_id + periodo.

### 5.3 Triggers y Funciones de Base de Datos

#### Trigger para Calcular Utilidad Neta

```sql
CREATE OR REPLACE FUNCTION calculate_utilidad()
RETURNS TRIGGER AS $$
BEGIN
  NEW.utilidad_neta = NEW.ingresos_totales - NEW.costos_totales;
  
  IF NEW.ingresos_totales > 0 THEN
    NEW.porcentaje_utilidad = (NEW.utilidad_neta / NEW.ingresos_totales) * 100;
  ELSE
    NEW.porcentaje_utilidad = 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_utilidad
BEFORE INSERT OR UPDATE ON metricas_financieras
FOR EACH ROW
EXECUTE FUNCTION calculate_utilidad();
```

#### Trigger para Validar Jornada Única Activa

```sql
CREATE OR REPLACE FUNCTION validate_jornada_activa()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado = 'activa' THEN
    IF EXISTS (
      SELECT 1 FROM jornadas
      WHERE user_id = NEW.user_id
      AND estado = 'activa'
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'User already has an active jornada';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_jornada_activa
BEFORE INSERT OR UPDATE ON jornadas
FOR EACH ROW
EXECUTE FUNCTION validate_jornada_activa();
```

### 5.4 Consultas SQL Comunes

#### Obtener Jornada Activa de un Usuario

```sql
SELECT *
FROM jornadas
WHERE user_id = $1
  AND estado = 'activa'
LIMIT 1;
```

#### Obtener Historial de Jornadas

```sql
SELECT id, fecha, hora_inicio, hora_fin, horas_trabajadas, estado
FROM jornadas
WHERE user_id = $1
ORDER BY fecha DESC, hora_inicio DESC
LIMIT 50;
```

#### Calcular Ingresos Totales del Período Actual

```sql
SELECT COALESCE(SUM(ingresos_totales), 0) as total_ingresos
FROM metricas_financieras
WHERE user_id = $1
  AND periodo = CURRENT_DATE;
```

#### Obtener Flujo de Ingresos y Egresos de los Últimos 7 Días

```sql
SELECT 
  periodo,
  ingresos_totales,
  costos_totales,
  utilidad_neta
FROM metricas_financieras
WHERE user_id = $1
  AND periodo >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY periodo ASC;
```

---

## 6. INTERFACES EXTERNAS

### 6.1 Interfaces de Usuario

#### 6.1.1 Página de Login

**Ruta:** /login

**Componentes:**
- LoginForm (formulario principal)
- Input (email)
- Input (password)
- Button (iniciar sesión)
- Link (enlace a página de registro)

**Campos:**
- Email: Input tipo email, requerido, validación de formato
- Password: Input tipo password, requerido, mínimo 6 caracteres

**Acciones:**
- Submit: Valida campos y llama a authService.login()
- Ir a Registro: Navega a /signup

**Mensajes:**
- Error: "Credenciales incorrectas"
- Error: "Email inválido"
- Success: Redirección automática a /dashboard

**Responsive:**
- Desktop: Formulario centrado con ancho máximo 400px
- Mobile: Formulario ocupa 90% del ancho de pantalla

#### 6.1.2 Página de Signup

**Ruta:** /signup

**Componentes:**
- SignupForm (formulario principal)
- Input (email)
- Input (password)
- Input (confirmación de password)
- Button (registrarse)
- Link (enlace a login)

**Campos:**
- Email: Input tipo email, requerido, validación de formato
- Password: Input tipo password, requerido, mínimo 6 caracteres
- Confirmar Password: Input tipo password, debe coincidir con password

**Acciones:**
- Submit: Valida campos, verifica coincidencia de passwords, llama a authService.signup()
- Ir a Login: Navega a /login

**Mensajes:**
- Error: "Las contraseñas no coinciden"
- Error: "El email ya está registrado"
- Error: "La contraseña debe tener al menos 6 caracteres"
- Success: "Cuenta creada exitosamente" + redirección a /login

**Responsive:**
- Desktop: Formulario centrado con ancho máximo 400px
- Mobile: Formulario ocupa 90% del ancho de pantalla

#### 6.1.3 Dashboard Principal

**Ruta:** /dashboard (protegida)

**Componentes:**
- Header (con nombre de usuario y logout)
- Grid de Cards de métricas (4-5 cards)
- FlowChart (gráfico de flujo)

**Secciones:**

1. Ingresos Totales (Card):
   - Título: "Ingresos Totales"
   - Valor: S/ XX,XXX.XX
   - Icono: Flecha hacia arriba (verde)

2. Costos Totales (Card):
   - Título: "Costos Totales"
   - Valor: S/ XX,XXX.XX
   - Icono: Flecha hacia abajo (rojo)

3. Clientes (Card):
   - Título: "Clientes"
   - Valor: X nuevos / Y recurrentes
   - Icono: Grupo de personas

4. Utilidad Neta (Card):
   - Título: "Utilidad Neta"
   - Valor: S/ XX,XXX.XX (XX.XX%)
   - Icono: Gráfico de tendencia
   - Color: Verde si positivo, rojo si negativo

5. Gráfico de Flujo:
   - Título: "Flujo de Ingresos y Egresos"
   - Tipo: Gráfico de líneas o barras
   - Eje X: Períodos (días/semanas)
   - Eje Y: Monto en soles
   - Líneas: Ingresos (verde), Egresos (rojo)

**Acciones:**
- Navegar a Jornadas: Click en menú o botón
- Navegar a Historial: Click en menú o botón
- Logout: Click en botón de cerrar sesión

**Estados:**
- Loading: Muestra skeletons mientras cargan datos
- Error: Muestra mensaje de error si falla carga
- Success: Muestra datos actualizados

**Responsive:**
- Desktop: Grid de 2x2 o 2x3 para cards, gráfico ocupa ancho completo
- Tablet: Grid de 2x2, gráfico ocupa ancho completo
- Mobile: Cards en columna única, gráfico ajustado

#### 6.1.4 Página de Registro de Jornada

**Ruta:** /jornada (protegida)

**Componentes:**
- JornadaStatus (muestra estado actual)
- JornadaTimer (reloj con tiempo transcurrido)
- JornadaControls (botones de acción)

**Secciones:**

1. Estado de Jornada:
   - Sin jornada: "No hay jornada activa"
   - Activa: "Jornada en curso" (color verde)
   - Pausada: "Jornada pausada" (color amarillo)
   - Finalizada: "Jornada finalizada" (color gris)

2. Reloj/Timer (solo si jornada activa):
   - Formato: HH:MM:SS
   - Actualización: Cada segundo
   - Muestra tiempo trabajado excluyendo pausas

3. Botones de Control:
   - Iniciar Jornada: Habilitado solo si no hay jornada activa
   - Pausar Jornada: Habilitado solo si jornada está activa
   - Finalizar Jornada: Habilitado si jornada está activa o pausada

**Acciones:**
- Iniciar: Crea nueva jornada, actualiza estado a "activa", inicia timer
- Pausar: Actualiza jornada, cambia estado a "pausada", pausa timer
- Finalizar: Actualiza jornada, cambia estado a "finalizada", detiene timer, muestra resumen

**Mensajes:**
- Success: "Jornada iniciada correctamente"
- Success: "Jornada pausada"
- Success: "Jornada finalizada. Trabajaste X horas y Y minutos"
- Error: "No se pudo iniciar la jornada"

**Responsive:**
- Desktop: Elementos centrados verticalmente
- Mobile: Elementos en columna, botones ocupan ancho completo

#### 6.1.5 Página de Historial

**Ruta:** /historial (protegida)

**Componentes:**
- HistorialTable (tabla de jornadas)
- Paginación (futuro, no en MVP)

**Columnas de la Tabla:**
- Fecha: Formato DD/MM/YYYY
- Hora Inicio: Formato HH:MM
- Hora Fin: Formato HH:MM
- Duración: Formato HH:MM (horas y minutos)
- Estado: Badge con color según estado

**Ordenamiento:**
- Por defecto: Fecha descendente (más reciente primero)
- Futuro: Permitir ordenar por cualquier columna

**Estados:**
- Loading: Muestra skeleton de tabla
- Empty: "No hay jornadas registradas"
- Error: "Error al cargar historial"
- Success: Muestra tabla con datos

**Responsive:**
- Desktop: Tabla completa con todas las columnas
- Tablet: Tabla con columnas esenciales
- Mobile: Cards en lugar de tabla, mostrando la información de cada jornada en formato vertical

### 6.2 Interfaces de Hardware

La aplicación es completamente web y no requiere interfaces de hardware específicas. Se accede mediante navegadores web estándar en:

- Computadoras de escritorio (Windows, macOS, Linux)
- Laptops
- Tablets (iPad, Android tablets)
- Smartphones (iOS, Android)

**Requisitos mínimos del dispositivo:**
- Conexión a internet estable
- Navegador web moderno actualizado
- Resolución mínima de 320px de ancho

### 6.3 Interfaces de Software

#### 6.3.1 Supabase Database API

**Protocolo:** PostgreSQL sobre HTTPS  
**URL Base:** https://[project-id].supabase.co/rest/v1/  
**Autenticación:** Bearer token (JWT) en header Authorization  

**Operaciones soportadas:**
- SELECT (GET): Consultar registros
- INSERT (POST): Crear nuevos registros
- UPDATE (PATCH): Actualizar registros existentes
- DELETE (DELETE): Eliminar registros (deshabilitado en MVP)

**Formato de datos:**
- Request: JSON
- Response: JSON

**Headers requeridos:**
```
Authorization: Bearer <jwt_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

**Ejemplo de request:**
```javascript
// GET jornadas del usuario autenticado
fetch('https://[project-id].supabase.co/rest/v1/jornadas?user_id=eq.[user_id]&order=fecha.desc', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'apikey': supabaseAnonKey,
    'Content-Type': 'application/json'
  }
})
```

#### 6.3.2 Supabase Auth API

**Protocolo:** REST API sobre HTTPS  
**URL Base:** https://[project-id].supabase.co/auth/v1/  
**Formato:** JSON  

**Endpoints principales:**

1. Signup (POST /signup):
   - Body: { email, password }
   - Response: { user, session }

2. Login (POST /token?grant_type=password):
   - Body: { email, password }
   - Response: { access_token, refresh_token, user }

3. Logout (POST /logout):
   - Headers: Authorization Bearer token
   - Response: 204 No Content

4. Get User (GET /user):
   - Headers: Authorization Bearer token
   - Response: { user }

**Ejemplo de request:**
```javascript
// Login
fetch('https://[project-id].supabase.co/auth/v1/token?grant_type=password', {
  method: 'POST',
  headers: {
    'apikey': supabaseAnonKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

#### 6.3.3 Supabase MCP (Model Context Protocol)

**Descripción:** Protocolo de integración específico para conectar Google Antigravity IDE con Supabase.

**Configuración:**
- Instalación en Antigravity IDE
- Variables de entorno requeridas:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (solo para operaciones admin)

**Funcionalidades:**
- Conexión directa a base de datos desde el IDE
- Ejecución de queries SQL
- Gestión de tablas y schemas
- Monitoreo de datos en tiempo real

### 6.4 Interfaces de Comunicación

#### 6.4.1 Protocolo HTTP/HTTPS

Todas las comunicaciones entre frontend y Supabase utilizan:
- Protocolo: HTTPS (TLS 1.2 o superior)
- Métodos: GET, POST, PATCH, DELETE
- Formato: JSON
- Encoding: UTF-8

#### 6.4.2 REST API

El frontend consume la API REST auto-generada de Supabase siguiendo los principios REST:
- Recursos representados por URLs
- Operaciones mediante métodos HTTP estándar
- Respuestas con códigos de estado HTTP apropiados
- Stateless (sin estado entre requests)

**Códigos de estado comunes:**
- 200 OK: Operación exitosa
- 201 Created: Recurso creado exitosamente
- 400 Bad Request: Request inválido
- 401 Unauthorized: No autenticado
- 403 Forbidden: No autorizado
- 404 Not Found: Recurso no encontrado
- 500 Internal Server Error: Error del servidor

#### 6.4.3 WebSocket (Futuro - No en MVP)

Para actualizaciones en tiempo real en futuras versiones:
- Protocolo: WebSocket sobre WSS (WebSocket Secure)
- Uso: Supabase Realtime para suscripciones a cambios en tablas
- Eventos: INSERT, UPDATE, DELETE en tablas específicas

---

## 7. RESTRICCIONES DEL SISTEMA

### 7.1 Restricciones Tecnológicas

**Backend obligatorio:**
Supabase como plataforma de base de datos y autenticación. No se permite el uso de otras bases de datos (MySQL, MongoDB, Firebase) o sistemas de autenticación (Auth0, Cognito). La justificación es que Supabase proporciona una solución integrada que cumple todos los requisitos del MVP y permite desarrollo rápido.

**Frontend obligatorio:**
React o Next.js como framework principal de frontend. No se permite el uso de otros frameworks (Vue, Angular, Svelte). El desarrollo debe realizarse mediante Google Antigravity IDE, no se permite desarrollo local en otros editores durante el sprint.

**Integración obligatoria:**
Uso de Supabase MCP para la conexión con la base de datos desde Antigravity. No se permite integración manual o uso de otras herramientas de desarrollo.

**Sin almacenamiento local:**
Los datos no deben guardarse en localStorage, sessionStorage o IndexedDB del navegador. Toda persistencia de datos de negocio debe ser en Supabase. Única excepción: tokens de autenticación gestionados automáticamente por el cliente de Supabase.

**Lenguaje:**
JavaScript o TypeScript. Se recomienda TypeScript para mayor seguridad de tipos, pero JavaScript es aceptable para cumplir el deadline del MVP.

### 7.2 Restricciones de Tiempo

**Duración del Sprint:**
Exactamente 3 días calendario desde el 04/02/2026 hasta el 06/02/2026. No se permiten extensiones del sprint.

**Horario de trabajo:**
Estrictamente de 8:00 AM a 3:00 PM cada día (7 horas diarias). Total de 21 horas de trabajo en equipo.

**Tiempo total disponible:**
Aproximadamente 105 horas-persona (21 horas × 5 personas), pero debe considerarse tiempo para ceremonias Scrum, coordinación y bloqueos.

**Deadline de entrega:**
Jueves 06/02/2026 después de las 3:00 PM. Entregas tardías no son aceptadas.

**Distribución de tiempo:**
- Día 1: 40% desarrollo inicial (setup, estructura, autenticación)
- Día 2: 40% desarrollo core (jornadas, métricas, integración)
- Día 3: 20% testing, documentación, video y entrega

### 7.3 Restricciones de Recursos

**Equipo de desarrollo:**
Exactamente 5 personas con roles definidos:
- 1 Scrum Master (también Backend Developer)
- 1 Product Owner (también Frontend Developer)
- 2 Frontend Developers
- 1 Backend Developer

No se permite redistribución de roles durante el sprint. No se pueden agregar o quitar miembros del equipo.

**Herramientas limitadas:**
Google Antigravity IDE como entorno de desarrollo principal. No se permite usar Visual Studio Code, WebStorm u otros IDEs durante el sprint.

**Sin presupuesto:**
Uso exclusivo de herramientas gratuitas:
- Supabase free tier (500 MB base de datos, 50,000 usuarios activos)
- GitHub free (repositorios ilimitados, GitHub Actions limitados)
- Trello free (10 tableros, integraciones limitadas)
- Vercel/Netlify free tier para deploy (opcional)

**Limitaciones de Supabase free tier:**
- 500 MB de espacio en base de datos
- 2 GB de transferencia de datos
- 50,000 usuarios activos mensuales
- Proyectos pausados después de 1 semana de inactividad

### 7.4 Restricciones de Metodología

**Scrum obligatorio:**
Aplicación estricta del framework Scrum con todas sus ceremonias. No se permite usar Kanban, Waterfall u otras metodologías.

**Eventos obligatorios:**
- Sprint Planning (Día 1, 8:00-9:00 AM): Obligatorio para todo el equipo
- Daily Scrum 1 (Día 2, 8:00-8:15 AM): Obligatorio para todo el equipo
- Daily Scrum 2 (Día 3, 8:00-8:15 AM): Obligatorio para todo el equipo
- Sprint Review (Día 3, 1:45-2:30 PM): Obligatorio para todo el equipo
- Sprint Retrospective (Día 3, 2:30-3:00 PM): Obligatorio para todo el equipo

**Artefactos obligatorios:**
- Sprint Goal: Debe estar claramente definido y visible en Trello
- Sprint Backlog: Actualizado diariamente en Trello
- Incremento funcional: Aplicación funcionando al final del sprint

**Control de versiones:**
Uso obligatorio de GitHub con las siguientes reglas:
- Estructura de ramas: main + feature/*
- Prohibido trabajar directamente en rama main
- Mínimo de 3 Pull Requests durante el sprint
- Cada PR debe ser revisado por otro miembro antes del merge
- Commits deben tener mensajes descriptivos (feat:, fix:, docs:, etc.)

**Mínimo de PRs:**
Al menos 3 Pull Requests:
- PR 1: feature/auth (autenticación completa)
- PR 2: feature/jornadas (gestión de jornadas)
- PR 3: feature/metrics (dashboard de métricas)

**Revisión de código:**
Cada Pull Request debe:
- Ser revisado por al menos un miembro del equipo diferente al autor
- No tener merge conflicts
- Pasar validaciones básicas (sin errores de sintaxis)
- Incluir descripción clara de los cambios

### 7.5 Restricciones de Entrega

**Método de entrega único:**
Google Drive compartido a la dirección mdpixelcorp10@gmail.com. No se aceptan envíos por:
- Correo electrónico directo
- WhatsApp
- Mensajes directos
- Otras plataformas de almacenamiento (Dropbox, OneDrive)

**Estructura de entrega:**
Carpeta con nombre exacto: "Grupo X – Sprint 0 Antigravity + Supabase MVP"
(donde X es el número de grupo asignado)

**Entregables obligatorios:**

1. Repositorio GitHub:
   - Link al repositorio público
   - Código fuente completo y funcional
   - Mínimo 3 Pull Requests visibles
   - README completo con instrucciones

2. Tablero Trello:
   - Link al tablero público
   - Sprint Goal visible
   - Todas las tareas movidas durante el sprint
   - Evidencia de bloqueos resueltos

3. Video final:
   - Duración: 15 a 25 minutos (estrictamente)
   - Formato: MP4
   - Calidad: Mínimo 720p
   - Audio: Claro y audible
   - Contenido obligatorio:
     - Introducción del Scrum Master
     - Sprint Planning
     - Daily Scrums
     - Demo funcional de la app
     - Explicación individual de cada miembro
     - Bug resuelto documentado
     - Uso de Planning Mode
     - Integración Supabase MCP
     - Sprint Review
     - Cierre del Scrum Master

4. Capturas de Supabase:
   - Screenshots de tablas creadas con datos
   - Screenshot de panel de autenticación con usuarios
   - Screenshot de políticas RLS configuradas

**Definition of Done estricta:**
Una funcionalidad solo se considera completada si:
- Funciona en navegador sin errores de consola
- Está conectada a Supabase real con datos persistentes
- Cumple con los criterios de aceptación definidos por el PO
- Está integrada a la rama main mediante PR aprobado
- Está documentada en el README o en comentarios del código
- Tiene evidencia de debugging (al menos un issue resuelto documentado)

**Penalizaciones por incumplimiento:**
- Entrega tardía: No aceptada
- Falta de algún entregable: Proyecto incompleto
- Video fuera de rango de duración: No aceptado
- Menos de 3 PRs: Incumplimiento de requisitos
- Código no funcional: Proyecto no aprobado

### 7.6 Restricciones de Calidad

**Código:**
- Sin errores de sintaxis
- Sin warnings críticos en consola
- Nombres de variables y funciones descriptivos
- Comentarios en funciones complejas
- Indentación consistente

**UI/UX:**
- Interfaz debe ser usable sin capacitación
- Mensajes de error comprensibles
- Estados de loading visibles
- Responsive en al menos mobile y desktop

**Datos:**
- Todas las operaciones CRUD deben funcionar
- Los cálculos deben ser matemáticamente correctos
- No puede haber pérdida de datos
- Las políticas RLS deben estar activas

---

## 8. CRITERIOS DE ACEPTACIÓN DEL SISTEMA

### 8.1 Criterios Funcionales Generales

#### Autenticación y Seguridad

**Registro de Usuario:**
- Un usuario puede registrarse proporcionando email y contraseña válidos
- El sistema valida que el email tenga formato correcto (contiene @ y dominio)
- El sistema valida que la contraseña tenga al menos 6 caracteres
- El sistema muestra mensaje de error si el email ya está registrado
- El sistema muestra mensaje de error si las contraseñas no coinciden
- Al registrarse exitosamente, el usuario se crea en Supabase Auth
- Al registrarse exitosamente, el usuario es redirigido a la página de login
- El sistema muestra mensaje de confirmación al completar el registro

**Inicio de Sesión:**
- Un usuario registrado puede iniciar sesión con credenciales correctas
- El sistema valida el formato del email antes de enviar el request
- El sistema muestra mensaje de error si las credenciales son incorrectas
- Al iniciar sesión exitosamente, se genera y almacena un token JWT
- La sesión persiste al refrescar la página
- El usuario es redirigido al dashboard después del login exitoso
- El token de sesión se incluye automáticamente en todos los requests

**Cierre de Sesión:**
- Un usuario autenticado puede cerrar sesión desde cualquier página
- El botón de logout es claramente visible en el header
- Al cerrar sesión, el token se invalida completamente
- Al cerrar sesión, el usuario es redirigido a la página de login
- Después del logout, no se puede acceder a rutas protegidas
- Intentar acceder a rutas protegidas redirige automáticamente a login

**Protección de Rutas:**
- Las rutas /dashboard, /jornada, /historial están protegidas
- Las rutas /login y /signup son públicas
- Usuarios no autenticados que intentan acceder a rutas protegidas son redirigidos a /login
- Usuarios autenticados que intentan acceder a /login son redirigidos a /dashboard
- El token se valida en cada cambio de ruta

#### Gestión de Jornadas

**Iniciar Jornada:**
- Un usuario autenticado puede iniciar una nueva jornada
- El botón "Iniciar Jornada" solo está habilitado cuando no hay jornada activa
- Al iniciar, se registra automáticamente el timestamp exacto del momento
- Al iniciar, se guarda el user_id del usuario autenticado
- Al iniciar, el estado de la jornada se establece como "activa"
- El registro se guarda inmediatamente en Supabase
- El sistema muestra confirmación visual "Jornada iniciada correctamente"
- El botón "Iniciar" se deshabilita después de iniciar
- Los botones "Pausar" y "Finalizar" se habilitan después de iniciar
- El timer comienza a contar automáticamente
- No se puede iniciar una segunda jornada mientras hay una activa

**Pausar Jornada:**
- Un usuario con jornada activa puede pausar la jornada
- El botón "Pausar" solo está habilitado cuando hay jornada en estado "activa"
- Al pausar, se registra el timestamp exacto de la pausa
- Al pausar, se calcula el tiempo trabajado hasta ese momento
- Al pausar, el estado cambia a "pausada"
- El registro se actualiza inmediatamente en Supabase
- El sistema muestra confirmación "Jornada pausada"
- El timer se detiene visualmente
- El botón "Pausar" se deshabilita después de pausar
- Los botones "Reanudar" y "Finalizar" se habilitan

**Finalizar Jornada:**
- Un usuario con jornada activa o pausada puede finalizar la jornada
- El botón "Finalizar" está habilitado en estados "activa" y "pausada"
- Al finalizar, se registra el timestamp exacto de finalización
- Al finalizar, se calculan las horas totales trabajadas
- El cálculo excluye el tiempo de pausas
- Al finalizar, el estado cambia a "finalizada"
- El registro se actualiza inmediatamente en Supabase
- El sistema muestra resumen "Jornada finalizada. Trabajaste X horas y Y minutos"
- Todos los botones de control se deshabilitan después de finalizar
- El botón "Iniciar" se habilita para permitir nueva jornada
- Una jornada finalizada no puede modificarse posteriormente

**Cálculos de Tiempo:**
- Las horas trabajadas se calculan con precisión al minuto
- El cálculo correcto es: (hora_fin - hora_inicio) - tiempo_pausas
- El timer muestra el formato HH:MM:SS
- El timer se actualiza cada segundo
- El resumen final muestra formato legible "X horas y Y minutos"

#### Historial de Jornadas

**Visualización de Historial:**
- Un usuario autenticado puede ver su historial de jornadas
- Solo se muestran jornadas del usuario autenticado actual
- Los registros se ordenan del más reciente al más antiguo
- Cada registro muestra: fecha, hora inicio, hora fin, duración, estado
- Las fechas se muestran en formato DD/MM/YYYY
- Las horas se muestran en formato HH:MM
- La duración se muestra en formato "X horas Y minutos"
- El estado se muestra con badge de color (verde=finalizada, amarillo=pausada, etc.)
- Si no hay jornadas, se muestra mensaje "No hay jornadas registradas"

**Carga de Datos:**
- El historial carga automáticamente al abrir la página
- Mientras carga, se muestra indicador de loading (skeleton o spinner)
- Si hay error, se muestra mensaje "Error al cargar historial"
- Los datos provienen directamente de Supabase
- Los datos se actualizan si se recarga la página

#### Dashboard de Métricas Financieras

**Card de Ingresos Totales:**
- Muestra el título "Ingresos Totales"
- Muestra el valor calculado en formato S/ XX,XXX.XX
- El valor se calcula sumando todos los ingresos del período
- El cálculo es preciso con 2 decimales
- Se muestra icono representativo (flecha arriba en verde)
- Los datos provienen de tabla metricas_financieras en Supabase

**Card de Costos Totales:**
- Muestra el título "Costos Totales"
- Muestra el valor calculado en formato S/ XX,XXX.XX
- El valor se calcula sumando todos los costos del período
- El formato es consistente con la card de ingresos
- Se muestra icono representativo (flecha abajo en rojo)
- Los datos provienen de Supabase

**Card de Clientes:**
- Muestra el título "Clientes"
- Muestra cantidad de clientes nuevos
- Muestra cantidad de clientes recurrentes
- La clasificación es precisa basada en fechas de primer registro
- Se muestra icono representativo (grupo de personas)
- Los números se actualizan dinámicamente

**Card de Utilidad Neta:**
- Muestra el título "Utilidad Neta"
- Muestra valor en soles S/ XX,XXX.XX
- Muestra porcentaje XX.XX%
- El cálculo es: Ingresos - Costos
- El porcentaje es: (Utilidad / Ingresos) × 100
- Los cálculos son matemáticamente correctos
- El color del valor es verde si positivo, rojo si negativo
- Se muestra icono representativo (gráfico de tendencia)

**Gráfico de Flujo:**
- Muestra el título "Flujo de Ingresos y Egresos"
- Renderiza gráfico de líneas o barras
- El eje X muestra períodos (días/semanas)
- El eje Y muestra montos en soles
- Una línea/barra muestra ingresos (color verde)
- Otra línea/barra muestra egresos (color rojo)
- El gráfico es legible y claro
- El gráfico es responsive y se adapta al tamaño de pantalla
- Los datos corresponden a información real de Supabase

**Carga del Dashboard:**
- Al cargar, se muestran skeletons o spinners en cada card
- Las cards cargan de forma independiente (no bloquean entre sí)
- Si una card falla, las demás siguen mostrándose
- Los errores se muestran en la card afectada sin romper el layout
- Una vez cargados, los datos permanecen visibles sin parpadeos

### 8.2 Criterios No Funcionales

#### Usabilidad

**Facilidad de Uso:**
- Un usuario nuevo puede completar su primer registro de jornada en menos de 2 minutos después del signup
- Los botones principales son claramente identificables con labels descriptivos
- Los iconos son intuitivos y acompañan al texto
- El flujo de navegación es lógico y predecible
- No se requiere capacitación para usar las funciones básicas

**Mensajes y Feedback:**
- Los mensajes de error son comprensibles sin conocimiento técnico
- Ejemplo bueno: "El email ya está registrado"
- Ejemplo malo: "Error 409: Duplicate key violation"
- Todos los mensajes están en español
- Las acciones exitosas muestran confirmación visual
- Los errores se muestran en color rojo
- Los éxitos se muestran en color verde

**Accesibilidad Básica:**
- Los botones tienen tamaño mínimo de 44x44px para facilitar click/tap
- El contraste de texto sobre fondo cumple ratio mínimo 4.5:1
- Los elementos interactivos tienen estados visuales claros (hover, focus, active)
- Los inputs tienen labels asociados
- Los errores de formulario se asocian visualmente con el campo correspondiente

#### Diseño Responsive

**Adaptabilidad de Pantalla:**
- La interfaz se adapta correctamente desde 320px (móvil pequeño) hasta 1920px (desktop grande)
- No hay scroll horizontal en ninguna resolución
- Los elementos no se superponen en ninguna resolución
- Las imágenes e iconos escalan proporcionalmente

**Comportamiento por Dispositivo:**

Desktop (1024px+):
- Grid de métricas en formato 2×2 o 2×3
- Gráfico ocupa ancho completo
- Tabla de historial muestra todas las columnas
- Navbar horizontal con todos los elementos visibles

Tablet (768px - 1023px):
- Grid de métricas en formato 2×2
- Gráfico ajustado al ancho
- Tabla de historial con columnas esenciales
- Navbar puede colapsar elementos secundarios

Mobile (320px - 767px):
- Cards de métricas en columna única (una debajo de otra)
- Gráfico ocupa 100% del ancho con scroll horizontal si es necesario
- Historial en formato de cards verticales en lugar de tabla
- Navbar con menú hamburguesa
- Botones ocupan ancho completo para facilitar tap

**Puntos de Quiebre (Breakpoints):**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

#### Rendimiento

**Tiempos de Carga:**
- La carga inicial de la aplicación (primera visita) no excede 3 segundos
- La navegación entre páginas es instantánea (< 100ms con datos cacheados)
- Las operaciones de registro de jornada se completan en menos de 1 segundo
- La consulta de historial carga en menos de 2 segundos
- El dashboard completo carga en menos de 3 segundos

**Optimizaciones:**
- Las imágenes están optimizadas y comprimidas
- Los componentes se cargan de forma lazy cuando es posible
- Los requests a Supabase incluyen solo los campos necesarios
- No hay memory leaks en timers o event listeners

**Indicadores de Progreso:**
- Todas las operaciones que tardan más de 500ms muestran loading indicator
- Los botones muestran estado loading durante operaciones
- Las cards muestran skeleton mientras cargan datos

#### Disponibilidad

**Uptime:**
- El sistema tiene disponibilidad del 95% o superior durante horas laborales (8 AM - 6 PM)
- La disponibilidad depende principalmente de Supabase
- En caso de caída de Supabase, se muestra mensaje amigable al usuario

**Manejo de Errores de Red:**
- Si falla la conexión, se muestra mensaje "No hay conexión a internet"
- Si Supabase está caído, se muestra "Servicio temporalmente no disponible"
- Los errores de red no rompen la aplicación
- El usuario puede reintentar la operación manualmente

#### Seguridad

**Protección de Datos:**
- Las contraseñas se almacenan hasheadas (gestionado por Supabase Auth)
- Las contraseñas nunca se muestran en texto plano
- Las comunicaciones usan HTTPS exclusivamente
- Los tokens JWT tienen tiempo de expiración
- Los tokens se almacenan de forma segura

**Aislamiento de Datos:**
- Un usuario solo puede ver sus propias jornadas (validado por RLS)
- Un usuario solo puede ver sus propias métricas (validado por RLS)
- No se pueden modificar jornadas de otros usuarios
- Las políticas RLS están activas en todas las tablas

**Validaciones:**
- Todas las entradas del usuario se validan en frontend
- Los emails se validan con regex estándar
- Las contraseñas se validan para longitud mínima
- Los campos requeridos se validan antes de enviar
- Supabase provee validación adicional en backend

#### Mantenibilidad

**Calidad del Código:**
- El código sigue convenciones de nomenclatura consistentes (camelCase para variables, PascalCase para componentes)
- Las funciones tienen nombres descriptivos que indican su propósito
- Las funciones complejas incluyen comentarios explicativos
- El código está organizado en carpetas lógicas según funcionalidad
- No hay código duplicado innecesariamente

**Documentación:**
- El README incluye descripción clara del proyecto
- El README incluye instrucciones de instalación paso a paso
- El README incluye comandos para ejecutar el proyecto
- El README documenta las variables de entorno necesarias
- Las funciones públicas incluyen comentarios JSDoc (opcional pero recomendado)

**Organización:**
- Los componentes están organizados por funcionalidad
- Los servicios están separados de los componentes
- Las constantes están centralizadas
- Los estilos siguen una estructura consistente

#### Escalabilidad

**Capacidad de Crecimiento:**
- La arquitectura permite agregar usuarios sin cambios estructurales
- Supabase maneja automáticamente el escalado de la base de datos
- El código está estructurado para agregar funcionalidades sin refactoring mayor
- Los componentes son reutilizables para futuras features

**Límites del MVP:**
- Supabase free tier: 500 MB base de datos
- Máximo 50,000 usuarios activos mensuales
- Para superar estos límites se requiere plan de pago

#### Compatibilidad de Navegadores

**Navegadores Soportados:**
- Google Chrome versión 90 o superior
- Mozilla Firefox versión 88 o superior
- Apple Safari versión 14 o superior
- Microsoft Edge versión 90 o superior

**Funcionalidades Probadas:**
- JavaScript ES6+ (async/await, arrow functions, destructuring)
- CSS Grid y Flexbox
- Fetch API
- LocalStorage (para tokens de Supabase)

**No Soportado:**
- Internet Explorer (cualquier versión)
- Navegadores móviles muy antiguos (más de 2 años)

#### Persistencia de Datos

**Garantías de Persistencia:**
- Los datos de jornadas se guardan en Supabase inmediatamente después de cada acción (iniciar, pausar, finalizar)
- No se usa localStorage para datos de negocio
- Los datos persisten al cerrar el navegador
- Los datos persisten al refrescar la página
- Los datos persisten al cerrar sesión y volver a iniciarla

**Integridad de Datos:**
- No hay pérdida de datos durante operaciones normales
- Los timestamps se guardan con precisión al segundo
- Los cálculos de horas se guardan con precisión al minuto
- Las transacciones son atómicas (todo o nada)