# Frontend - React + TypeScript + Vite

Este es el repositorio frontend del proyecto, construido con React, TypeScript y Vite.

## Tecnologías

- **React 19.2.4** - Biblioteca de UI
- **TypeScript 6.0.2** - Tipado estático
- **Vite 8.0.4** - Build tool y dev server
- **ESLint** - Linter para calidad de código
- **Prettier** - Formateador de código

## Estructura del Proyecto

```
src/
├── assets/         # Archivos estáticos (imágenes, fuentes, etc.)
├── components/     # Componentes reutilizables de UI
├── hooks/          # Custom React hooks
├── models/         # Interfaces y tipos de TypeScript
├── pages/          # Componentes de página/vistas
├── services/       # Servicios para llamadas a API y lógica de negocio
├── App.tsx         # Componente raíz de la aplicación
├── main.tsx        # Punto de entrada de la aplicación
└── index.css       # Estilos globales
```

### Descripción de Carpetas

- **`pages/`**: Contiene los componentes de nivel página que representan las diferentes vistas de la aplicación.
- **`components/`**: Componentes reutilizables que se usan en múltiples páginas.
- **`hooks/`**: Custom hooks de React para lógica compartida.
- **`services/`**: Funciones para interactuar con APIs externas y servicios backend.
- **`models/`**: Definiciones de tipos TypeScript e interfaces.
- **`assets/`**: Recursos estáticos como imágenes, iconos, fuentes, etc.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173` con hot module replacement (HMR).

### Build

```bash
npm run build
```
Compila TypeScript y construye la aplicación para producción en la carpeta `dist/`.

### Preview

```bash
npm run preview
```
Previsualiza la build de producción localmente.

### Linting

```bash
npm run lint
```
Ejecuta ESLint para detectar problemas en el código.

```bash
npm run lint:fix
```
Ejecuta ESLint y corrige automáticamente los problemas que puede resolver.

### Formateo

```bash
npm run format
```
Formatea todo el código usando Prettier.

```bash
npm run format:check
```
Verifica si el código está formateado correctamente sin modificar archivos.

## Configuración

### ESLint

El proyecto usa ESLint con las siguientes configuraciones:
- Reglas recomendadas de JavaScript
- Reglas de TypeScript
- Reglas de React Hooks
- Integración con Prettier

Configuración en `eslint.config.js`.

### Prettier

El código se formatea automáticamente con Prettier usando las siguientes configuraciones:
- Single quotes
- Semicolons
- 2 espacios de indentación
- Line width de 80 caracteres

Configuración en `.prettierrc`.

### TypeScript

El proyecto usa TypeScript con strict mode habilitado para máxima seguridad de tipos.

Configuración en `tsconfig.json` y `tsconfig.node.json`.

## Guía de Estilo

- Usa **TypeScript** para todos los archivos nuevos (`.ts`, `.tsx`)
- Usa **arrow functions** para componentes funcionales
- Usa **named exports** para componentes
- Mantén los componentes pequeños y enfocados en una sola responsabilidad
- Escribe código autodocumentado y agrega comentarios solo cuando sea necesario
- Usa **interfaces** para props de componentes
- Coloca los tipos en la carpeta `models/` si son compartidos

## Convenciones de Nombres

- **Componentes**: PascalCase (ej. `UserProfile.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej. `useAuth.ts`)
- **Utilidades/Servicios**: camelCase (ej. `apiService.ts`)
- **Tipos/Interfaces**: PascalCase (ej. `User.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `API_BASE_URL`)

## Variables de Entorno

Todas las variables de entorno deben estar prefijadas con `VITE_` para ser accesibles en el cliente.

Ejemplo:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Recursos

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

## Solución de Problemas

### El servidor de desarrollo no inicia

1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Elimina `node_modules` y `package-lock.json`, luego reinstala: `rm -rf node_modules package-lock.json && npm install`
3. Verifica que el puerto 5173 no esté en uso

### Errores de TypeScript

1. Ejecuta `npm run build` para ver todos los errores de tipo
2. Verifica que `tsconfig.json` esté correctamente configurado
3. Asegúrate de que todos los tipos estén correctamente definidos

### Errores de ESLint

1. Ejecuta `npm run lint:fix` para corregir automáticamente los problemas
2. Si persisten errores, revisa `eslint.config.js`
3. Verifica que no haya conflictos entre ESLint y Prettier

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

Asegúrate de que el código pase los checks de linting y formateo antes de hacer commit:
```bash
npm run lint
npm run format:check
npm run build
```
