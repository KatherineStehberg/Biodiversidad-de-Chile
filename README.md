# Biodiversidad de Chile 🍃

Plataforma web para la gestión y visualización de información relacionada con biodiversidad, con portal de consultores y servicios asociados.

## Estado del proyecto

El repositorio está preparado como aplicación **Next.js con despliegue Docker/Coolify**. Antes de cada redeploy de producción se debe validar el build y las variables de entorno del entorno de destino.

Portal:
- https://consultores.biodiversidad.cl/

## Stack tecnológico

### Core
- Node.js 22
- Next.js 15 (`^15.5.18` según `package.json`)
- React 19
- TypeScript 5

### UI
- Tailwind CSS 4
- Material UI (MUI)
- Emotion

### Backend y servicios
- Supabase (PostgreSQL, Auth y Storage)
- NextAuth
- Nodemailer

### Calidad y pruebas
- ESLint
- TypeScript (`tsc --noEmit`)
- Playwright
- Cypress
- Cucumber
- Docker

## Instalación local

### Requisitos

- Node.js 22 recomendado
- npm
- Variables de entorno correspondientes al entorno local

### Clonar e instalar

```bash
git clone https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git
cd Biodiversidad-de-Chile
npm ci
```

### Desarrollo

```bash
npm run dev
```

Luego abre:

```text
http://localhost:3000
```

## Comandos principales

```bash
npm run dev              # servidor de desarrollo
npm run build            # build de producción
npm run start            # iniciar build de producción
npm run lint             # ESLint
npm run typecheck        # validación TypeScript
npm run test:playwright  # pruebas Playwright
npm run test:cypress     # pruebas Cypress
npm run test:cucumber    # pruebas Cucumber
```

## Variables de entorno

La aplicación utiliza Supabase y servicios de autenticación/correo. Las credenciales reales **no deben almacenarse en Git**.

Las variables `NEXT_PUBLIC_*` utilizadas por Next.js pueden quedar incorporadas al bundle durante `npm run build`. Por este motivo, para producción deben estar correctamente definidas **antes del build** en Coolify o en el mecanismo de construcción utilizado.

Variables utilizadas por el proyecto pueden incluir, según el entorno:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_USE_MOCK_DATA
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SITE_URL
```

Además deben configurarse las variables privadas necesarias para autenticación, correo u otros servicios habilitados en producción.

> Producción no debe ejecutarse con `NEXT_PUBLIC_USE_MOCK_DATA=true` ni con URLs o claves ficticias de Supabase.

## Base de datos

El proyecto utiliza **Supabase** para persistencia de datos y funcionalidades backend, incluyendo PostgreSQL, autenticación y almacenamiento cuando corresponda.

Las variables del proyecto Supabase deben configurarse en el entorno de ejecución/despliegue y no hardcodearse en el repositorio.

## Docker

El proyecto utiliza salida standalone de Next.js (`output: 'standalone'`) para generar una imagen de producción más pequeña.

Flujo esperado:

```text
npm ci → npm run build → imagen Docker → Coolify → health check
```

El contenedor expone el puerto `3000` y ejecuta la aplicación con Node.js.

## Despliegue en Coolify

El despliegue productivo se realiza en un VPS mediante Coolify.

Antes de un redeploy:

1. Confirmar que la rama a desplegar sea `main`.
2. Revisar las variables de entorno de producción en Coolify.
3. Confirmar que no se estén utilizando datos mock.
4. Ejecutar o validar `npm run typecheck`.
5. Ejecutar o validar `npm run lint`.
6. Ejecutar o validar `npm run build`.
7. Construir/desplegar la imagen Docker.
8. Comprobar el health endpoint y las rutas principales después del deploy.
9. Verificar conexión real con Supabase, autenticación y funciones críticas.

## Nota de producción

El `Dockerfile` actual contiene valores mock utilizados para permitir builds reproducibles sin credenciales reales. **Estos valores no deben considerarse configuración de producción.** Debido a que las variables públicas de Next.js pueden resolverse durante el build, el pipeline de Coolify debe suministrar las variables reales en la etapa de construcción o el Dockerfile debe ajustarse antes del redeploy definitivo.

## Seguridad

- No versionar `.env` con credenciales reales.
- No exponer claves privadas o `service_role` de Supabase al navegador.
- Mantener secretos únicamente en Coolify/entorno seguro.
- Revisar autenticación, permisos y acceso a datos después de cada cambio relevante.

## Repositorio

Repositorio de producción:

```text
KatherineStehberg/Biodiversidad-de-Chile
```

Rama principal:

```text
main
```
