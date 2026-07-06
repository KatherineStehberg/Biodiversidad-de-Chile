# 05 — Cypress Avanzado

## Objetivo del módulo

Aplicar prácticas avanzadas de Cypress sobre el proyecto real, sin romper lo
ya logrado en el Módulo 4. Los temas del módulo son:

1. Hooks: `before()`, `beforeEach()`, `after()`, `afterEach()`
2. Comandos personalizados (`Cypress.Commands.add`)
3. Page Object Model (POM)
4. Fixtures
5. `cy.intercept()` con confirmación previa de solicitudes reales
6. Organización avanzada de specs
7. Reducción de flakiness

---

## Estado inicial al comenzar el módulo

**Specs activos:**

| Archivo                             | Tests | Estado   |
|-------------------------------------|-------|----------|
| `cypress/e2e/home.cy.js`            | 4     | ✅ Activo |
| `cypress/e2e/api-consultants.cy.js` | 1     | ✅ Activo |

**Problemas identificados en `home.cy.js` (auditoría Módulo 5):**

- `cy.visit('http://localhost:3000')` repetido en los 4 tests — duplicación
- URL hardcodeada — ignora `baseUrl` configurado en `cypress.config.ts`
- Sin hooks — no hay preparación compartida entre tests
- Sin comandos personalizados
- Sin Page Object Model
- `cy.get('body')` como selector — válido pero mínimo
- Sin fixtures

---

## Concepto: hooks

Un **hook** es una función que Cypress ejecuta automáticamente en un momento
determinado del ciclo de vida de los tests. No es un test en sí mismo: es
código que se ejecuta *alrededor* de los tests para preparar o limpiar el
entorno.

En inglés, *hook* significa gancho — la idea es que "se engancha" al flujo de
ejecución para interceptarlo en un punto específico.

---

## Los cuatro hooks de Cypress

### `before()`

Se ejecuta **una sola vez, antes de todos los tests del bloque `describe`**.

```js
describe('Suite de ejemplo', () => {
  before(() => {
    cy.log('Esto corre una vez, antes de los tests')
  })
})
```

Uso típico: preparar datos en la base de datos de prueba, cargar una sesión
de usuario que se va a reutilizar en todos los tests del bloque.

---

### `beforeEach()`

Se ejecuta **antes de cada test individual (`it()`)**. Es el hook más utilizado.

```js
describe('Suite de ejemplo', () => {
  beforeEach(() => {
    cy.visit('/')  // garantiza que cada test empieza en la misma página
  })
})
```

Uso típico: navegar a la página inicial, restablecer el estado del formulario,
limpiar el `localStorage`.

---

### `after()`

Se ejecuta **una sola vez, después de todos los tests del bloque `describe`**.

```js
describe('Suite de ejemplo', () => {
  after(() => {
    cy.log('Esto corre una vez, después de todos los tests')
  })
})
```

Uso típico: limpiar datos creados durante los tests, cerrar conexiones.
Menos frecuente que `before()`.

---

### `afterEach()`

Se ejecuta **después de cada test individual**. Se usa para restaurar el estado
entre tests.

```js
describe('Suite de ejemplo', () => {
  afterEach(() => {
    cy.clearLocalStorage()
  })
})
```

Uso típico: limpiar cookies o `localStorage` para que cada test parta de un
estado limpio, independientemente de lo que el test anterior haya hecho.

---

## Paso 1: refactorización de `home.cy.js` con `beforeEach()`

### Problema

Los 4 tests de `home.cy.js` repetían exactamente la misma línea al inicio:

```js
cy.visit('http://localhost:3000')
```

Esto tiene dos problemas:
1. **Duplicación:** si la URL cambia, hay que editarla en 4 lugares.
2. **URL hardcodeada:** ignora el `baseUrl` ya configurado en `cypress.config.ts`.

### `baseUrl` y `cy.visit('/')`

`cypress.config.ts` tiene configurado:

```ts
baseUrl: 'http://localhost:3000'
```

Cuando Cypress recibe `cy.visit('/')`, resuelve la ruta relativa contra `baseUrl`
y navega a `http://localhost:3000/`. El resultado es idéntico al `cy.visit('http://localhost:3000')`
anterior, pero:

- La URL de base se administra en un solo lugar (`cypress.config.ts`)
- Si el puerto, host o protocolo cambia para staging o CI, solo se actualiza
  `baseUrl` — todos los tests se adaptan automáticamente
- El código del test queda más limpio y enfocado en lo que verifica, no en
  dónde conectarse

