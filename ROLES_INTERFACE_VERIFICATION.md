# VERIFICACIÓN DE INTERFAZ POR ROL - TECHCUP FÚTBOL

## ✅ SISTEMA DE AUTENTICACIÓN IMPLEMENTADO

**Todos los usuarios DEBEN autenticarse antes de acceder a la aplicación**
- Rutas públicas: `/auth/login` y `/auth/register`
- Todas las demás rutas están protegidas por `AuthLayout`
- Sin autenticación → Redirige automáticamente a `/auth/login`

---

## 🎯 ROLES Y SUS INTERFACES

### 1️⃣ ORGANIZADOR (Organizer)

**Página principal al login:** `/organizer/dashboard`

**Navegación disponible:**
- 🎛️ Panel (OrganizerDashboard)
- 🏆 Torneos (vista general)
- 📅 Partidos (vista general)
- 🛡️ Tabla de Posiciones
- 👥 Equipos (vista general)

**Páginas específicas del rol:**
- `/organizer/dashboard` - Panel con estadísticas, torneos activos, tareas pendientes y acciones rápidas
- `/organizer/create-tournament` - Crear nuevos torneos
- `/organizer/manage-teams` - Gestionar equipos inscritos

**Funcionalidades clave:**
- Ver torneos activos y sus estadísticas
- Crear y configurar torneos
- Programar partidos
- Registrar resultados
- Aprobar pagos de inscripción
- Gestionar equipos y jugadores
- Ver tareas pendientes (pagos, programación, resultados)

---

### 2️⃣ ÁRBITRO (Referee)

**Página principal al login:** `/referee/schedule`

**Navegación disponible:**
- 📅 Mis Partidos (partidos asignados)
- 📄 Todos los Partidos (vista general)
- 🛡️ Tabla de Posiciones

**Páginas específicas del rol:**
- `/referee/schedule` - Vista de partidos asignados con tabs:
  - Próximos Partidos (detalles, fecha, hora, cancha)
  - Partidos Completados (resultados y tarjetas)

**Funcionalidades clave:**
- Ver calendario de partidos asignados
- Consultar detalles de partidos próximos
- Revisar historial de partidos arbitrados
- Ver tarjetas mostradas (amarillas/rojas)
- Agregar partidos al calendario personal

---

### 3️⃣ JUGADOR (Player)

**Página principal al login:** `/player/find-team`

**Navegación disponible:**
- 👥 Buscar Equipo (equipos que buscan jugadores)
- 👤 Mi Perfil (perfil deportivo)
- 🏆 Torneos (vista general)
- 🛡️ Tabla de Posiciones

**Páginas específicas del rol:**
- `/player/find-team` - Buscar equipos con tabs:
  - Buscar Equipos (con buscador y filtros)
  - Invitaciones (invitaciones recibidas de capitanes)
- `/player/profile-setup` - Configurar perfil deportivo

**Funcionalidades clave:**
- Crear y editar perfil deportivo (posición, disponibilidad)
- Buscar equipos que necesiten jugadores
- Ver invitaciones de capitanes
- Aceptar/rechazar invitaciones
- Solicitar unirse a equipos
- Ver información de equipos y torneos

---

### 4️⃣ CAPITÁN (Captain)

**Página principal al login:** `/dashboard`

**Navegación disponible:**
- 🎛️ Panel Principal (Dashboard del equipo)
- 👤 Perfil de Jugador
- 👥 Alineación (constructor 3D)
- 💳 Portal de Pagos
- 🏆 Torneo (brackets y calendario)

**Páginas específicas del rol:**
- `/dashboard` - Panel principal con tabla de posiciones y próximos partidos
- `/profile` - Perfil del jugador/capitán
- `/lineup` - Constructor de alineación isométrica 3D
- `/payment` - Portal para gestionar pagos del equipo
- `/brackets` - Vista de brackets del torneo
- `/captain/create-team` - Crear y configurar equipo
- `/captain/invite-players` - Invitar jugadores al equipo

**Funcionalidades clave:**
- Ver resumen del torneo y posición del equipo
- Crear y gestionar equipo
- Configurar alineación táctica (vista 3D isométrica)
- Invitar jugadores al equipo
- Gestionar pagos de inscripción
- Ver calendario de partidos
- Consultar estadísticas del equipo

---

## 🔄 FLUJOS DE REGISTRO Y LOGIN

### Al Registrarse:
- **Player** → `/player/profile-setup` (configurar perfil)
- **Captain** → `/captain/create-team` (crear equipo)
- **Organizer** → `/organizer/create-tournament` (crear torneo)
- **Referee** → `/` (página principal)

### Al Iniciar Sesión:
- **Player** → `/player/find-team`
- **Captain** → `/dashboard`
- **Organizer** → `/organizer/dashboard`
- **Referee** → `/referee/schedule`

### Al Cerrar Sesión:
- Cualquier rol → `/auth/login`

---

## 📋 PÁGINAS COMPARTIDAS (Accesibles por múltiples roles)

- `/tournaments` - Vista general de torneos
- `/matches` - Calendario de partidos
- `/standings` - Tabla de posiciones
- `/teams` - Lista de equipos participantes
- `/profile` - Perfil de usuario (Player/Captain)

---

## ✨ CARACTERÍSTICAS DEL DISEÑO

- **Fuente:** Inter
- **Bordes:** 12px (rounded-xl)
- **Color principal:** Verde lima brillante (`lime-500`)
- **Fondos:** Blanco con contraste limpio
- **Idioma:** Español
- **Responsivo:** Diseño adaptable a móvil y desktop
- **Navegación:** Diferenciada por rol con iconos específicos

---

## 🔒 SEGURIDAD

- Todas las rutas principales están protegidas por `AuthLayout`
- Sin autenticación válida, no se puede acceder a ninguna funcionalidad
- Redirección automática según rol de usuario
- Estado de autenticación persistente en contexto React
