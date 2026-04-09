# Frontend - React + TypeScript + Vite

Base frontend del proyecto.

## Tecnologias

- React
- TypeScript
- Vite
- ESLint
- Prettier

## Estructura

```txt
src/
├── assets/
├── components/
├── hooks/
├── models/
├── pages/
├── services/
├── utils/
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

### Carpetas base

- `src/pages/`: vistas/paginas de la aplicacion.
- `src/components/`: componentes reutilizables.
- `src/hooks/`: hooks personalizados.
- `src/services/`: capa de servicios/API.
- `src/models/`: tipos e interfaces compartidas.
- `src/assets/`: recursos estaticos.
- `src/utils/`: funciones auxiliares y utilidades.

## Tabla de mapeo funcionalidad -> ruta -> componentes

- `docs/tabla-mapeo-funcional.md`

## Variables de entorno

Archivo de ejemplo incluido:

- `.env.example`

Variable requerida:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Requisitos

- Node.js 18+
- npm 9+

## Instalacion

```bash
npm install
```

## Comandos principales

```bash
npm run dev
```

Levanta el proyecto en desarrollo (Vite).

```bash
npm run build
```

Compila TypeScript y genera build de produccion.

```bash
npm run lint
```

Ejecuta ESLint para detectar errores de calidad.

```bash
npm run lint:fix
```

Ejecuta ESLint con autocorrecciones.

```bash
npm run format
```

Formatea archivos con Prettier.

```bash
npm run format:check
```

Verifica formato sin modificar archivos.

## Configuracion

- ESLint: `eslint.config.js`
- Prettier: `.prettierrc`
