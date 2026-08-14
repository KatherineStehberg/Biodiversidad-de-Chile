# 07 — Playwright

## Objetivo del módulo

Este módulo introduce Playwright como segundo runner E2E, complementario a Cypress.

Se busca:
- instalar Playwright de forma controlada
- configurar Chromium como browser de pruebas
- crear un primer spec E2E para la Home
- validar la página principal con Playwright
- comparar Playwright con Cypress en sintaxis, arquitectura y casos de uso
- confirmar que Cypress no se rompe después de la instalación

---

## Instalación realizada

Se eligió instalación mínima en lugar de `npm init playwright@latest`, para evitar sobreescribir
configuraciones existentes y mantener control total sobre los archivos generados.

**Comandos ejecutados:**

```
npm install -D @playwright/test
npx playwright install chromium
```

**Se instaló:**
- `@playwright/test` — paquete npm del runner y las APIs de test
- Chromium para Playwright — binario del browser en la caché del sistema

**No se instaló:**
- Firefox
- WebKit
- configuración de GitHub Actions
- ejemplos automáticos del wizard

---

## Archivos creados o modificados

| Archivo | Cambio |
|---|---|
| `package.json` | Agrega `@playwright/test` como devDependency |
| `package-lock.json` | Registra Playwright y dependencias asociadas |
| `playwright.config.ts` | Configuración base de Playwright |
| `tests/playwright/home.spec.js` | Primer spec Playwright |
| `.gitignore` | Ignora `test-results/` y `playwright-report/` |

---

## Configuración de Playwright

**Archivo:** `playwright.config.ts`

| Opción | Valor | Descripción |
|---|---|---|
| `testDir` | `./tests/playwright` | Dónde buscar los specs de Playwright |
| `baseURL` | `http://localhost:3000` | URL base — el servidor debe estar corriendo antes de ejecutar |
| `browser` | `chromium` | Único browser instalado en esta fase |
| `headless` | `true` | El browser corre sin interfaz gráfica visible |
| `screenshot` | `only-on-failure` | Captura pantalla solo cuando un test falla |
| `video` | `off` | Sin grabación de video |
| `trace` | `retain-on-failure` | Guarda trace ZIP solo cuando hay error — útil para debugging |

El `trace` es una de las capacidades de debugging más potentes de Playwright: registra
cada acción, llamada de red y screenshot del test, y puede visualizarse con
`npx playwright show-trace`.

---

## Primer spec Playwright

**Archivo:** `tests/playwright/home.spec.js`

**Validaciones implementadas:**
- Navegar a `/` con `page.goto('/')`
- Header visible con `page.locator('header').toBeVisible()`
- Título de página no vacío con `page.title()`
- URL contiene `localhost:3000` con `page.url()`

**Equivalencias con Cypress:**

| Cypress | Playwright |
|---|---|
| `cy.visit('/')` | `page.goto('/')` |
| `cy.get('header')` | `page.locator('header')` |
| `cy.title()` | `page.title()` |
| `cy.url()` | `page.url()` |
| `.should('be.visible')` | `expect(...).toBeVisible()` |
| `.should('have.length.greaterThan', 0)` | `expect(value).toBeGreaterThan(0)` |
| `.should('include', 'texto')` | `expect(string).toContain('texto')` |

La diferencia más visible entre ambos: en Playwright, cada operación sobre el browser
requiere `await` explícito. En Cypress, el encolado interno maneja la asincronía
de forma transparente para el desarrollador.

---

## Comparación Playwright vs Cypress

| Dimensión | Cypress | Playwright |
|---|---|---|
| **Paradigma** | Comandos encadenados | `async/await` |
| **Arquitectura** | Corre muy integrado al navegador (dentro del Electron shell) | Controla browsers desde fuera vía CDP/WebSocket |
| **Navegadores** | Chromium/Electron, Firefox, Edge — sin Safari real | Chromium, Firefox, WebKit (Safari) |
| **Debugging** | Time-travel UI con snapshots interactivos | Traces capturados en archivo ZIP |
| **Paralelización** | Más limitada sin servicios externos (Cypress Cloud) | Workers integrados en la config |
| **API** | `cy.get()`, `cy.visit()`, `cy.request()` | `page.locator()`, `page.goto()`, `request()` |

---

## Resultado de validación

### Playwright

**Comando:**
```
npx playwright test
```

| Tests | Passing | Failing | Browser | Exit code |
|---|---|---|---|---|
| 3 | 3 | 0 | Chromium headless | 0 |

### Cypress — post-instalación

**Comando:**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

| Specs | Tests | Passing | Failing | Exit code |
|---|---|---|---|---|
| 5 | 12 | 12 | 0 | 0 |

La instalación de Playwright no introdujo regresiones en la suite de Cypress.

---

## Riesgos y pendientes

### Riesgos activos

- **Requiere servidor corriendo:** Playwright no levanta Next.js automáticamente.
  El servidor debe estar en `localhost:3000` antes de ejecutar `npx playwright test`.

- **Caché propia de browsers:** Playwright instala Chromium en su propia caché del sistema
  (`~/.cache/ms-playwright`), separada de la de Cypress. Ocupa espacio adicional en disco.

- **Coexistencia:** Cypress y Playwright corren de forma independiente. No comparten
  configuración, reporters ni resultados. Cada uno tiene su propio directorio de specs.

- **Artefactos:** `test-results/` y `playwright-report/` quedan fuera de Git mediante `.gitignore`.
  Sin esa entrada, aparecen como untracked después de cada ejecución.

### Pendientes para módulos posteriores

- Agregar script `playwright:test` en `package.json` para ejecución desde npm
- Evaluar cobertura con Firefox y WebKit en módulo dedicado a multi-browser testing
- Integrar Playwright a CI/CD en Módulo 10
- Comparar evidencia de Playwright y Cypress side-by-side en Módulo 12

---

## Cierre del módulo

El Módulo 7 queda cubierto con:

- Instalación controlada de `@playwright/test 1.61.1` y Chromium
- Configuración base en `playwright.config.ts`
- Primer spec E2E `tests/playwright/home.spec.js`
- Playwright: 3/3 passing — exit code 0
- Cypress sin regresiones: 12/12 passing — exit code 0
- Artefactos de Playwright excluidos del repositorio

Commit técnico: `b44f3e9 test(playwright): instalar Playwright y agregar spec inicial de homepage`
Commit de artefactos: `74c6275 chore(playwright): ignorar artefactos de ejecucion`
