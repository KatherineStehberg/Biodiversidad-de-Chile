# 02 — Estabilización del Proyecto

## Objetivo
Verificar que el proyecto puede instalarse, ejecutarse y compilarse correctamente
antes de agregar nuevas pruebas automatizadas.

## Estado inicial
Repositorio con un único commit inicial. La auditoría previa confirmó la
estructura de Next.js 15 pero no había verificado compilación ni ejecución.

## Problema detectado
- No existe `.env.example` en el repositorio. Las variables requeridas no
  están documentadas para nuevos colaboradores.
- Advertencia implícita: `npm run build` saltó la validación de tipos TypeScript
  y la validación de ESLint (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`
  en `next.config.ts`). El build completa sin errores, pero no porque el código
  sea libre de errores de tipo — simplemente se omiten las validaciones.
- `NEXT_PUBLIC_USE_MOCK_DATA` está activado (`true`), lo que significa que la
  aplicación corre con datos ficticios. Las pruebas deben considerar este contexto.

## Decisión tomada
Documentar todos los resultados y riesgos detectados. No corregir
automáticamente ningún problema sin aprobación.

## Cambios realizados
Ninguno en código funcional. Solo este documento fue actualizado.

## Archivos modificados
- `docs/qa/02-estabilizacion-del-proyecto.md` (este archivo)

## Comandos ejecutados

```bash
node -v
npm -v
npm run dev
npm run build
git status
```

## Resultado obtenido

### Versiones del entorno

| Herramienta | Versión |
|---|---|
| Node.js | v22.21.1 |
| npm | 10.9.4 |
| Next.js | 15.5.18 |
| React | 19.0.0 |
| Cypress | 15.17.0 |

No existe campo `engines` en `package.json` — no hay versión de Node recomendada
declarada en el proyecto.

### Estado de node_modules

Existe con 444 directorios de primer nivel. No fue necesario ejecutar
`npm install`.

### Variables de entorno

| Archivo | Estado |
|---|---|
| `.env.local` | Existe |
| `.env.example` | No existe |
| `.gitignore` | Existe |

Variables definidas en `.env.local` (solo nombres, sin valores):

| Variable | Propósito |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Activa el modo mock (actualmente: `true`) |
| `NEXTAUTH_URL` | URL base para NextAuth |
| `NEXTAUTH_SECRET` | Secreto para firmar sesiones |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio |
| `ADMIN_EMAILS` | Emails de administradores |
| `SMTP_HOST` | Servidor de correo saliente |
| `SMTP_PORT` | Puerto SMTP |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Contraseña SMTP |
| `MODERATION_SECRET` | Secreto para endpoints de moderación |
| `REVALIDATE_SECRET` | Secreto para endpoint de revalidación de noticias |

Variables identificadas en código fuente pero **no presentes** en `.env.local`:

| Variable | Usada en |
|---|---|
| `N8N_DIAGNOSTIC_WEBHOOK_URL` | `src/app/api/diagnostic/route.ts` |
| `FLOW_CHECKOUT_URL` | `src/app/api/subscriptions/create/route.ts` |
| `OFFERS_ENFORCE_SMTP` | `src/app/api/offers/route.ts` |

> Estas variables ausentes no bloquean el inicio del servidor ni el build,
> ya que el código las trata con fallback o verificación condicional.

**Modo mock:** ACTIVADO (`NEXT_PUBLIC_USE_MOCK_DATA=true`).

### `npm run dev`

| Elemento | Resultado |
|---|---|
| Inicio | ✅ Correcto |
| Tiempo hasta "Ready" | 3.8 s |
| Puerto | 3000 |
| URL local | http://localhost:3000 |
| URL de red | http://192.168.8.174:3000 |
| Errores de arranque | Ninguno |
| Compilación de middleware | ✅ 410 ms (115 módulos) |
| Compilación de ruta `/` | ✅ 2.7 s (838 módulos) |

### Verificación HTTP de la página principal

| Elemento | Resultado |
|---|---|
| URL solicitada | http://localhost:3000 |
| Código HTTP | **200 OK** |
| Content-Type | text/html; charset=utf-8 |
| Tamaño de respuesta | ~183.208 chars |
| Idioma del HTML | `lang="es"` |
| Contenido inicial | DOCTYPE HTML con assets de la app (LogotipoBlanco.png) |

La ruta `/` respondió correctamente con HTML de la aplicación.

### `npm run build`

| Elemento | Resultado |
|---|---|
| Exit code | **0 (éxito)** |
| Duración total | ~59 s |
| Compilación TypeScript | Omitida (`ignoreBuildErrors: true` en next.config.ts) |
| Validación ESLint | Omitida (`ignoreDuringBuilds: true` en next.config.ts) |
| Páginas estáticas generadas | 47 de 47 ✅ |
| Errores de build | Ninguno reportado |
| Advertencias de build | Ninguna reportada |

**Rutas compiladas:**

| Tipo | Cantidad | Descripción |
|---|---|---|
| `○` Static | 26 | Prerrenderizadas como HTML estático |
| `ƒ` Dynamic | 21 | Server-rendered on demand (APIs + marketplace) |

**Tamaños relevantes:**

| Elemento | Tamaño |
|---|---|
| First Load JS compartido | 102 kB |
| Middleware | 34.4 kB |
| Ruta más pesada (`/consultores`) | 8.79 kB + 174 kB First Load |

### `git status`

- Rama `main` sincronizada con `origin/main`.
- Sin archivos modificados.
- `docs/qa/` aparece como directorio sin rastrear (sin commit aún).

## Evidencias
- Salida completa de `npm run dev`: servidor listo en 3.8 s, sin errores.
- Respuesta HTTP 200 confirmada en `http://localhost:3000`.
- Log de compilación de ruta `/`: `GET / 200 in 4242ms` (primera compilación
  incluye tiempo de JIT de Next.js).
- Salida completa de `npm run build`: exit code 0, 47 páginas generadas, 59 s.

## Errores encontrados
Ningún error que bloquee la ejecución o el build.

## Advertencias y riesgos detectados

| # | Riesgo | Severidad | Impacto en QA |
|---|---|---|---|
| 1 | TypeScript desactivado en build (`ignoreBuildErrors: true`) | Media | Los tests pasarán aunque haya errores de tipo en el código |
| 2 | ESLint desactivado en build (`ignoreDuringBuilds: true`) | Baja | Problemas de calidad de código no se detectan en CI |
| 3 | `.env.example` no existe | Baja | Cualquier colaborador nuevo no sabe qué variables configurar |
| 4 | 3 variables de entorno ausentes en `.env.local` | Baja | No bloquean, pero los endpoints que las usan devolverán error 500 si se invocan |
| 5 | Modo mock activado | Informativo | Las pruebas corren con datos ficticios — no validan la integración real con Supabase |
| 6 | Primera compilación de ruta lenta (4.2 s) | Informativo | Cypress puede necesitar un `cy.visit()` con timeout generoso |

## Cómo se resolvieron
Los riesgos 1 al 6 no se corrigieron en esta fase. Se documentan para
decisión y aprobación antes de proceder.

## Aprendizajes
- El proyecto compila y corre sin ninguna intervención adicional.
  El `node_modules` estaba presente y no requirió reinstalación.
- El modo mock permite ejecutar Cypress sin credenciales reales de Supabase,
  lo cual es una ventaja para el entorno de pruebas del curso.
- La omisión de TypeScript y ESLint en el build implica que el pipeline de CI
  debería agregar estos pasos de forma explícita cuando se configure (módulo 09).
- El tiempo de primera compilación de ruta (~4 s) debe considerarse al
  configurar timeouts en Cypress.

## Pendientes

### Requieren aprobación antes de implementar
- Crear `.env.example` con los nombres de variables documentados (sin valores).
- Evaluar habilitar TypeScript en build o agregar `tsc --noEmit` como paso
  separado en el pipeline CI/CD.
- Agregar scripts `cypress:open` y `cypress:run` a `package.json` (módulo 03).

### No requieren cambios de código
- Configurar timeout apropiado en Cypress para la primera carga de página.

## Relación con el módulo del curso
Fase interna previa al Módulo 4. Confirma que el entorno de desarrollo está
operativo y que las pruebas pueden ejecutarse sobre una aplicación que
levanta correctamente.
