# Módulo 11 — Docker / Cloud

## Objetivo del módulo

Preparar el proyecto Next.js para ejecución reproducible en contenedor y para
deployment en infraestructura cloud, usando Docker como base técnica.

El objetivo concreto fue:

- crear un `Dockerfile` multi-stage para la aplicación;
- crear un `.dockerignore` que reduzca el contexto de build;
- activar `output: 'standalone'` en `next.config.ts` para generar una imagen
  de producción optimizada;
- documentar la relación entre Docker y el deployment planificado en VPS/Coolify;
- mantener la misma estrategia mock que en CI (sin Supabase real).

---

## Contexto inicial

Antes de este módulo:

- No existía `Dockerfile` ni `docker-compose.yml` en el proyecto.
- No existía `.dockerignore`.
- No había configuración cloud específica (`vercel.json`, `render.yaml`,
  `netlify.toml`, `railway.toml`).
- El proyecto ya tenía CI/CD operativo en GitHub Actions (Módulo 10).
- Las tres suites de prueba (Playwright, Cypress, Cucumber) pasaban en CI.
- Supabase real no existe todavía — el proyecto usa modo mock.
- La rama `main` debía mantenerse intacta.
- Todo el trabajo del curso se realizó en `qa-automation-course`.

---

## Auditoría inicial Docker / Cloud

| Elemento | Estado al inicio |
|---|---|
| `Dockerfile` | No existía |
| `docker-compose.yml` | No existía |
| `.dockerignore` | No existía |
| `vercel.json` | No existe (`.gitignore` tiene `.vercel` por boilerplate de Next.js) |
| `render.yaml` | No existe |
| `netlify.toml` | No existe |
| `railway.toml` | No existe |
| `.env.local` | Existe pero no está versionado |
| Supabase real | No existe — proyecto usa mock |
| Framework | Next.js 15 — App Router |
| Puerto | 3000 (defecto Next.js) |
| Deployment planificado | VPS con Coolify |

**Hallazgo relevante — Coolify:**
El `technical_architecture_document.md` del proyecto indica que el deployment
planificado es **VPS con Coolify**. Coolify es un PaaS autohosteado que despliega
contenedores Docker. Un `Dockerfile` no solo es útil para este módulo del curso —
es directamente útil para el deployment real del proyecto.

**Hallazgo relevante — `next.config.ts`:**
No tenía `output: 'standalone'` configurado. Sin esta opción, un Dockerfile de
Next.js necesitaría copiar toda la carpeta `node_modules` a la imagen final
(~300–600 MB). Con `output: 'standalone'`, Next.js genera una carpeta
`.next/standalone/` con solo las dependencias mínimas necesarias para el servidor.

---

## Decisión técnica aprobada

Se decidió:

| Decisión | Motivo |
|---|---|
| Crear `Dockerfile` | Artefacto central del módulo; útil para Coolify |
| Crear `.dockerignore` | Evita enviar archivos innecesarios al build context |
| Agregar `output: 'standalone'` en `next.config.ts` | Reduce tamaño de imagen, es estándar para Next.js en Docker/Coolify |
| No crear `docker-compose.yml` | La app no tiene dependencias de servicios locales; no aporta valor por ahora |
| Correr tests fuera del contenedor | El contenedor ejecuta la app; los tests se corren en el host contra `http://localhost:3000` |
| Usar variables mock en Docker | No existe Supabase real — misma estrategia que en CI |

**Por qué `output: 'standalone'`:**

- Next.js genera una carpeta `.next/standalone/` que contiene solo los archivos
  necesarios para ejecutar el servidor, incluyendo una versión mínima de
  `node_modules`.
- La imagen Docker runner ya no necesita copiar `node_modules` completo — reduce
  el tamaño final de la imagen de ~600 MB a ~150 MB.
- El servidor se ejecuta con `node server.js` — sin `next start`, sin npm.
- Es la configuración estándar recomendada para Next.js en producción con
  Docker y plataformas como Coolify.

---

## Archivos técnicos creados/modificados

### Commit `8c9a1f4` — `ci(docker): agregar Dockerfile standalone para Next.js`

#### A. `next.config.ts`

**Cambio único:** agregar `output: 'standalone'` como primera propiedad del objeto
de configuración.

```ts
const nextConfig: NextConfig = {
  output: 'standalone',  // línea agregada
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ... resto sin cambios
}
```

No se modificó ESLint, TypeScript, `images`, `remotePatterns` ni ninguna otra
opción existente.

---

#### B. `.dockerignore`

Creado para excluir del build context los archivos que no necesita Docker:

