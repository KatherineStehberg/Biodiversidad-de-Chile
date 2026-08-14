# 08 — Cucumber BDD

## Objetivo del módulo

Este módulo introduce BDD (Behavior-Driven Development) como forma de escribir pruebas
desde el comportamiento esperado del sistema, usando lenguaje Gherkin y la herramienta
Cucumber.

Se busca:

- entender qué es BDD y cómo se diferencia del testing técnico tradicional
- entender la sintaxis Gherkin (Feature, Scenario, Given, When, Then, And)
- escribir un archivo `.feature` con un escenario real
- crear step definitions que conecten Gherkin con código de automatización
- integrar Cucumber con Playwright para ejecutar pasos BDD en browser real
- ejecutar un escenario E2E completo desde la línea de comandos
- confirmar que Playwright y Cypress siguen funcionando sin regresiones

---

## Instalación realizada

Se eligió **Cucumber con Playwright** usando `@cucumber/cucumber` como runner BDD.

Esta decisión implicó:

- No usar `@badeball/cypress-cucumber-preprocessor` (requeriría modificar `cypress.config.ts`
  y agregar un preprocesador al pipeline de Cypress).
- No modificar `cypress.config.ts`.
- Cypress quedó completamente intacto — sus specs, configuración y resultados no fueron tocados.

**Comando usado:**

```bash
npm install -D @cucumber/cucumber
```

Versión instalada: `@cucumber/cucumber 13.0.0`

**Script agregado en `package.json`:**

```json
"scripts": {
  "cucumber": "cucumber-js"
}
```

Permite ejecutar Cucumber con:

```bash
npx cucumber-js
# o bien
npm run cucumber
```

---

## Archivos creados o modificados

| Archivo | Tipo | Descripción |
|---|---|---|
| `package.json` | Modificado | Agrega `@cucumber/cucumber` en devDependencies y script `cucumber` |
| `package-lock.json` | Modificado | Registra Cucumber y sus dependencias asociadas (~975 líneas nuevas) |
| `cucumber.json` | Nuevo | Configuración del runner Cucumber |
| `features/home.feature` | Nuevo | Escenario BDD en Gherkin para la página principal |
| `features/step-definitions/home.steps.js` | Nuevo | Implementación de pasos usando Playwright |

---

## Configuración de Cucumber

**Archivo:** `cucumber.json`

```json
{
  "default": {
    "paths": ["features/**/*.feature"],
    "require": ["features/step-definitions/**/*.js"],
    "publish": false
  }
}
```

| Clave | Propósito |
|---|---|
| `paths` | Indica a Cucumber dónde buscar archivos `.feature`. Usa glob para incluir todos los subdirectorios de `features/`. |
| `require` | Indica a Cucumber dónde están las step definitions. Cucumber las carga antes de ejecutar los escenarios. |
| `publish: false` | Desactiva el envío de resultados al servicio público de Cucumber Reports. Sin esta opción, Cucumber muestra un aviso en cada ejecución sugiriendo publicar los resultados. |

---

## Feature creado

**Archivo:** `features/home.feature`

```gherkin
Feature: Página principal

  Scenario: Cargar la página principal
    Given el usuario abre la página principal
    Then debe ver el encabezado principal
    And el título de la página no debe estar vacío
```

| Keyword | Función |
|---|---|
| `Feature` | Agrupa una funcionalidad completa. Puede contener múltiples Scenarios. |
| `Scenario` | Define un caso de prueba concreto con un objetivo específico. |
| `Given` | Establece el contexto inicial — la condición de partida del escenario. |
| `Then` | Valida un resultado esperado — qué debe ser verdadero después de la acción. |
| `And` | Continúa una validación del mismo tipo que el keyword anterior (en este caso, otro `Then`). |

---

## Step definitions

**Archivo:** `features/step-definitions/home.steps.js`

