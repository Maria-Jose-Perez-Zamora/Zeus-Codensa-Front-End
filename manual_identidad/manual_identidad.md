# Manual de identidad visual y de interfaz — TECHCUP FÚTBOL (Zeus-Codensa)

Referencia para diseño y desarrollo front del torneo semestral de fútbol de la Escuela Colombiana de Ingeniería. Se usa junto al archivo de Figma y los recursos del repositorio (componentes y assets).

---

## 1. Marca y contexto

**Nombre:** TECHCUP FÚTBOL  
**Eslogan:** *Tu torneo, tu estadio, tus reglas.*

La interfaz debe transmitir orden, datos claros y sensación de competencia organizada, sin recargar la lectura en tablas, formularios ni calendarios.

**Valores que condicionan el diseño**

- Datos confiables y trazables (pagos, resultados, sanciones).
- Información disponible cuando el usuario la necesita (jugador, capitán, organizador).
- Interfaz directa: pocas capas entre la acción y el resultado.

---

## 2. Logotipo

**Imagotipo** — Uso principal en cabeceras, pantallas de arranque y documentación.

**Archivo fuente en el repositorio (uso en UI):** `src/assets/d79394430369ca833b9e37547189c2ac411875a8.png`  
**Componente de referencia:** `src/components/TechCupLogo.tsx`

![Logo.jpeg](assets/Logo.jpeg)

**Isologo horizontal** — Barras superiores, espacios con poca altura o variantes compactas.

En el front, la variante se compone con el círculo + tipografía (TECHCUP / Fútbol 7) según el espacio disponible.

**Restricciones habituales**

- No deformar proporciones ni cambiar colores del logo fuera de las variantes aprobadas.
- Mantener zona de respeto alrededor del signo; en avatares o favicons muy pequeños, usar solo el símbolo si existe versión simplificada aprobada.
- Evitar aplicar sombras fuertes o contornos que cambien la lectura del círculo; si el fondo exige separación, preferir un borde sutil o superficie detrás del logo.

**Guía técnica (implementación actual)**

- En `TechCupLogo` existen variantes pensadas para UI: `icon`, `navbar`, `navbar-full`, `hero`, `hero-dark`.
- El círculo se renderiza con `borderRadius: 50%` y `object-fit: cover` para mantener recorte y centrado.
- El acento “CUP” usa el verde lima del sistema (clases Tailwind `text-lime-*`). Si el equipo decide congelar un único valor, debe mapearse al token de acento de la sección 4.

---

## 3. Público

1. **Organizadores** — Configuración del torneo, pagos, partidos, sanciones, cuadros.
2. **Capitanes y jugadores** — Perfil, equipos, alineaciones, consulta de resultados y estadísticas.

Las decisiones de jerarquía visual (qué resaltar primero) priorizan tareas frecuentes de cada rol.

---

## 4. Paleta de color

La app trabaja en **modo claro**: fondos gris muy claro y tarjetas blancas para separar bloques (tablas, formularios, paneles). El **verde lima** concentra la mirada en lo que hay que hacer ahora (entrar, guardar, confirmar). Los textos no usan negro puro: en pantallas con muchas cifras y filas, un gris azulado fatiga menos la vista.

![Paleta.png](assets/Paleta.png)
![Paleta-2.png](assets/Paleta-2.png)
![Paleta-3.png](assets/Paleta-3.png)

Cada color está pensado para una lectura rápida. A continuación se detallan las equivalencias visuales y el código de cada color:

