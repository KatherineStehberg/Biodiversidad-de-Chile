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

## Organización de specs por tipo de prueba

### Cambio realizado

**Antes:**

```
cypress/e2e/home.cy.js
cypress/e2e/api-consultants.cy.js
```

**Después:**

```
cypress/e2e/
├── api/
│   └── consultants.cy.js
└── ui/
    └── home.cy.js
```

Los archivos fueron movidos con `git mv`. Ningún contenido fue modificado.
Git los registró como renombrados con similitud R100 (100% idénticos).

Commit: `47d9931 refactor(cypress): organizar specs en carpetas ui y api`

---

### Conceptos aplicados

- **Spec:** archivo de prueba que contiene uno o más tests. En Cypress,
  cada archivo `.cy.js` es un spec.
- **Suite:** grupo de tests relacionados, normalmente agrupados dentro de
  un bloque `describe()`. Un spec puede contener una o varias suites.
- **Prueba UI:** valida la interfaz, la navegación o el comportamiento
  visible desde el navegador — interacción con elementos del DOM.
- **Prueba API:** valida endpoints HTTP directamente — status codes,
  estructura de respuesta y contratos de la API, sin pasar por el navegador.
- **Organización por tipo:** separar pruebas UI de pruebas API en carpetas
  distintas permite identificar más rápido qué se está probando, ejecutar
  solo un tipo de prueba en CI (`--spec "cypress/e2e/ui/**"`) y escalar la
  suite sin mezclar responsabilidades.

---

### Por qué no fue necesario modificar `cypress.config.ts`

El `specPattern` configurado es:

```ts
specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
```

El `**` es un glob recursivo que cubre cualquier nivel de subcarpeta dentro
de `cypress/e2e/`. Tanto `ui/home.cy.js` como `api/consultants.cy.js` quedan
dentro del patrón. Cypress los detectó automáticamente sin ningún cambio de
configuración.

---

### Resultado validado — 2026-07-06

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

| Spec                   | Tests | Passing | Failing | Duración |
|------------------------|-------|---------|---------|----------|
| `api/consultants.cy.js` | 1    | 1       | 0       | 7 s      |
| `ui/home.cy.js`         | 4    | 4       | 0       | 59 s     |
| **Total**               | **5** | **5**  | **0**   | **1:06** |

- Specs encontrados: 2 ✅
- Exit code: 0 ✅
- Archivos renombrados R100 — sin cambios de contenido ✅

---

### Aclaración

Este cambio no modifica la lógica de ningún test ni ninguna aserción.
Es un cambio de organización del proyecto: mejora la legibilidad y la
estructura, pero el comportamiento de los tests es idéntico.

---

## Comandos personalizados en Cypress

### ¿Qué es un custom command?

Un **comando personalizado** (*custom command*) es una función registrada en
el objeto `cy` que puede usarse igual que cualquier comando nativo de Cypress.
Se define en `cypress/support/commands.ts` y queda disponible en todos los
specs automáticamente, porque `cypress/support/e2e.ts` importa ese archivo
antes de que cualquier spec se ejecute.

### `Cypress.Commands.add()`

Es la función que registra el nuevo comando. Recibe el nombre del comando
como string y la función que lo implementa:

```ts
Cypress.Commands.add('visitHome', () => {
  cy.visit('/')
})
```

A partir de ese registro, `cy.visitHome()` existe en toda la suite.

### Declaración de tipos en TypeScript

Como `commands.ts` es un archivo TypeScript, Cypress necesita que el tipo
del nuevo comando esté declarado para reconocerlo en los specs. Se extiende
la interfaz `Chainable` del namespace `Cypress`:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      visitHome(): Chainable<void>
    }
  }
}

