# Zeus-Codensa - TechCup Frontend

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest_Coverage-90%25-729B1B?style=for-the-badge&logo=vitest&logoColor=white)

Repositorio que contiene el desarrollo Frontend del proyecto Zeus-Codensa (TechCup), una plataforma web para la gestión de torneos de fútbol, administración de equipos y visualización de tablas de posiciones.

## Características Principales

*   **Autenticación y Seguridad JWT:** Interceptores Axios configurados para enviar el `Bearer Token` en cada petición. Rutas privadas protegidas según estado de sesión (`AuthContext`).
*   **Control de Acceso Basado en Roles (RBAC):** Interfaces y flujos de navegación dinámicos para Jugadores, Capitanes, Árbitros y Organizadores.
*   **Optimización de Rendimiento:** Implementación de `React.lazy` y `Suspense` para carga diferida de rutas (Code Splitting).
*   **Memoización:** Componentes de listas y llaves de torneos envueltos en `React.memo` para minimizar re-renders innecesarios.
*   **UI/UX:** Diseño responsivo basado en los prototipos, utilizando componentes accesibles con Radix UI y Tailwind CSS.

## Arquitectura del Proyecto

Estructura de directorios principal dentro de `src/`:

```text
src/
├── assets/         # Imágenes, iconos y SVG.
├── components/     # Componentes de interfaz reutilizables.
├── context/        # Estados globales de la aplicación (AuthContext).
├── pages/          # Vistas enrutadas (Login, Dashboard, Tournaments).
├── services/       # Clientes HTTP y conexión con el API Backend.
├── tests/          # Pruebas unitarias e integración.
├── App.tsx         # Configuración del enrutador y lazy loading.
└── main.tsx        # Punto de entrada principal.
```

## Configuración y Despliegue Local

### Requisitos Previos
*   Node.js (v18 o superior).

### 1. Instalación
```bash
git clone <url-del-repositorio>
cd Zeus-Codensa-Front-End
npm install
```

### 2. Variables de Entorno
Crear un archivo `.env.development` en la raíz tomando como referencia `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Ejecución en Desarrollo
```bash
npm start
# O alternativamente: npm run dev
```

### 4. Compilación para Producción
El build se generará en el directorio `dist/`:
```bash
npm run build
```

## Pruebas y Cobertura

El proyecto utiliza Vitest y React Testing Library. 

Para ejecutar las pruebas unitarias y generar el reporte de cobertura:
```bash
npm run test:coverage
```
Cobertura actual: > 90%.

## Flujos por Rol

*   **Capitanes:** Gestión de "Mi Equipo", administración de alineaciones e integración de alertas de pago de inscripción.
*   **Jugadores:** Navegación orientada a buscar equipos, gestionar invitaciones y configurar su perfil individual.
*   **Componentes Generales:** Acceso a tablas de posiciones, calendario de partidos próximos/resultados y brackets del torneo.