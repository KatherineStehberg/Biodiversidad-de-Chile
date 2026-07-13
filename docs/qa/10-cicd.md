# Módulo 10 — CI/CD con GitHub Actions

## Objetivo del módulo

Automatizar la ejecución del flujo QA en GitHub Actions para que cada push sobre
`qa-automation-course` dispare un pipeline que:

- instala dependencias con `npm ci`;
- compila el proyecto con `npm run build`;
- inicia el servidor Next.js;
- espera que `http://localhost:3000` esté disponible;
- ejecuta la suite Playwright;
- ejecuta la suite Cypress;
- ejecuta la suite Cucumber BDD;
- sube artefactos de evidencia si alguna suite falla.

---

## Contexto inicial

Antes de este módulo:

- No existía ningún archivo en `.github/workflows/`.
- Las pruebas Playwright, Cypress y Cucumber pasaban localmente pero no existía
  ejecución automatizada en ningún entorno remoto.
- El proyecto tenía cobertura E2E, API, BDD y mobile web completamente
  implementada y documentada (Módulos 4–9).
- La rama `main` debía mantenerse intacta.
- Todo el trabajo del curso se realizó en `qa-automation-course`.

---

## Commits técnicos relacionados

### `56008cc` — `test(playwright): ampliar timeout de assertions a 15000ms`

Antes de crear el workflow, se detectó que `tests/playwright/home.spec.js` tenía
una aserción con el timeout por defecto de Playwright (5000ms):

```ts
await expect(page.locator('header')).toBeVisible()
```

En un ambiente CI frío — donde el servidor levanta sin datos cacheados — 5000ms
no es suficiente para que Next.js termine de renderizar. El test fallaba
intermitentemente.

Solución: agregar `expect: { timeout: 15000 }` en `playwright.config.ts`.
Esto amplía el timeout de todas las assertions de Playwright a 15 segundos,
consistente con los 20 segundos usados en las step definitions de Cucumber
y el `timeout: 60000` ya aplicado en el spec mobile.

No se modificó ningún test — solo la configuración global.

---

### `df92c50` — `ci(qa): agregar workflow GitHub Actions para pruebas automatizadas`

Creación del archivo `.github/workflows/qa.yml` con el pipeline QA completo.

---

### `788c700` — `ci(qa): usar variables mock para workflow sin Supabase`

Corrección del workflow tras el primer run fallido. Ver sección "Incidencia detectada".

---

## Workflow implementado

**Archivo:** `.github/workflows/qa.yml`

```yaml
name: QA — Playwright · Cypress · Cucumber

on:
  push:
    branches: [qa-automation-course]
  pull_request:
    branches: [qa-automation-course]

jobs:
  qa:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    env:
      NEXT_PUBLIC_USE_MOCK_DATA: "true"
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co"
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "ci-mock-anon-key"
      NEXTAUTH_SECRET: "ci-mock-nextauth-secret"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000"

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Instalar Chromium de Playwright con dependencias Linux
        run: npx playwright install chromium --with-deps

      - name: Build
        run: npm run build

      - name: Iniciar servidor Next.js
        run: npm run start &

      - name: Esperar servidor
        run: |
          for i in $(seq 1 30); do
            if curl -s http://localhost:3000 > /dev/null; then exit 0; fi
            sleep 3
          done
          exit 1

      - name: Ejecutar Playwright
        run: npx playwright test

      - name: Ejecutar Cypress
        run: npx cypress run

      - name: Ejecutar Cucumber
        run: npx cucumber-js

      - name: Subir artefactos si falla
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results/
          retention-days: 7
          if-no-files-found: ignore

      - name: Cerrar servidor
        if: always()
        run: pkill -f "next" || true
```

### Decisiones de diseño

| Decisión | Motivo |
|---|---|
| `npm run start` en lugar de `npm run dev` | El build ya se ejecutó — `start` levanta el servidor de producción precompilado. Sin compilación JIT, los tests son más estables. |
| Loop `curl` en lugar de `wait-on` | Evita instalar una dependencia nueva. El loop de 30×3s (90s máximo) es suficiente para `next start`. |
| `npm ci` en lugar de `npm install` | En CI, `npm ci` instala exactamente lo que dice `package-lock.json` — reproducibilidad garantizada. |
| `--with-deps` para Playwright | En Ubuntu (GitHub Actions runner), el sistema no tiene las librerías del sistema que Chromium necesita. El flag las instala automáticamente. |
| `pkill -f "next" \|\| true` con `always()` | Cierra el servidor aunque los tests fallen. El `|| true` evita que un error de pkill marque el job como fallido. |
| `if-no-files-found: ignore` en artefactos | Evita warnings cuando los tests pasan y no se generan screenshots ni traces. |

