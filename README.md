# Biodiversidad de Chile 🍃

Plataforma web para la gestión y visualización de información relacionada con biodiversidad, con portal de consultores y servicios asociados.

## Estado del proyecto

El repositorio corresponde a la aplicación **Next.js** de Biodiversidad de Chile. El despliegue de producción **no utiliza Docker**.

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

Las variables `NEXT_PUBLIC_*` utilizadas por Next.js pueden quedar incorporadas al bundle durante `npm run build`, por lo que las variables reales de producción deben estar configuradas en el entorno **antes de ejecutar el build**.

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

## Despliegue de producción

El despliegue oficial **no usa Docker**. La aplicación debe desplegarse como proyecto Node.js/Next.js utilizando la rama `main`.

Flujo esperado:

```text
git pull origin main
npm ci
npm run typecheck
npm run lint
npm run build
npm run start
```

Antes de un redeploy:

1. Confirmar que la rama a desplegar sea `main`.
2. Configurar las variables de entorno reales de producción en el servidor o plataforma de despliegue.
3. Confirmar que `NEXT_PUBLIC_USE_MOCK_DATA` no esté habilitado en producción.
4. Ejecutar `npm ci`.
5. Validar `npm run typecheck`.
6. Validar `npm run lint`.
7. Ejecutar `npm run build`.
8. Iniciar la aplicación con `npm run start` o mediante el process manager configurado en el servidor.
9. Verificar las rutas principales, conexión real con Supabase, autenticación y funciones críticas después del deploy.

## Seguridad

- No versionar `.env` con credenciales reales.
- No exponer claves privadas o `service_role` de Supabase al navegador.
- Mantener secretos únicamente en el entorno seguro del servidor o plataforma de despliegue.
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