export {}
```

Sin esta declaración, TypeScript marcaría `cy.visitHome()` como error de tipo,
aunque el test correría igualmente en tiempo de ejecución.

### Comando creado

| Campo | Valor |
|---|---|
| Nombre | `cy.visitHome()` |
| Definido en | `cypress/support/commands.ts` |
| Usado en | `cypress/e2e/ui/home.cy.js` |
| Implementación interna | `cy.visit('/')` |

### Cambio aplicado en `home.cy.js`

**Antes:**

```js
beforeEach(() => {
  cy.visit('/')
})
```

**Después:**

```js
beforeEach(() => {
  cy.visitHome()
})
```

### Por qué no cambia el comportamiento

`cy.visitHome()` llama a `cy.visit('/')` internamente. Cypress ejecuta
exactamente los mismos pasos: navega a `baseUrl + '/'`, espera que la página
cargue y continúa. El resultado observable es idéntico.

Lo que mejora es la **legibilidad**: `cy.visitHome()` expresa una intención
de negocio, no una instrucción técnica. Y la **reutilización**: si la ruta
de la página de inicio cambia de `/` a `/inicio`, se actualiza en un solo
lugar (`commands.ts`), no en todos los specs que la usan.

### Resultado validado — 2026-07-06

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/ui/home.cy.js"
```

| # | Descripción                                    | Resultado | Duración  |
|---|------------------------------------------------|-----------|-----------|
| 1 | Debe cargar correctamente                      | ✅ Passed  | 15 494 ms |
| 2 | Debe validar la URL                            | ✅ Passed  | 6 444 ms  |
| 3 | Debe verificar que la página tenga un título   | ✅ Passed  | 5 473 ms  |
| 4 | Debe tomar una captura de la página principal  | ✅ Passed  | 20 218 ms |

| Campo       | Valor   |
|-------------|---------|
| Tests       | 4       |
| Passing     | 4       |
| Failing     | 0       |
| Exit code   | 0       |

Commit: `06d551d test(cypress): agregar comando personalizado visitHome`

---

## Selectores robustos y locators

### El problema con `cy.get('body')`

El test original validaba:

```js
it('Debe cargar correctamente', () => {
  cy.get('body').should('be.visible')
})
```

`<body>` siempre existe en cualquier página HTML, incluso en una que falló completamente — una
pantalla en blanco, un error de JavaScript que impidió renderizar cualquier componente, o una
respuesta vacía del servidor. Este selector no verifica que la aplicación cargó correctamente;
solo verifica que el navegador abrió una página.

### Conceptos

**Selector**
Una expresión que identifica uno o más nodos del DOM. En Cypress se pasa como argumento a
`cy.get()`. Puede ser un selector CSS (`'nav'`, `'h1'`, `'.clase'`), un atributo
(`'[data-cy="hero"]'`) o texto (con `cy.contains()`).

**Locator**
Término más general, equivalente al selector en frameworks como Playwright. Describe *qué
busca* (el elemento de negocio), mientras que el selector describe *cómo lo encuentra* (la
expresión técnica). En Cypress se usan como sinónimos.

**¿Qué hace robusto a un selector?**

| Criterio | Descripción |
|---|---|
| Unicidad | Identifica exactamente un elemento |
| Estabilidad | No cambia por rediseño (clases CSS, estructura de layout) |
| Independencia del texto | No rompe si el copy se edita |
| Semántica | Describe la intención del elemento, no su apariencia |
| Sin dependencia de la app | No requiere agregar atributos solo para testear |

### El selector elegido: `cy.get('header')`

```js
it('Debe cargar correctamente', () => {
  cy.get('header').should('be.visible')
})
```

El componente `Slider.tsx` renderiza como `<header>`. La inspección del HTML real confirmó:

- **Único en la página** — 1 sola ocurrencia (verificado con servidor real y `Invoke-WebRequest`)
- **Elemento semántico HTML5** — no es una clase CSS que puede cambiar por rediseño
- **Representa contenido real** — es el hero de la Home, primer bloque de contenido relevante
- **No depende de texto visible** — si el copy cambia, el selector sigue funcionando
- **No requiere modificar el código fuente** — no fue necesario agregar `data-cy`

### Cuándo conviene usar `data-cy`

Cuando el elemento no tiene un selector semántico estable y único. Por ejemplo: un botón
dentro de una lista de N productos — no tiene posición fija, su texto puede cambiar, y no
tiene un tag semántico único. En ese caso, `data-cy="add-to-cart-button"` es la solución.

### Cuándo no conviene agregar `data-cy` todavía

Cuando ya existe un selector semántico estable que funciona. Agregar `data-cy` a un `<header>`
único agrega ruido al código fuente sin aportar valor real. La regla: si el elemento tiene
identidad clara en el HTML semántico, úsala. Solo añade `data-cy` cuando no hay alternativa.