---

## Incidencia detectada en el primer run

### Fallo

| Campo | Valor |
|---|---|
| Commit | `df92c50` |
| Estado | ❌ failed |
| Step fallido | Build |
| Error | `Error: supabaseUrl is required.` |
| Contexto | `Failed to collect page data for /api/consultants` |

### Causa raíz

GitHub Actions no tiene acceso a `.env.local` — ese archivo no está en el repositorio
y nunca debe subirse. Las variables de entorno de Supabase no estaban disponibles.

El archivo `src/lib/supabase.ts` ejecuta `createClient()` **al nivel del módulo**,
antes de cualquier lógica condicional:

```ts
const realSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,  // undefined en CI
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export const supabase: any = USE_MOCK ? mockSupabase : realSupabase
```

Cuando `NEXT_PUBLIC_SUPABASE_URL` es `undefined`, `createClient` lanza
`supabaseUrl is required` en el momento en que Next.js importa el módulo durante el build.
Esto ocurre incluso si `NEXT_PUBLIC_USE_MOCK_DATA` es `true` — el mock se evalúa después,
pero el crash ocurre antes.

---

## Solución aplicada

### Commit `788c700` — variables mock para CI

No se configuró Supabase real. No se crearon GitHub Secrets. No se subió `.env.local`.

Se agregó un bloque `env:` en el job con variables dummy no sensibles:

```yaml
env:
  NEXT_PUBLIC_USE_MOCK_DATA: "true"
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "ci-mock-anon-key"
  NEXTAUTH_SECRET: "ci-mock-nextauth-secret"
  NEXTAUTH_URL: "http://localhost:3000"
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
```

Estas variables:

- **No son credenciales reales.** Son valores dummy que permiten que `createClient()`
  inicialice sin lanzar excepción.
- **`NEXT_PUBLIC_USE_MOCK_DATA: "true"`** activa el cliente mock en runtime — ningún
  código de la app intenta conectarse a Supabase real durante los tests.
- **El objetivo del módulo es validar el pipeline QA**, no conectar a producción.
  Cuando el proyecto tenga Supabase real configurado, estas variables se reemplazarán
  por GitHub Secrets reales.

---

## Resultado final

| Campo | Valor |
|---|---|
| Commit final | `788c700` |
| Rama | `qa-automation-course` |
| GitHub Actions | ✅ passing |
| Build | ✅ pass |
| Playwright | ✅ pass — 7/7 |
| Cypress | ✅ pass — 12/12 |
| Cucumber | ✅ pass — 1 scenario / 5 steps |
| `main` | Intacta — `c977093` |

---

## Riesgos y observaciones

| Riesgo / Observación | Descripción |
|---|---|
| **Mock en lugar de Supabase real** | Los tests pasan con datos mock. Cuando se configure Supabase real, las variables dummy deben reemplazarse por GitHub Secrets. |
| **Build salta lint y tipos** | Next.js está configurado para saltear `tsc` y `eslint` durante el build. Errores de tipos latentes no rompen el CI. |
| **`npm run start` requiere build previo** | Si el step de build falla, el servidor no puede levantarse. El orden del pipeline es obligatorio. |
| **Cypress en Ubuntu** | En el runner Linux de GitHub Actions, Cypress requiere librerías X11/GTK. La imagen `ubuntu-latest` las incluye por defecto; en imágenes mínimas podrían faltar. |
| **Playwright mobile — Chromium, no WebKit** | Los tests de iPhone 12 corren en Chromium con emulación de viewport y user agent. No reemplazan una prueba real en Safari/iOS. |
| **Workflow solo en `qa-automation-course`** | No se integró a `main`. Cuando el curso concluya y la rama sea mergeada, el workflow deberá revisarse para ejecutarse sobre `main`. |
| **Artefactos solo en fallo** | `upload-artifact` tiene `if: failure()`. Si todos los tests pasan, no se generan artefactos. Esto es intencional — se reduce el storage consumido. |

---

## Aprendizajes del módulo

### ¿Qué es CI/CD?

**CI** (Continuous Integration — Integración Continua) es la práctica de ejecutar
automáticamente un conjunto de validaciones cada vez que alguien hace push o crea
un pull request. Detecta errores antes de que lleguen a producción.

