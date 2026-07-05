# 01 — Auditoría Inicial

## Objetivo
Establecer el estado real del repositorio antes de realizar cualquier modificación,
como línea base para todo el trabajo QA del curso.

## Estado inicial
Repositorio recién subido a GitHub. Un único commit inicial. Sin historial de
cambios previo documentado en git.

## Problema detectado
El proyecto no cuenta con ninguna estrategia de QA. Ver detalle completo en la
sección "Resultado obtenido".

## Decisión tomada
Realizar auditoría completa de lectura (sin modificar archivos) antes de proponer
cualquier cambio.

## Cambios realizados
Ninguno. Esta fase es exclusivamente de lectura y documentación.

## Archivos modificados
Ninguno.

## Comandos ejecutados

Los siguientes comandos fueron ejecutados durante la auditoría y su salida es
la base de este documento:

```bash
git remote -v
git branch -a
git log --oneline -5
```

La exploración de archivos se realizó con herramientas de lectura directa
(no mediante comandos de shell), cubriendo:
`package.json`, `cypress.config.ts`, `docs/supabase-schema.sql`,
`src/lib/supabase.ts`, `src/lib/db.ts`, `src/lib/auth-helper.ts`,
`src/lib/mock-data/index.ts`, `src/lib/wordpress.ts`,
y todos los archivos en `src/app/api/`.

## Resultado obtenido

### Repositorio
- **URL:** https://github.com/KatherineStehberg/Biodiversidad-de-Chile
- **Rama activa:** `main`
- **Commits:** 1 (commit inicial)
- **Remoto confirmado:** `origin → https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git`

---

### Framework y tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | ^15.5.18 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS v4 | ^4 |
| UI Components | MUI (Material UI) | ^7.1.1 |
| Backend / DB | Supabase | ^2.48.1 |
| Autenticación | NextAuth.js v4 + Supabase Adapter | ^4.24.7 |
| Email | Nodemailer | ^7.0.11 |
| Íconos | react-icons | ^5.5.0 |
| Testing E2E | Cypress | ^15.17.0 |

---

### Scripts en package.json

```json
"dev":   "next dev"
"build": "next build"
"start": "next start"
"lint":  "next lint"
```

No existen scripts de test ni de Cypress (`cypress:open`, `cypress:run`).
El funcionamiento de `npm run dev` y `npm run build` está pendiente de
verificación (ver `02-estabilizacion-del-proyecto.md`).

---

### Rutas de interfaz (25 páginas)

| Ruta | Archivo |
|---|---|
| `/` | src/app/page.tsx |
| `/landing` | src/app/landing/page.tsx |
| `/landing/privacity` | src/app/landing/privacity/page.tsx |
| `/landing/terms` | src/app/landing/terms/page.tsx |
| `/login` | src/app/login/page.tsx |
| `/registro` | src/app/registro/page.tsx |
| `/forgot-password` | src/app/forgot-password/page.tsx |
| `/reset-password` | src/app/reset-password/page.tsx |
| `/dashboard` | src/app/dashboard/page.tsx |
| `/perfil` | src/app/perfil/page.tsx |
| `/perfil/profesional` | src/app/perfil/profesional/page.tsx |
| `/perfil/seguridad` | src/app/perfil/seguridad/page.tsx |
| `/perfil/notificaciones` | src/app/perfil/notificaciones/page.tsx |
| `/consultores` | src/app/consultores/page.tsx |
| `/educacion` | src/app/educacion/page.tsx |
| `/marketplace` | src/app/marketplace/page.tsx |
| `/mis-publicaciones` | src/app/mis-publicaciones/page.tsx |
| `/campanas` | src/app/campanas/page.tsx |
| `/tecnologia` | src/app/tecnologia/page.tsx |
| `/contact` | src/app/contact/page.tsx |
| `/membresias` | src/app/membresias/page.tsx |
| `/membresias/pago/exito` | src/app/membresias/pago/exito/page.tsx |
| `/membresias/pago/fallo` | src/app/membresias/pago/fallo/page.tsx |
| `/privacy` | src/app/privacy/page.tsx |
| `/terms` | src/app/terms/page.tsx |

Archivos adicionales en `src/app/` que no son rutas navegables:
`layout.tsx`, `global-error.tsx`, `globals.css`, `favicon.ico`,
`consultores/loading.tsx`, `educacion/loading.tsx`, `marketplace/loading.tsx`.

---

### API Routes (19 endpoints, métodos por endpoint)