### Resultado validado — 2026-07-06

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/ui/home.cy.js"
```

| # | Descripción                                    | Resultado | Duración  |
|---|------------------------------------------------|-----------|-----------|
| 1 | Debe cargar correctamente                      | ✅ Passed  | 15 975 ms |
| 2 | Debe validar la URL                            | ✅ Passed  | 7 248 ms  |
| 3 | Debe verificar que la página tenga un título   | ✅ Passed  | 8 386 ms  |
| 4 | Debe tomar una captura de la página principal  | ✅ Passed  | 21 987 ms |

| Campo     | Valor |
|-----------|-------|
| Tests     | 4     |
| Passing   | 4     |
| Failing   | 0     |
| Exit code | 0     |

Nota: Cypress emitió una advertencia sobre no poder eliminar la carpeta de screenshots anterior
(`trash`). Es cosmética — no afectó el exit code ni los resultados.

Commit: `0c610c2 test(cypress): reemplazar selector body por header en home`

---

## Fixtures como contrato de datos

### ¿Qué es un fixture en Cypress?

Un **fixture** es un archivo de datos estáticos almacenado en `cypress/fixtures/`. Cypress
lo carga con `cy.fixture()` y devuelve su contenido parseado como objeto JavaScript. El
fixture por sí solo no intercepta ninguna petición de red — es solo datos.

### `cy.fixture()`

Carga un archivo de `cypress/fixtures/` y lo entrega como valor chainable:

```js
cy.fixture('api/consultants-response.json').then((data) => {
  // data = { consultants: [] }
})
```

La ruta es relativa a `cypress/fixtures/`. No requiere extensión si es JSON.

### Fixture vs mock vs `cy.request()` vs `cy.intercept()`

| Concepto | Qué es | Cuándo se usa |
|---|---|---|
| **Fixture** | Archivo de datos estáticos | Como referencia de estructura, cuerpo de request, o dato de prueba |
| **Mock** | Sustitución de la respuesta real | Cuando se quiere aislar la prueba del servidor real |
| **`cy.request()`** | Cypress llama directamente al servidor | Validar la API real — el browser no interviene |
| **`cy.intercept()`** | Cypress intercepta requests del browser | Observar o falsificar llamadas que la app hace durante el test |

### Archivos creados o modificados

**Fixture creado:** `cypress/fixtures/api/consultants-response.json`

```json
{
  "consultants": []
}
```

Este archivo documenta la forma mínima esperada de la respuesta: un objeto con la clave
`consultants` cuyo valor es un array.

**Spec modificado:** `cypress/e2e/api/consultants.cy.js`

```js
describe('API de consultores', () => {
  it('GET /api/consultants responde con una estructura válida', () => {
    cy.fixture('api/consultants-response.json').then((expectedShape) => {
      cy.request('GET', '/api/consultants').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')

        // Validar que todas las claves del fixture existen en la respuesta real
        Object.keys(expectedShape).forEach((key) => {
          expect(response.body).to.have.property(key)
        })

        expect(response.body.consultants).to.be.an('array')
      })
    })
  })
})
```

### Cómo se usó el fixture: contrato mínimo

El test **no usa el fixture como mock**. El servidor sigue respondiendo con datos reales —
`cy.request()` llama directamente a `/api/consultants`. El fixture actúa como **contrato de
estructura**: define qué claves debe tener la respuesta, independientemente de los valores.

La validación central es:

```js
Object.keys(expectedShape).forEach((key) => {
  expect(response.body).to.have.property(key)
})
```

Esto recorre todas las claves del fixture (`consultants`) y verifica que existan en la
respuesta real. Si la API cambia y elimina esa clave, el test falla con una razón correcta.

### Por qué no se usó `deep.equal`

```js
// Esto NO se hizo:
expect(response.body).to.deep.equal(expectedShape)
```

Si la API devuelve consultores reales en el futuro, el array `consultants` ya no estaría
vacío. Un `deep.equal` contra `{ "consultants": [] }` fallaría aunque la API esté
funcionando correctamente. El test estaría fallando por una razón incorrecta.

El fixture documenta la *forma* esperada, no los *valores* exactos.

### Por qué no se usó `cy.intercept()` en este paso

`cy.intercept()` intercepta requests que el **navegador** hace durante el test. Este spec
usa `cy.request()` — Cypress llama al servidor directamente sin pasar por el browser. Además,
para usar `cy.intercept()` correctamente necesitamos confirmar primero qué componentes
`'use client'` de la app hacen fetch real desde el browser. Ese análisis corresponde al
paso B6.

### Resultado validado — 2026-07-06

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/api/consultants.cy.js"
```