```js
const { Given, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber')
const { chromium, expect } = require('@playwright/test')

setDefaultTimeout(60 * 1000)

let browser
let context
let page

Before(async function () {
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    baseURL: 'http://localhost:3000'
  })
  page = await context.newPage()
})

After(async function () {
  await context.close()
  await browser.close()
})

Given('el usuario abre la página principal', async function () {
  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 })
})

Then('debe ver el encabezado principal', async function () {
  await page.locator('header').waitFor({ state: 'visible', timeout: 20000 })
})

Then('el título de la página no debe estar vacío', async function () {
  const title = await page.title()
  expect(title.length).toBeGreaterThan(0)
})
```

| Elemento | Propósito |
|---|---|
| `@cucumber/cucumber` | Aporta `Given`, `Then`, `Before`, `After` y `setDefaultTimeout` |
| `@playwright/test` | Aporta `chromium` para lanzar el browser y `expect` para assertions |
| `setDefaultTimeout(60 * 1000)` | Extiende el timeout máximo por paso a 60 segundos. Necesario por la compilación JIT de Next.js en frío. |
| `Before` | Se ejecuta antes de cada escenario. Abre el browser, crea un contexto y una página. |
| `After` | Se ejecuta después de cada escenario. Cierra el contexto y el browser para liberar recursos. |
| `browser.newContext()` | Crea un contexto de navegación aislado con viewport definido. Equivalente a una sesión del browser limpia. |
| `page.goto()` | Navega a la URL especificada y espera hasta que el evento `load` se complete. |
| `page.locator('header')` | Referencia al elemento `<header>` del DOM. No interactúa con él hasta que se llama a `.waitFor()`. |
| `waitFor({ state: 'visible' })` | Espera hasta que el elemento sea visible en pantalla. Alternativa a `expect(locator).toBeVisible()` fuera del test runner de Playwright. |
| `expect(title.length).toBeGreaterThan(0)` | Valida que el título de la página no sea una cadena vacía. |

---

## Conceptos aprendidos

### BDD
Behavior-Driven Development. Enfoque de desarrollo que describe el comportamiento esperado del
sistema con lenguaje entendible tanto por perfiles de negocio como por perfiles técnicos.
Los escenarios BDD pueden servir como especificación funcional y como prueba automatizada al mismo tiempo.

### Gherkin
Sintaxis estructurada usada para escribir escenarios BDD. Sus keywords principales son:
`Feature`, `Scenario`, `Given`, `When`, `Then` y `And`.

### Feature
Funcionalidad o grupo de comportamientos que se quieren describir y probar.
Un archivo `.feature` contiene uno o más `Scenario`.

### Scenario
Caso concreto dentro de una `Feature`. Define un comportamiento específico desde el contexto
inicial hasta el resultado esperado.

### Given
Contexto inicial del escenario. Describe el estado del sistema antes de que ocurra la acción.

### When
Acción del usuario o del sistema. Describe qué sucede para provocar el resultado esperado.
No se usó en este módulo — el `Given` ya incluye la navegación.

### Then
Resultado esperado. Describe qué debe ser verdadero después de la acción.

### And
Continuación lógica de `Given`, `When` o `Then`. Se comporta exactamente igual que el
keyword que continúa.

### Step Definition
Código que conecta una frase Gherkin con una acción automatizada. Cuando Cucumber encuentra
`Given el usuario abre la página principal`, busca en las step definitions la función registrada
con esa frase exacta y la ejecuta.

### Documentación viva
Los archivos `.feature` son a la vez documentación del comportamiento del sistema y pruebas
ejecutables. Pueden ser leídos por personas sin conocimiento técnico y ejecutados por
Cucumber sin modificaciones.

---

## Comparación: test técnico vs escenario BDD