```
node_modules        # se instalan dentro del contenedor con npm ci
.next               # se genera en el build del contenedor
.env
.env.*              # nunca deben entrar en una imagen
.git
.gitignore
Dockerfile
.dockerignore
README.md
coverage
test-results
playwright-report
cypress/screenshots
cypress/videos
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem
.pnp / .pnp.* / .yarn
*.tsbuildinfo
next-env.d.ts
```

**No excluidos** (necesarios para el build):
- `package.json` — dependencias del proyecto
- `package-lock.json` — instalación reproducible con `npm ci`
- `public/` — assets estáticos (imágenes, íconos, etc.)
- `src/` — código fuente de la aplicación

---

#### C. `Dockerfile`

Multi-stage build con tres etapas: `deps`, `builder` y `runner`.

```dockerfile
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_USE_MOCK_DATA=true
ENV NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-mock-anon-key
ENV NEXTAUTH_SECRET=ci-mock-nextauth-secret
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```

**Decisiones de diseño:**

| Decisión | Motivo |
|---|---|
| Node.js 22 Alpine | Consistente con el workflow CI (`node-version: '22'`); Alpine reduce el tamaño base de la imagen |
| Etapa `deps` separada | Permite que Docker reutilice la capa de dependencias si solo cambia el código fuente |
| Variables mock en `builder` | `NEXT_PUBLIC_*` se incrustan en el bundle del cliente en build time — deben estar disponibles en este momento, no en runtime |
| Usuario `nextjs` no root | Principio de mínimo privilegio — el proceso del servidor no corre como root |
| `COPY --chown=nextjs:nodejs` | El usuario no root necesita permisos de lectura sobre los archivos copiados |
| `COPY .next/standalone ./` | Copia la salida standalone, que incluye `server.js` y un `node_modules` mínimo |
| `COPY .next/static` separado | Los archivos estáticos no están incluidos en el directorio standalone — deben copiarse aparte |
| `COPY public` separado | La carpeta `public` tampoco está incluida en standalone |
| `HOSTNAME=0.0.0.0` | Sin esto, Next.js escucha solo en `localhost` y el contenedor no recibe tráfico externo |
| `CMD ["node", "server.js"]` | Ejecuta el servidor standalone sin npm ni next — más rápido y sin dependencias extra |

---

## Variables de entorno usadas en Docker

| Variable | Valor en mock | Momento en que se usa |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` | Build time + runtime — activa el cliente mock |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://example.supabase.co` | Build time — evita que `createClient()` lance error al importarse |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `ci-mock-anon-key` | Build time — misma razón |
| `NEXTAUTH_SECRET` | `local-docker-secret` | Runtime — firma de sesiones NextAuth |
| `NEXTAUTH_URL` | `http://localhost:3000` | Runtime — URL base para callbacks OAuth |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Build time + runtime |

**Importante:**

Ninguno de estos valores es una credencial real. Son valores dummy que permiten
que la aplicación compile y arranque en modo mock sin acceso a Supabase.

- El bloque `ENV` en el stage `builder` resuelve el mismo problema que el bloque
  `env:` del workflow CI (`788c700`): `src/lib/supabase.ts` llama a `createClient()`
  al nivel del módulo, antes de cualquier condición. Sin una URL válida (aunque sea
  dummy), el build falla.
- Con `NEXT_PUBLIC_USE_MOCK_DATA=true`, ningún código de la app intenta conectarse
  a Supabase real en runtime.
- Cuando el proyecto tenga Supabase real configurado, las variables del Dockerfile
  se reemplazarán por secrets reales en Coolify. Nunca se debe subir `.env.local`
  a una imagen Docker.

---

## Validación local Docker

### Estado

Docker CLI 29.1.3 estaba instalado. Docker Desktop estaba abierto. Sin embargo,
el daemon no expuso el pipe correctamente durante la sesión:

```
ERROR: error during connect:
open //./pipe/dockerDesktopLinuxEngine:
The system cannot find the file specified.
```

Contextos intentados:
- `desktop-linux` (activo): `//./pipe/dockerDesktopLinuxEngine` — no encontrado
- `default`: `//./pipe/docker_engine` — no encontrado

**Conclusión:** el fallo es del entorno Docker Desktop / WSL2, no del `Dockerfile`
ni de la configuración del proyecto. Los archivos son correctos estructuralmente.
La validación local queda pendiente.

### Comandos previstos para validar cuando Docker funcione

