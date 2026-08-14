# Módulo 2 — Git y Entornos

## Objetivo
Documentar el estado del repositorio Git y la configuración de entornos del
proyecto Biodiversidad de Chile, como base para el trabajo de automatización
de pruebas del curso.

## Estado inicial
El proyecto tiene un repositorio Git con un único commit inicial subido a
GitHub en la rama `main`. La gestión de entornos se basa en variables de
entorno en `.env.local` con soporte explícito para modo mock.

## Problema detectado
- El repositorio tiene un único commit. No existe historial de ramas de
  features, releases ni hotfixes.
- No existe rama dedicada para pruebas (`test`, `qa`, `develop`).
- El archivo `.env.local` no está versionado (correcto por seguridad), pero
  tampoco existe un `.env.example` documentando las variables requeridas.
- No hay convención de commits establecida.

## Decisión tomada
Documentar el estado actual como línea base y proponer prácticas de Git
para el trabajo QA, sin modificar el repositorio hasta tener aprobación.

## Cambios realizados
Ninguno en esta fase. Módulo de análisis y documentación.

## Archivos modificados
Ninguno.

## Comandos ejecutados

Los siguientes comandos fueron ejecutados durante la auditoría del repositorio:

```bash
git remote -v
git branch -a
git log --oneline -5
```

Salida confirmada:
```
origin  https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git (fetch)
origin  https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git (push)
* main
  remotes/origin/main
c977093 Initial commit: proyecto Biodiversidad de Chile
```

## Resultado obtenido

### Estado del repositorio

| Elemento | Estado |
|---|---|
| Rama activa | `main` |
| Ramas remotas | `origin/main` |
| Ramas adicionales | Ninguna |
| Commits | 1 (commit inicial) |
| Remoto | https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git |
| `.gitignore` | Presente y correcto — excluye `node_modules`, `.env*`, `.next/` |

### Variables de entorno identificadas

El archivo `.env.local` existe localmente pero no está versionado.
A partir del código fuente se identifican las siguientes variables:

| Variable | Uso | Requerida para |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Modo real |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública Supabase | Modo real |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` activa el modo mock | Modo mock |
| `NEXTAUTH_SECRET` | Firmado de sesiones NextAuth | Autenticación |
| `NEXTAUTH_URL` | URL base de la aplicación | Autenticación |
| `N8N_DIAGNOSTIC_WEBHOOK_URL` | Webhook n8n para diagnóstico | API diagnóstico |
| `REVALIDATE_SECRET` | Protege el endpoint de revalidación | API noticias |
| `FLOW_CHECKOUT_URL` | URL del portal de pago Flow | Suscripciones |
| `OFFERS_ENFORCE_SMTP` | Habilita validación SMTP en ofertas | API ofertas |
| Variables SMTP | Configuración de Nodemailer | Email |

### Entornos del proyecto

| Entorno | Descripción | Activación |
|---|---|---|
| Mock local | Sin Supabase real, datos ficticios | `NEXT_PUBLIC_USE_MOCK_DATA=true` |
| Desarrollo real | Conectado a Supabase real | Variables Supabase configuradas |
| Producción | Deployment externo (no documentado aún) | — |

### Configuración de `.gitignore` relevante para QA

```
node_modules/     ← excluido correctamente
.env*             ← variables de entorno nunca versionadas
.next/            ← build de Next.js excluido
*.tsbuildinfo     ← artefactos de compilación excluidos
```

> Nota: `cypress/screenshots/` no está en `.gitignore`, por lo que los
> screenshots generados localmente podrían versionarse. Sin embargo, la
> carpeta aparece vacía en el commit inicial.

## Evidencias
- Salida de `git remote -v`, `git branch -a`, `git log --oneline -5`
  confirmada durante la auditoría.
- Lectura de `.gitignore` y análisis del código fuente para identificar
  variables de entorno.

## Errores encontrados
- No existe `.env.example` en el repositorio. Cualquier desarrollador nuevo
  que clone el proyecto no sabrá qué variables configurar.
- No hay convención de mensajes de commit documentada.

## Cómo se resolvieron
No se resolvieron en esta fase. Se registran como pendientes.

## Aprendizajes
- El `.gitignore` está correctamente configurado para no versionar secretos.
- La separación entre modo mock y modo real es una buena práctica para testing:
  permite correr pruebas sin depender de infraestructura externa.
- Un repositorio con un único commit no tiene historial que pueda romperse,
  lo que simplifica el inicio del trabajo QA.

## Pendientes
- Crear `.env.example` con las variables requeridas (sin valores reales)
  para documentar el entorno, previa aprobación.
- Definir estrategia de ramas para el trabajo QA:
  propuesta: rama `qa` o `feature/qa-module-XX` por módulo.
- Establecer convención de commits (p. ej. Conventional Commits).

## Relación con el módulo del curso
**Módulo 2 del curso.** Git y entornos — gestión del repositorio, ramas,
variables de entorno, separación entre entornos de desarrollo / prueba /
producción y buenas prácticas de versionado en proyectos con pruebas
automatizadas.