**CD** (Continuous Delivery / Deployment — Entrega o Despliegue Continuo) automatiza
el proceso de llevar código validado hasta un ambiente de staging o producción.

En este módulo se implementó CI: el pipeline valida build + tests automáticamente.
CD (despliegue automático) queda fuera del alcance del curso.

### ¿Qué es GitHub Actions?

Plataforma de CI/CD integrada en GitHub. Permite definir workflows en archivos YAML
dentro de `.github/workflows/`. Se activa por eventos del repositorio (push, pull
request, tag, etc.) y corre en máquinas virtuales administradas por GitHub (runners).

### ¿Qué es un runner?

Máquina virtual donde se ejecuta el workflow. En este caso: `ubuntu-latest` —
Ubuntu, la versión estable más reciente disponible en GitHub. El runner se crea,
ejecuta el job y se destruye — no hay estado persistente entre runs.

### ¿Qué es un workflow?

Archivo YAML en `.github/workflows/` que define cuándo correr (triggers) y qué
correr (jobs y steps). Un repositorio puede tener múltiples workflows para
propósitos distintos (QA, build, deploy, lint, etc.).

### ¿Qué es un job?

Unidad de ejecución dentro de un workflow. Corre en un runner específico. Los jobs
pueden ejecutarse en paralelo o en secuencia. En este módulo hay un solo job: `qa`.

### ¿Qué es un step?

Tarea individual dentro de un job. Puede ser un comando shell (`run:`) o una
action reutilizable de GitHub (`uses:`). Los steps se ejecutan en secuencia — si
uno falla, los siguientes se cancelan (salvo que tengan `if: always()` o `if: failure()`).

### ¿Por qué `npm ci` en lugar de `npm install`?

`npm install` puede actualizar versiones dentro del rango del `package.json`.
`npm ci` instala exactamente lo que dice `package-lock.json`, sin modificar nada.
En CI esto es crítico: garantiza reproducibilidad y detecta si el lock file está
desactualizado respecto al `package.json`.

### ¿Por qué primero se hace build?

Porque los tests E2E prueban la aplicación real, no el código fuente. El servidor
debe estar compilado antes de levantar. Además, si el build falla, no tiene sentido
correr los tests — evita falsos positivos.

Con `npm run start` (servidor de producción), Next.js sirve los archivos compilados
sin compilación JIT. Esto hace los tests más estables: el primer acceso a cualquier
ruta no desencadena una compilación.

### ¿Por qué se levanta el servidor antes de los tests E2E?

Playwright, Cypress y Cucumber son tests E2E — prueban la aplicación a través de
un browser que navega URLs reales. Si el servidor no está corriendo, todos los tests
fallan con errores de conexión. El paso "Esperar servidor" garantiza que el servidor
respondió al menos una vez antes de iniciar cualquier suite.

### ¿Por qué se usan artefactos?

En CI no hay sesión visual. Cuando un test falla, la evidencia (screenshot, trace,
video) se pierde al destruirse el runner. `upload-artifact` guarda esa evidencia
en GitHub Actions durante N días, permitiendo diagnosticar fallos sin reproducirlos
manualmente.

### ¿Por qué las variables de entorno son críticas en CI?

Los runners de CI no tienen acceso al `.env.local` local del desarrollador. Si el
código depende de variables de entorno, CI falla con errores de inicialización
(como el `supabaseUrl is required` de este módulo). La solución es proveer las
variables de entorno explícitamente en el workflow — ya sea como valores directos
(no sensibles) o como GitHub Secrets (sensibles).

---

## Criterio de cierre del módulo

El Módulo 10 se considera logrado porque:

- Existe un workflow versionado en `.github/workflows/qa.yml`.
- Se ejecuta automáticamente en cada push sobre `qa-automation-course`.
- Corre build + Playwright + Cypress + Cucumber en secuencia.
- Falló en el primer run, se diagnosticó la causa raíz y se corrigió.
- Quedó ✅ passing en GitHub Actions en el segundo run.
- `main` no fue modificada.
- Todas las ramas del flujo QA están integradas: instalación, build, espera de
  servidor, ejecución de tests, recolección de artefactos y cierre limpio.

**Commits del módulo:**

| Commit | Descripción |
|---|---|
| `56008cc` | `test(playwright): ampliar timeout de assertions a 15000ms` |
| `df92c50` | `ci(qa): agregar workflow GitHub Actions para pruebas automatizadas` |
| `788c700` | `ci(qa): usar variables mock para workflow sin Supabase` |