```bash
# Construir la imagen
docker build -t biodiversidad-chile .

# Ejecutar el contenedor en segundo plano
docker run --rm -d --name biodiversidad-chile-test -p 3000:3000 \
  -e NEXT_PUBLIC_USE_MOCK_DATA=true \
  -e NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-mock-anon-key \
  -e NEXTAUTH_SECRET=local-docker-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  biodiversidad-chile

# Verificar que responde
curl http://localhost:3000

# Ver logs del servidor
docker logs biodiversidad-chile-test --tail 20

# Detener el contenedor
docker stop biodiversidad-chile-test
```

En PowerShell, reemplazar `\` de continuación por `` ` ``.

---

## Relación con Cloud / Coolify

El proyecto no se desplegó en producción durante este módulo. La arquitectura
planificada es:

```
Código → GitHub → Coolify (VPS) → Contenedor Docker → Aplicación Next.js
```

**Cómo usaría Coolify el Dockerfile:**

1. Coolify detecta el repositorio en GitHub.
2. En cada push, clona el código y ejecuta `docker build`.
3. Sube la imagen al registro interno.
4. Reemplaza el contenedor anterior por el nuevo (zero-downtime deploy).
5. Las variables de entorno se configuran en la UI de Coolify — nunca en el código.

**Lo que falta para un deploy real en Coolify:**

| Requisito | Estado |
|---|---|
| VPS con Coolify instalado | No documentado — desconocido |
| Dominio DNS apuntando al VPS | Pendiente |
| Supabase real (URL + anon key) | No existe todavía |
| Variables de entorno en Coolify | Pendiente — requieren Supabase real |
| `Dockerfile` listo | ✅ creado en este módulo |

**Sin Supabase real:** un deploy en Coolify con las variables mock actuales
funcionaría (el sitio renderizaría), pero ninguna feature de base de datos,
autenticación ni email funcionaría. Es suficiente para demostrar el deploy,
no para producción real.

---

## Qué no se hizo y por qué

| Qué | Por qué |
|---|---|
| `docker-compose.yml` | La app no tiene dependencias de servicios locales (DB en Supabase cloud). Sin servicios que orquestar, un compose sería estructura vacía. |
| Playwright/Cypress dentro del contenedor | Metería browsers (~1GB de librerías del sistema) en la imagen. El patrón correcto es: app en contenedor, tests en el host contra `localhost:3000`. |
| Deploy real en Coolify | Falta Supabase real, dominio y configuración del VPS. |
| `docker-compose.yml` para tests | Añade complejidad sin beneficio claro en este punto del curso. |
| Modificación de tests | Los tests no dependen de Docker — siguen corriendo local y en CI como antes. |
| Modificación de `package.json` | No se requirieron scripts nuevos para Docker. |

---

## Riesgos y pendientes

| Riesgo / Pendiente | Descripción |
|---|---|
| **Validar `docker build` localmente** | Queda pendiente por problema del daemon Docker Desktop / WSL2. Cuando el daemon funcione, ejecutar los comandos de la sección "Validación local". |
| **Supabase real** | Sin Supabase real, ningún deploy es funcional en producción. Las variables dummy deben reemplazarse por secrets reales cuando exista Supabase. |
| **Variables en Coolify** | Al configurar Coolify, declarar las 6+ variables de entorno en la UI. Nunca commitear credenciales reales. |
| **`output: 'standalone'` en CI** | El workflow GitHub Actions usa `npm run build` que ahora genera `.next/standalone/`. El workflow actual no usa esa salida (solo corre tests). No hay impacto. |
| **`.env.example` ausente** | QA-004 pendiente desde la auditoría inicial. Útil para documentar qué variables son necesarias. |
| **`docker-compose.yml` futuro** | Si el proyecto agrega servicios locales (caché Redis, base de datos local para tests), entonces un compose sería el paso natural. |
| **Coolify vs buildpacks** | Coolify puede desplegar sin Dockerfile usando buildpacks automáticos. Si se elige esa ruta, el `Dockerfile` queda como referencia pero no es obligatorio. |

---

## Aprendizajes del módulo

### ¿Qué es Docker?

Una plataforma que permite empaquetar una aplicación junto con todo lo que necesita
para ejecutarse (sistema operativo mínimo, dependencias, variables de configuración)
en una unidad llamada **contenedor**. El contenedor se ejecuta igual en cualquier
máquina que tenga Docker instalado — Windows, Mac, Linux, servidor en la nube.

### ¿Qué es una imagen Docker?

El "molde" a partir del cual se crean contenedores. Una imagen es inmutable —
no cambia cuando el contenedor corre. Cuando ejecutas `docker build`, construyes
una imagen. Cuando ejecutas `docker run`, creas un contenedor a partir de esa imagen.