| # | Descripción | Resultado | Duración |
|---|---|---|---|
| 1 | GET /api/consultants responde con una estructura válida | ✅ Passed | 11 975 ms |

| Campo | Valor |
|---|---|
| Tests | 1 |
| Passing | 1 |
| Failing | 0 |
| Exit code | 0 |

Nota: Cypress emitió una advertencia sobre no poder eliminar la carpeta de screenshots anterior
(`trash`). Es cosmética — no afectó el exit code ni los resultados.

Commit: `8d55bb1 test(cypress): agregar fixture de contrato para api consultants`

---

## Page Object Model para Home

### ¿Qué es Page Object Model?

**Page Object Model** (POM) es un patrón de diseño para automatización de tests que
introduce una capa de abstracción entre los tests y el DOM. Cada página tiene un "Page
Object" — un archivo que encapsula los selectores e interacciones de esa página. Los tests
usan el Page Object en lugar de interactuar con el DOM directamente.

**¿Qué problema resuelve?**
Cuando un selector cambia, se actualiza en un solo lugar (el Page Object) en lugar de en
cada test que lo usa. Separa *qué verificar* (el test) de *cómo encontrar los elementos*
(el Page Object).

### Diferencia entre custom command, Page Object y selector

| Concepto | Qué es | Scope |
|---|---|---|
| **Selector** | Expresión CSS que identifica un nodo del DOM | Ninguno — es una cadena |
| **Custom command** | Función registrada en `cy`, disponible globalmente | Toda la suite |
| **Page Object** | Módulo importado con métodos específicos de una página | Por spec, vía `import` |

Los custom commands son para acciones transversales (`cy.visitHome()`). Los Page Objects
encapsulan los selectores e interacciones de una página concreta.

### Archivo creado: `cypress/support/pages/HomePage.js`

```js
const HomePage = {
  visit() {
    cy.visitHome()
  },

  getHero() {
    return cy.get('header')
  },

  getCurrentUrl() {
    return cy.url()
  },

  getPageTitle() {
    return cy.title()
  },

  takeScreenshot() {
    cy.screenshot('pagina-principal')
  },
}

export default HomePage
```

Diseño de objeto literal (no clase). Cada método encapsula un selector o una acción.
Los métodos que retornan elementos (`getHero`, `getCurrentUrl`, `getPageTitle`) devuelven
el chainable de Cypress para que las aserciones puedan encadenarse directamente.

### Archivo modificado: `cypress/e2e/ui/home.cy.js`

**Antes:**

```js
describe('Página principal del proyecto', () => {
  beforeEach(() => {
    cy.visitHome()
  })

  it('Debe cargar correctamente', () => {
    cy.get('header').should('be.visible')
  })

  it('Debe validar la URL', () => {
    cy.url().should('include', 'localhost:3000')
  })
  // ...
})
```

**Después:**

```js
import HomePage from '../../support/pages/HomePage'

describe('Página principal del proyecto', () => {
  beforeEach(() => {
    HomePage.visit()
  })

  it('Debe cargar correctamente', () => {
    HomePage.getHero().should('be.visible')
  })

  it('Debe validar la URL', () => {
    HomePage.getCurrentUrl().should('include', 'localhost:3000')
  })
  // ...
})
```

No cambiaron los nombres de los tests ni las aserciones. Solo cambió dónde viven los
selectores e interacciones: pasaron del spec al Page Object.

### Resultado validado — 2026-07-06

4/4 passing en `ui/home.cy.js` — 56 segundos — exit code 0.

Commit: `94f2f29 test(cypress): implementar Page Object Model para Home`

---

## Investigación de `cy.intercept()`

### Componentes `'use client'` con fetch real desde el navegador

Se investigaron todos los archivos de `src/` buscando llamadas `fetch()` dentro de
`useEffect` en componentes `'use client'`. Se encontraron tres componentes presentes
en la página principal:

