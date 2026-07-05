# Next.js — Biblioteca de Referencia

## ¿Qué es Next.js?
Next.js es un framework web construido sobre React que permite crear
aplicaciones con renderizado en el servidor, páginas estáticas y
API Routes propias en un mismo proyecto.

**Versión en este proyecto:** 15.5.18 (App Router)

---

## App Router
Sistema de enrutamiento de Next.js 13+. Cada carpeta dentro de `src/app/`
que contenga un archivo `page.tsx` se convierte automáticamente en una
ruta navegable.

Ejemplo:
```
src/app/consultores/page.tsx  →  http://localhost:3000/consultores
```

---

## API Routes
Funciones del servidor definidas dentro de `src/app/api/`.
Cada archivo `route.ts` define los métodos HTTP disponibles para esa ruta.

Ejemplo:
```
src/app/api/products/route.ts  →  GET /api/products, POST /api/products
```

Este proyecto tiene **19 endpoints** documentados en `docs/qa/01-auditoria-inicial.md`.

---

## Tipos de rutas en el build

| Símbolo | Tipo | Significado |
|---|---|---|
| `○` | Static | Página prerenderizada como HTML estático |
| `ƒ` | Dynamic | Página renderizada en el servidor bajo demanda |

---

## Archivos especiales de Next.js

| Archivo | Propósito |
|---|---|
| `layout.tsx` | Estructura compartida por todas las páginas de una sección |
| `page.tsx` | Contenido de una ruta específica |
| `loading.tsx` | Estado de carga mientras se renderiza una página |
| `global-error.tsx` | Página de error global |
| `middleware.ts` | Código que se ejecuta antes de cada solicitud |
| `next.config.ts` | Configuración del framework |

---

## Middleware en este proyecto
`src/middleware.ts` aplica headers de seguridad HTTP a todas las rutas:
- `X-Frame-Options`: previene clickjacking
- `X-Content-Type-Options`: previene MIME sniffing
- `X-XSS-Protection`: protección básica contra XSS
- `Content-Security-Policy`: controla qué recursos puede cargar la página

---

## Variables de entorno en Next.js

| Prefijo | Visibilidad |
|---|---|
| `NEXT_PUBLIC_` | Visible en el navegador y en el servidor |
| Sin prefijo | Solo visible en el servidor |

**Importante:** las variables sin prefijo `NEXT_PUBLIC_` nunca llegan al
navegador, lo que las hace más seguras para claves privadas.

---

## Comandos relevantes

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Compilación optimizada para producción |
| `npm run start` | Servidor de producción (requiere build previo) |
| `npm run lint` | Validación de código con ESLint |