| Dimensión | Test técnico (Cypress/Playwright) | Escenario BDD (Gherkin) |
|---|---|---|
| Sintaxis | `cy.get('header').should('be.visible')` / `page.locator('header')` | `Then debe ver el encabezado principal` |
| Orientación | Orientado a implementación técnica | Orientado a comportamiento del sistema |
| Legibilidad | Para perfiles QA y desarrollo | Legible por perfiles no técnicos |
| Conexión con requisitos | Implícita — el lector infiere la intención | Explícita — el nombre del paso es el requisito |
| Mantenimiento | Cambio de selector = cambio en el test | Cambio de selector = cambio solo en la step definition, no en el `.feature` |

---

## Resultado de validación

### Cucumber

```bash
npx cucumber-js
```

```
.....

1 scenario (1 passed)
5 steps (5 passed)
0m 8.756s
```

- Scenarios: 1 ejecutado, 1 passing
- Steps: 5 (3 pasos Gherkin + hooks Before y After contabilizados por el runner)
- Exit code: 0

### Playwright

```bash
npx playwright test
```

```
Running 3 tests using 1 worker

  ok 1 › home.spec.js › Página principal del proyecto › Debe cargar y mostrar el header
  ok 2 › home.spec.js › Página principal del proyecto › Debe tener un título no vacío
  ok 3 › home.spec.js › Página principal del proyecto › Debe validar la URL

3 passed (35.0s)
```

- Tests: 3, Passing: 3, Failing: 0
- Exit code: 0

### Cypress

```bash
npx cypress run
```

```
┌───────────────────────────────────────┬───────┬─────────┬─────────┐
│ Spec                                  │ Tests │ Passing │ Failing │
├───────────────────────────────────────┼───────┼─────────┼─────────┤
│ ui/home.cy.js                         │   4   │    4    │    0    │
│ api/climate.cy.js                     │   2   │    2    │    0    │
│ api/consultants.cy.js                 │   1   │    1    │    0    │
│ api/earthquakes.cy.js                 │   2   │    2    │    0    │
│ api/negative-cases.cy.js             │   3   │    3    │    0    │
│ All specs passed!                     │  12   │   12    │    0    │
└───────────────────────────────────────┴───────┴─────────┴─────────┘
```

- Specs: 5, Tests: 12, Passing: 12, Failing: 0
- Exit code: 0

---

## Riesgos y pendientes

| Riesgo / Pendiente | Descripción |
|---|---|
| Servidor debe estar corriendo | Cucumber no inicia el servidor Next.js por sí solo. Debe estar en ejecución antes de `npx cucumber-js`. |
| Servidor en WindowStyle Hidden | Iniciado en modo oculto puede crashear silenciosamente sin log visible. Se recomienda iniciarlo con log capturado o en terminal separada. |
| CommonJS / ESM | `cucumber.json` usa `require` (CommonJS). Si el proyecto migra a ESM puro, habrá que ajustar a `import` y actualizar la configuración. |
| Scenario Outline | Pendiente para módulos futuros. Permite parametrizar un escenario con múltiples conjuntos de datos usando `Examples`. |
| Escenarios negativos | Pendiente documentar y automatizar casos donde la página no carga o el servidor devuelve error. |
| Ejecución en CI/CD | Pendiente configurar Cucumber en pipeline de integración continua (Módulo 10). |
| Reporting BDD | Pendiente agregar formatter `html` o JSON para reportes estructurados de Cucumber. |
| Criterios de aceptación reales | Pendiente conectar los `.feature` con historias de usuario o tickets del backlog. |

---

## Cierre del módulo

El Módulo 8 queda cubierto con:

- instalación de `@cucumber/cucumber 13.0.0`
- integración de Cucumber con Playwright sin modificar Cypress
- primer archivo `.feature` con escenario BDD en Gherkin
- step definitions funcionales con `Before`/`After`, `setDefaultTimeout(60s)` y `browser.newContext()`
- ejecución BDD exitosa: 1 scenario passing, exit code 0
- validación cruzada sin regresiones: Playwright 3/3, Cypress 12/12

**Commit técnico:**
`5ee000d test(bdd): instalar Cucumber y agregar primer escenario BDD con Playwright`