| Endpoint | Métodos HTTP | Fuente de datos |
|---|---|---|
| `/api/biodiversity` | GET | GBIF + NASA EONET |
| `/api/climate` | GET | global-warming.org |
| `/api/earthquakes` | GET | USGS FDSNWS |
| `/api/weather` | GET | API externa |
| `/api/consultants` | GET, POST | Supabase |
| `/api/offers` | GET, POST | Supabase |
| `/api/products` | GET, POST | Supabase |
| `/api/products/[id]` | GET, PUT, DELETE | Supabase |
| `/api/resources` | GET, POST | Supabase |
| `/api/moderation/approve` | POST | Supabase |
| `/api/moderation/reject` | POST | Supabase |
| `/api/subscriptions/create` | POST | Supabase + Flow |
| `/api/subscriptions/me` | GET | Supabase |
| `/api/subscriptions/webhook` | POST | Supabase |
| `/api/user/profile` | PUT | Supabase |
| `/api/user/avatar` | POST | Supabase Storage |
| `/api/diagnostic` | POST | n8n webhook |
| `/api/revalidate-news` | GET, POST | Next.js Cache |
| `/api/seed` | POST | Supabase |

**Nota importante:** No existe `/api/usuarios`.
El archivo `api-usuarios.cy.js` referencia ese endpoint y está roto.

---

### Base de datos (Supabase / PostgreSQL)

| Tabla | Propósito |
|---|---|
| `usuarios` | Perfil principal (roles: usuario_regular, consultor, reclutador, admin) |
| `users` | Compatibilidad con seed API |
| `consultores` | Red de consultores profesionales |
| `products` | Marketplace verde |
| `offers` | Ofertas laborales |
| `resources` | Recursos educativos |
| `subscriptions` | Membresías y pagos |

Storage buckets: `avatars` (público), `documentos` (privado).

---

### Modo Mock

Activado con `NEXT_PUBLIC_USE_MOCK_DATA=true` en `.env.local`.

El modo mock utiliza datos completamente ficticios definidos en
`src/lib/mock-data/index.ts`. Las siguientes credenciales son **exclusivas
del entorno mock y nunca deben usarse ni tratarse como credenciales reales
de producción**:

| Email (ficticio) | Contraseña (ficticia) | Tipo de usuario |
|---|---|---|
| consultor@test.cl | test123 | consultor, membresía activa |
| usuario@test.cl | test123 | usuario_regular, sin membresía |

---

### APIs externas consumidas

- GBIF (biodiversidad global)
- NASA EONET (eventos naturales)
- USGS FDSNWS (sismos)
- global-warming.org (CO2 y temperatura)
- WordPress REST API: `https://biodiversidad.cl/wp-json/wp/v2`
- n8n webhook (diagnóstico ambiental)

---

### Estado de herramientas QA al inicio

| Herramienta | Estado |
|---|---|
| Cypress | Instalado (^15.17.0), configurado parcialmente, 2 archivos de test (1 roto) |
| Playwright | No instalado |
| Postman | Sin colecciones en el repositorio |
| Supertest | No instalado |
| Cucumber / BDD | No instalado |
| Appium | No instalado |
| Jest / Vitest | No instalado |
| CI/CD | Sin `.github/workflows/` |
| Docker | Sin Dockerfile ni docker-compose.yml |

---

### Configuración de Cypress confirmada (`cypress.config.ts`)

```typescript
export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      return config
    },
  },
})
```

Existe además `cypress.config.ts.bak`, evidencia de que el archivo fue
modificado en algún momento previo a esta auditoría.

## Evidencias
- Lectura directa de: `package.json`, `cypress.config.ts`, `cypress.config.ts.bak`,
  `docs/supabase-schema.sql`, `src/lib/supabase.ts`, `src/lib/db.ts`,
  `src/lib/auth-helper.ts`, `src/lib/mock-data/index.ts`, `src/lib/wordpress.ts`,
  y todos los archivos `route.ts` en `src/app/api/`.
- Salida confirmada de `git remote -v`, `git branch -a`, `git log --oneline -5`.
- La carpeta `cypress/screenshots/` existe en el repositorio pero está vacía.

## Errores encontrados
- `api-usuarios.cy.js` intercepta `GET /api/usuarios`, endpoint que no existe.
- Los scripts de Cypress no están registrados en `package.json`.
- El estado de compilación (`npm run build`) y ejecución (`npm run dev`) no fue
  verificado en esta fase.

## Cómo se resolvieron
No se resolvieron en esta fase. Se registran para abordarlos en módulos posteriores.

## Aprendizajes
- Auditar antes de modificar evita decisiones basadas en suposiciones.
- Un proyecto puede tener dependencias de testing instaladas pero sin
  infraestructura de pruebas funcional.
- El modo mock es un activo valioso para pruebas sin Supabase real,
  siempre que sus credenciales ficticias no se confundan con datos reales.

## Pendientes
- Verificar que el proyecto corre localmente (módulo 02).
- Definir qué hacer con `api-usuarios.cy.js` (módulo 03).
- Agregar scripts de Cypress a `package.json` (módulo 03).

## Relación con el módulo del curso
Fase interna previa al Módulo 4. La auditoría es un prerequisito para
cualquier trabajo de automatización: no se pueden diseñar pruebas sin
conocer exactamente qué existe y qué falta.