### ¿Qué es un contenedor?

Una instancia en ejecución de una imagen. Si la imagen es el molde, el contenedor
es el objeto fabricado con ese molde. Puedes tener múltiples contenedores corriendo
a partir de la misma imagen, cada uno con su propio estado.

### ¿Qué es un Dockerfile?

Un archivo de texto con instrucciones que le dicen a Docker cómo construir una
imagen, paso a paso. Cada instrucción (`FROM`, `COPY`, `RUN`, `ENV`, `CMD`)
agrega una capa a la imagen.

### ¿Qué es `.dockerignore`?

Un archivo que le dice a Docker qué archivos y carpetas excluir cuando envía
el directorio de trabajo al proceso de build (el "build context"). Sin
`.dockerignore`, `node_modules/` (cientos de MB) se enviaría al daemon en cada
build. Con `.dockerignore`, el build context es mínimo y el proceso es más rápido.

### ¿Qué es el build context?

El conjunto de archivos que Docker envía al daemon para construir la imagen.
Por defecto es todo el directorio donde se ejecuta `docker build`. El `.dockerignore`
reduce ese conjunto. Un build context pequeño = build más rápido.

### ¿Qué es un multi-stage build?

Una técnica de Dockerfile que usa múltiples instrucciones `FROM` en el mismo
archivo. Cada `FROM` inicia una nueva etapa. Las etapas anteriores pueden compilar
o preparar artefactos; la etapa final solo copia lo que necesita para ejecutarse.

**Ventaja principal:** la imagen final no incluye las herramientas de build (compiladores,
dependencias de desarrollo, cache de npm). Solo contiene lo mínimo necesario para
correr la aplicación.

### ¿Qué es `output: 'standalone'` en Next.js?

Una opción de `next.config.ts` que hace que `npm run build` genere una carpeta
`.next/standalone/` con todo lo necesario para ejecutar el servidor — incluyendo
una versión reducida de `node_modules`. El servidor se inicia con `node server.js`,
sin npm, sin Next.js instalado globalmente. Es el modo recomendado para Docker y
plataformas cloud como Coolify, Render o AWS ECS.

### ¿Qué es un daemon Docker?

El proceso en segundo plano que gestiona imágenes, contenedores, redes y volúmenes.
En Windows, Docker Desktop levanta este daemon. Sin el daemon corriendo, el
comando `docker` no puede hacer nada — aunque el CLI esté instalado. El error
`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
significa que el CLI no encontró el daemon.

### ¿Qué relación tiene Docker con cloud?

Las plataformas cloud modernas (AWS ECS, Google Cloud Run, Railway, Render, Coolify)
despliegan contenedores Docker. Si la aplicación está dockerizada, el mismo
`Dockerfile` que funciona localmente puede usarse para desplegarla en cualquiera
de esas plataformas. Docker es el puente entre el entorno local de desarrollo y
el entorno de producción en la nube.

### ¿Por qué Docker ayuda a resolver "en mi máquina funciona"?

Porque el contenedor incluye el sistema operativo, la versión de Node.js, las
dependencias y la configuración — todo junto. Si funciona en el contenedor en
tu máquina, funciona igual en el servidor de producción, porque ambos ejecutan
el mismo contenedor. Las diferencias de entorno dejan de ser un problema.

---

## Criterio de cierre del módulo

El Módulo 11 queda en estado **preparado / pendiente de validación local Docker** porque:

- Existe `Dockerfile` versionado con estructura multi-stage correcta para Next.js 15 standalone.
- Existe `.dockerignore` que excluye los archivos innecesarios del build context.
- `next.config.ts` tiene `output: 'standalone'` activado.
- La estrategia de variables mock queda alineada con la del workflow CI.
- El commit técnico `8c9a1f4` fue publicado en `origin/qa-automation-course`.
- `main` no fue modificada.
- Los tests (Playwright, Cypress, Cucumber) no fueron tocados y siguen operativos.
- El workflow CI/CD no fue modificado.

**Lo que queda pendiente:**

| Pendiente | Motivo |
|---|---|
| `docker build` local | El daemon Docker Desktop / WSL2 no fue accesible durante la sesión — problema de entorno, no del Dockerfile |
| Deploy real en Coolify | Requiere Supabase real, dominio y VPS con Coolify configurado |

**Commits del módulo:**

| Commit | Descripción |
|---|---|
| `8c9a1f4` | `ci(docker): agregar Dockerfile standalone para Next.js` |