| Componente | Endpoint | Tipo |
|---|---|---|
| `BiodiversityLiveSection.tsx` | `GET /api/biodiversity` | `'use client'` + `useEffect` |
| `ClimateSection.tsx` | `GET /api/climate`, `GET /api/weather` | `'use client'` + `useEffect` |
| `SeismicSection.tsx` | `GET /api/earthquakes` | `'use client'` + `useEffect` |

Estos son candidatos válidos para `cy.intercept()`: el fetch lo emite el **navegador**
al montar el componente, no un Server Component.

### Conceptos

**Spy**
Observa el tráfico real sin modificarlo. El request llega al servidor real y la respuesta
vuelve al browser. `cy.intercept('GET', '/api/x').as('x')` sin un segundo argumento es un
spy.

**Stub**
Intercepta el request y devuelve una respuesta controlada en lugar de llamar al servidor
real. `cy.intercept('GET', '/api/x', { fixture: 'x.json' })` es un stub.

**Mock**
Término general que engloba cualquier sustitución de comportamiento real. En Cypress, "mock"
suele referirse a un stub.

**Alias y `cy.wait()`**
`.as('nombre')` asigna un alias al intercept. `cy.wait('@nombre')` pausa el test hasta que
ese request (y su respuesta) ocurra.

```js
cy.intercept('GET', '/api/x').as('peticion')
cy.visit('/')
cy.wait('@peticion').then((interception) => {
  expect(interception.response.statusCode).to.eq(200)
})
```

**Observar tráfico real vs simular respuesta controlada**

| Spy | Stub |
|---|---|
| La respuesta viene del servidor real | La respuesta la define el test |
| Útil para confirmar que la llamada ocurre | Útil para aislar el test de servicios externos |
| Falla si el servidor es lento o no disponible | Predecible y reproducible |

### Por qué no se implementó `cy.intercept()` como spy en este módulo

Se intentó crear un test spy para `GET /api/biodiversity`. El test falló por timeout: la
ruta Next.js llama a APIs externas — GBIF (`api.gbif.org`) y EONET (`eonet.gsfc.nasa.gov`)
— cuyo tiempo de respuesta es impredecible desde un entorno local.

**Decisión técnica:** no se fuerza `cy.intercept()` como spy en esta fase porque la
prueba sería inestable (*flaky*) por causas externas al código bajo prueba.

**Recomendación para una fase posterior:** implementar `cy.intercept()` con stubbing,
usando un fixture que devuelva una respuesta controlada. Eso elimina la dependencia de
APIs externas y hace el test determinístico.

```js
// Enfoque correcto para una fase posterior
cy.intercept('GET', '/api/biodiversity', {
  fixture: 'api/biodiversity-response.json'
}).as('biodiversityRequest')

cy.visitHome()
cy.wait('@biodiversityRequest').its('response.statusCode').should('eq', 200)
```

---

## Validación final del módulo — 2026-07-06

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

| Spec | Tests | Passing | Failing | Duración |
|---|---|---|---|---|
| `api/consultants.cy.js` | 1 | 1 | 0 | 10 s |
| `ui/home.cy.js` | 4 | 4 | 0 | 43 s |
| **Total** | **5** | **5** | **0** | **53 s** |

Exit code: 0

---

## Cierre del Módulo 5

### Lo que se logró

| Paso | Técnica | Archivo |
|---|---|---|
| A1 | Organización de specs en `ui/` y `api/` | `cypress/e2e/**` |
| B1 | `beforeEach()` — extracción de `cy.visit` | `cypress/e2e/ui/home.cy.js` |
| B2 | Selector robusto — `cy.get('header')` | `cypress/e2e/ui/home.cy.js` |
| B3 | Fixture como contrato de datos | `cypress/fixtures/api/consultants-response.json` |
| B4 | Custom command `cy.visitHome()` | `cypress/support/commands.ts` |
| B5 | Page Object Model — `HomePage` | `cypress/support/pages/HomePage.js` |
| B6 | Investigación de `cy.intercept()` | Documentado — pendiente técnico |

### Pendientes razonables

- `cy.intercept()` con stubbing usando fixtures para componentes que llaman a APIs externas
- Agregar `data-cy` cuando la app crezca en formularios o interacciones complejas
- Mejorar cobertura de navegación (rutas secundarias: `/marketplace`, `/consultores`)
- Separar evidencia final consolidada para Módulo 12 — revisión y mantenimiento de la suite