| Nombre | Color Visual y HEX | Uso típico | Justificación Técnica |
| --- | --- | --- | --- |
| Acento principal | ![#84CC16](https://placehold.co/15x15/84CC16/84CC16.png) `#84CC16` (Verde Lima) | Botón principal de "Pagar", "Iniciar Sesión" | Es el color de marca: asocia la plataforma al dinamismo del torneo y genera un alto contraste de atención. |
| Acento suave | ![#ECFCCB](https://placehold.co/15x15/ECFCCB/ECFCCB.png) `#ECFCCB` (Verde Pastel) | Etiquetas de "En Curso" o avisos positivos | Mitiga la fatiga visual al reducir la saturación del color principal en elementos secundarios. |
| Superficie | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` (Blanco Puro) | Tarjetas, modales, formularios | Garantiza el máximo contraste. Estructura la información en capas superpuestas, aislando tablas y formularios. |
| Fondo aplicación | ![#F8FAFC](https://placehold.co/15x15/F8FAFC/F8FAFC.png) `#F8FAFC` (Gris Nube) | Color de fondo del sistema | Proporciona una separación visual sutil contra las tarjetas de contenido blancas. |
| Borde / división | ![#E5E7EB](https://placehold.co/15x15/E5E7EB/E5E7EB.png) `#E5E7EB` (Gris Claro) | Líneas de tabla, separadores | Delimita las secciones de datos masivos sin generar ruido visual en la pantalla. |
| Texto principal | ![#111827](https://placehold.co/15x15/111827/111827.png) `#111827` (Gris Carbón) | Títulos, nombres de equipos, marcadores | Se descarta el negro puro para evitar el cansancio visual prolongado en pantallas de alta luminosidad. |
| Texto secundario | ![#6B7280](https://placehold.co/15x15/6B7280/6B7280.png) `#6B7280` (Gris Medio) | Fechas, ayudas contextuales, metadata | Establece una jerarquía de lectura clara, separando el contexto del dato operativo. |
| Error | ![#EF4444](https://placehold.co/15x15/EF4444/EF4444.png) `#EF4444` (Rojo Alerta) | Rechazo de pago, acciones bloqueadas | Alerta inmediata basada en heurísticas estándar de diseño de interfaces. |
| Advertencia | ![#F59E0B](https://placehold.co/15x15/F59E0B/F59E0B.png) `#F59E0B` (Naranja) | Amarillas disciplinarias, pagos pendientes | Diferenciación semántica para notificaciones que requieren atención pero no bloquean el flujo. |

**Botón sobre acento:** la etiqueta del CTA en `#84CC16` va en **blanco** `rgb(255, 255, 255)` o en **gris muy oscuro** si el contraste medido no alcanza AA sobre ese fondo; ajustar en Figma con el comprobador del archivo antes de congelar componentes.

**Formato en hojas de estilo:** `color: rgb(17 24 39);` (sintaxis moderna) equivale a `rgb(17, 24, 39)`; ambas son válidas siempre que los valores coincidan con la tabla.

---

## 5. Tipografía

**Familia:** [Inter](https://rsms.me/inter/) (única familia de interfaz). Elegimos esta fuente por su alta legibilidad en el despliegue de tablas de datos y dispositivos móviles.

**Ejemplo de jerarquía de lectura:**
*   **Títulos principales (Peso 700):** **Software Devs FC vs CyberSecurity United**
*   **Datos y cifras destacadas (Peso 600):** Goles: **3 - 1**
*   **Cuerpo de texto (Peso 400):** El partido se jugará en la Cancha Principal a las 4:00 PM.

| Uso | Peso visual | Aplicación Práctica |
| --- | --- | --- |
| Títulos de página y módulos | Grueso (Negrita) | Resalta identidades principales, como el nombre del equipo en el panel de capitán. |
| Datos y cifras destacadas | Medio Grueso | Optimizado para lectura rápida de métricas (Puntajes, Goles, Posiciones). |
| Cuerpo, tablas, formularios | Normal | Texto estándar y celdas de datos para evitar la saturación tipográfica. |


---

## 6. Mockups y flujo en Figma

Prototipo navegable del producto (pantallas y flujos acordados con el equipo):

**[Mockup Zeus-Codensa en Figma](https://www.figma.com/make/wZnY6r0oYU309jDTJmjvGY/Mockup-Zeus-Codensa?fullscreen=1&t=mAsayb9o3hl9iz7z-1&preview-route=%2Fauth%2Flogin)**

El flujo de entrada arranca en **login** (`/auth/login` en la vista previa del archivo).

**Módulos alineados con la documentación del repositorio**

| Módulo | Notas para UI |
| --- | --- |
| Autenticación y registro | Login, registro, recuperación si aplica; mensajes claros según tipo de correo o rol. |
| Perfil de jugador | Formularios cortos; feedback al guardar. |
| Equipos y capitanes | Invitaciones, estados de unión al equipo. |
| Inscripción y pagos | Estados: pendiente, en revisión, aprobado, rechazado; carga de comprobante. |
| Configuración del torneo | Formularios densos; confirmación en acciones destructivas. |
| Alineaciones | Selección visual; validar antes de enviar al servidor. |
| Partidos y resultados | Entrada de marcador; coherencia con reglas del torneo. |
| Tabla y llaves | Lectura prioritaria; pocos elementos competiendo con la tabla. |
| Estadísticas | Listas y rankings; vacíos cuando no hay datos. |


---

## 7. Botones e interacción

![Botones.png](assets/Botones.png)

### 7.1. Primario

- Fondo `#84CC16`, texto con contraste suficiente.
- Forma **pill** (`border-radius` alto, p. ej. valor tipo `9999px` en CSS).
- Uso: una acción principal por vista o por bloque (iniciar sesión, enviar formulario crítico, confirmar pago).

![Boton-Primario.png](assets/Boton-Primario.png)

### 7.2. Secundario

- Fondo blanco o transparente, borde discreto (`#E5E7EB` o variante en verde muy suave).
- Uso: cancelar, volver, editar sin abandonar el flujo principal.

![Boton-Secundario.png](assets/Boton-Secundario.png)

### 7.3. Estados obligatorios

| Estado | Comportamiento visual |
| --- | --- |
| Reposo | Estilo base definido arriba. |
| Hover | Ligero cambio de luminosidad o sombra; no cambiar el significado del color. |
| Focus (teclado) | Anillo o borde visible; no eliminar el outline sin sustituto accesible. |
| Disabled | Opacidad reducida y `cursor: not-allowed`; el control no debe parecer activo. |
| Cargando (tras envío a API) | Botón deshabilitado o etiqueta “Enviando…” / spinner discreto en el mismo control; evitar doble envío. |

### 7.4. Enlaces y acciones tipo chip

Enlaces de documentación o secundarios: estilo acorde a Figma; en listas de pasos, mantener alineación y tamaño táctil mínimo razonable en móvil.

---

## 8. Interfaz frente a la API (front)

Esta sección no sustituye la especificación OpenAPI/Swagger del backend; define **cómo debe comportarse la capa visual** cuando el cliente llama al servicio.

**Configuración**

- URL base del API en variable de entorno `VITE_API_BASE_URL` (ver `.env.example` en el repositorio). El código de consumo debe centralizarse en `src/services/` sin repetir URLs sueltas en componentes.

**Durante la petición**

- Botón de envío en estado cargando; formulario puede bloquearse para evitar duplicados.
- Listados: skeleton o indicador de carga acorde al patrón del módulo (Figma).

**Respuesta correcta**

- Confirmación breve (toast, banner o mensaje inline según pantalla).
- Actualizar la vista con los datos devueltos; si la lista queda vacía, mostrar estado vacío explícito, no pantalla en blanco.

**Errores**

- Mensaje para el usuario en lenguaje cotidiano (“No pudimos guardar los cambios”) y, si aplica, acción concreta (“Revisa la conexión” o “Vuelve a intentar”).
- Los detalles técnicos (código HTTP, cuerpo JSON) son para logs o modo desarrollo; no sustituir el mensaje amigable por el stack trace.
- En REST conviene que el backend devuelva errores con estructura fija (código + mensaje legible) para traducirlos a textos de pantalla sin `if` sobre frases sueltas.

**Reintentos y límites**

- Reintento manual con botón explícito; reintentos automáticos solo en casos acotados (p. ej. timeout de red) y sin bucles invisibles.

---

## 9. Formularios e inputs

- Fondo claro `#FFFFFF` / `#F8FAFC`, borde tenue en reposo.
- **Focus:** borde o sombra más marcada; selección múltiple puede usar relleno acento `#84CC16` donde Figma lo defina.

![Formulario / inputs](https://github.com/user-attachments/assets/087700ff-9936-40e4-a470-2978efd38ae1)

---

## 10. Iconografía y badges

- Iconos lineales, legibles en tamaño pequeño; activo con acento verde, inactivo en gris.
- **Badges tipo pill:** fondo `#ECFCCB`, texto en verde oscuro para estados como temporada en curso.

- **Sanciones:** amarilla `#F59E0B`, roja `#EF4444`, con fondos muy suaves si Figma los usa.

---

## 11. Implementación en código (referencia)

Hasta que las pantallas del torneo sustituyan la plantilla inicial del proyecto, los estilos del repositorio pueden no reflejar aún esta paleta. **Objetivo:** que variables CSS o tokens del tema reproduzcan la sección 4 (acento `#84CC16`, fondos y textos definidos) y la tipografía Inter cuando se construyan `pages/`, `components/` y layouts.

Ejemplo de estructura de tokens:

```css
:root {
  --color-accent: #84cc16;
  --color-accent-soft: #ecfccb;
  --color-surface: #ffffff;
  --color-bg: #f8fafc;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-danger: #ef4444;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### 11.1. Soporte técnico (Tailwind / MUI)

- **Tailwind**: cuando se use `text-lime-*`/`bg-lime-*`, se define el mapeo hacia `--color-accent` para evitar variaciones de verde entre CTAs, badges y enlaces activos.
- **MUI**: la paleta se mapea a `theme.palette.primary` (acento), `background.default/paper` (fondo/superficie) y `error/warning` (semántica). La tipografía se fija en `theme.typography.fontFamily` con Inter como primera opción.
- **Accesibilidad**: para CTAs (acento) y textos de tabla, verificar contraste AA en los tamaños definidos por Figma; ajustar tono o peso antes de “congelar” componentes base.