### Cambio aplicado

**Antes (22 líneas, 4 repeticiones de `cy.visit`):**

```js
describe('Página principal del proyecto', () => {
  it('Debe cargar correctamente', () => {
    cy.visit('http://localhost:3000')
    cy.get('body').should('be.visible')
  })

  it('Debe validar la URL', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('include', 'localhost:3000')
  })

  it('Debe verificar que la página tenga un título', () => {
    cy.visit('http://localhost:3000')
    cy.title().should('not.be.empty')
  })

  it('Debe tomar una captura de la página principal', () => {
    cy.visit('http://localhost:3000')
    cy.get('body').should('be.visible')
    cy.screenshot('pagina-principal')
  })
})
```

**Después (21 líneas, 1 sola visita en `beforeEach`):**

```js
describe('Página principal del proyecto', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Debe cargar correctamente', () => {
    cy.get('body').should('be.visible')
  })

  it('Debe validar la URL', () => {
    cy.url().should('include', 'localhost:3000')
  })

  it('Debe verificar que la página tenga un título', () => {
    cy.title().should('not.be.empty')
  })

  it('Debe tomar una captura de la página principal', () => {
    cy.screenshot('pagina-principal')
  })
})
```

### Qué se mantiene igual

- Los 4 tests existen con los mismos nombres
- Las mismas aserciones (`.should('be.visible')`, `.should('include', ...)`,
  `.should('not.be.empty')`, `cy.screenshot(...)`)
- El comportamiento observable: cada test visita la página principal y ejecuta
  su verificación

### Commit del cambio

```
ca51af5  test(cypress): extraer cy.visit a beforeEach y usar baseUrl
```

---

## Resultado de ejecución — 2026-07-06

**Entorno:** servidor iniciado con `npm run dev`, solicitud de calentamiento
confirmó HTTP 200 en el intento 4 (183 476 bytes). Workaround QA-005 aplicado
antes de Cypress.

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/home.cy.js"
```

**Resultados:**

| # | Descripción                                    | Resultado | Duración  |
|---|------------------------------------------------|-----------|-----------|
| 1 | Debe cargar correctamente                      | ✅ Passed  | 15 005 ms |
| 2 | Debe validar la URL                            | ✅ Passed  | 6 790 ms  |
| 3 | Debe verificar que la página tenga un título   | ✅ Passed  | 5 380 ms  |
| 4 | Debe tomar una captura de la página principal  | ✅ Passed  | 20 724 ms |

| Campo          | Valor                   |
|----------------|-------------------------|
| Tests          | 4                       |
| Passing        | 4                       |
| Failing        | 0                       |
| Screenshots    | 1 (`pagina-principal.png`, 1000×8871 px) |
| Duración total | 48 segundos             |
| Exit code      | 0                       |

---

## Nota importante: `beforeEach()` y el problema JIT

`beforeEach()` **no es la solución al problema de compilación JIT de Next.js**
ni al error `ESOCKETTIMEDOUT` documentado en QA-005.

`beforeEach()` organiza el código del test: garantiza que cada test empieza en
la misma página. No tiene ningún efecto sobre si el servidor de desarrollo ha
compilado la ruta antes de que Cypress intente visitarla.

La secuencia de calentamiento previa sigue siendo necesaria para estabilizar
el entorno:

1. Iniciar el servidor (`npm run dev`)
2. Esperar respuesta HTTP 200 en `localhost:3000`
3. Aplicar workaround QA-005 en el proceso actual
4. Ejecutar Cypress

Si Cypress se ejecuta sin el calentamiento, el test 1 puede seguir fallando
con `ESOCKETTIMEDOUT`, independientemente de si usa `beforeEach()` o `cy.visit()`
directo en cada test. Son dos problemas distintos:

| Problema | Causa | Solución |
|---|---|---|
| Duplicación de `cy.visit()` | Diseño del test | `beforeEach()` |
| ESOCKETTIMEDOUT en test 1 | Secuencia de inicio del entorno | Calentamiento HTTP previo |

---

## Pendientes del módulo

- Mejorar selectores en `home.cy.js` (reemplazar `cy.get('body')`)
- Agregar comando personalizado `cy.visitHome()`
- Crear fixture para `api-consultants.cy.js`
- Implementar Page Object Model para la página principal
- Investigar qué componentes `'use client'` hacen fetch real para usar `cy.intercept()`
- Reorganizar specs en subcarpetas `ui/` y `api/`
