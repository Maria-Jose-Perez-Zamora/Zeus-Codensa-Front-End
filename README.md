# Zeus-Codensa - Front End (TechCup Fútbol)

Repositorio principal del Front End para el sistema de gestión deportiva **TechCup Fútbol**, desarrollado para la materia de Arquitectura de Software.

El proyecto está construido como una SPA (Single Page Application) usando React 18, Vite, TypeScript y Tailwind CSS. Se integra con un backend para manejar autenticación por tokens JWT, roles de usuario (Jugador, Capitán, Organizador, Árbitro) y toda la gestión del torneo.

## Requisitos y Configuración Local

1. Clona el repositorio y entra a la carpeta:
   ```bash
   git clone <url-del-repositorio>
   cd Zeus-Codensa-Front-End
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno `.env.development` basándote en `.env.example`. Solo necesitas apuntar a tu backend local:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm start
   # (Es un alias interno para 'vite')
   ```

## Pruebas y Cobertura

Para este sprint aseguramos la cobertura de las rutas protegidas, contextos de sesión y los servicios HTTP. Usamos Vitest para las pruebas unitarias y de integración.

Para correr los tests y ver el porcentaje de cobertura:
```bash
npm run test:coverage
```
*Actualmente la cobertura total supera el 90.51%, cumpliendo con la métrica requerida del 70%.*

## Estructura del Código

La lógica principal se encuentra organizada dentro de la carpeta `src/`:

- `assets/`: Imágenes estáticas y logos.
- `components/`: Componentes base (botones, modales, rutas protegidas).
- `context/`: `AuthContext` para el manejo del estado global de la sesión.
- `pages/`: Las pantallas principales separadas por rol (dashboard, brackets, login, etc.).
- `services/`: Configuración de Axios (`http.ts`) y servicios separados por módulo para consumir el backend sin quemar URLs en las vistas.
- `tests/`: Pruebas de integración.

## Build para Producción

Para compilar el proyecto optimizado con *lazy loading* y *code splitting*, ejecuta:
```bash
npm run build
```
Esto generará la carpeta `dist/` lista para ser desplegada en cualquier servidor estático.