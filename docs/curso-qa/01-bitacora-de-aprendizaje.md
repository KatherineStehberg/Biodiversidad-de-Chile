# Bitácora de Aprendizaje — Test Automation Engineer
## Proyecto: Biodiversidad de Chile

---

## Cronología del curso

Fechas verificadas contra el historial de commits del repositorio.
La Sesión 1 no tiene commit asociado (trabajo exploratorio previo al primer commit documentado).

| Sesión | Módulo | Tema | Fecha verificada | Commits asociados |
|---|---|---|---|---|
| 1 | Auditoría inicial | Inventario del proyecto | 2026-07-04 (sin commit) | — |
| 2 | Estabilización | Entorno, dev, build | 2026-07-05 | `68931ca` |
| 3 | M4 — Cypress básico | Análisis home.cy.js y diagnóstico QA-005 | 2026-07-05 | `fd1a24c` `a4e26e1` `132b84f` |
| 4 | M4 — Cypress básico | Diagnóstico ESOCKETTIMEDOUT / JIT | 2026-07-05 | `132b84f` |
| 5 | M4 — Cypress básico | Reemplazo api-usuarios por API real | 2026-07-06 | `902a11b` `88cff02` |
| 6 | M5 — Cypress avanzado | `beforeEach()` y `baseUrl` | 2026-07-06 | `ca51af5` `83c35f2` |
| 7 | M5 — Cypress avanzado | Organización specs en `ui/` y `api/` | 2026-07-06 | `47d9931` `40064f8` |
| 8 | M5 — Cypress avanzado | Custom command `cy.visitHome()` | 2026-07-06 | `06d551d` `e7aa7ce` |
| 9 | M5 — Cypress avanzado | Selectores robustos (`header`) | 2026-07-06 | `0c610c2` `a6a7123` |
| 10 | M5 — Cypress avanzado | Fixture como contrato de datos | 2026-07-06 | `8d55bb1` `f3e41ba` |
| 11 | M5 — Cypress avanzado | Page Object Model + cierre | 2026-07-06 | `94f2f29` `39630ac` |
| 12 | M6 — API Testing | `cy.request()` y casos negativos | 2026-07-08 | `bc26e65` `6f9c336` |
| 13 | M7 — Playwright | Instalación y spec inicial | 2026-07-08 | `b44f3e9` `74c6275` `7b23c23` |
| 14 | M8 — Cucumber BDD | Gherkin, features, step definitions | 2026-07-11 | `5ee000d` `1aabeae` |
| 15 | M9 — Mobile Testing | Playwright devices, iPhone 12 | 2026-07-11 | `e6a05f9` `65236cd` |

---

## Sesión 1 — Auditoría inicial del proyecto

**Fecha:** 2026-07-04 *(trabajo exploratorio — sin commit asociado a esta fecha; primer commit documentado: `68931ca` del 2026-07-05)*

**¿Qué aprendimos?**
Que un proyecto puede estar funcionando correctamente y tener cero cobertura
de pruebas automatizadas al mismo tiempo. "Funciona" y "está probado" son
cosas distintas. La auditoría previa a cualquier cambio evita decisiones
basadas en suposiciones.

**Conceptos nuevos**
- Auditoría de proyecto: revisar el estado real antes de modificar nada
- Modo mock: usar datos ficticios para no depender de una base de datos real
- API Route: función del servidor que responde a solicitudes HTTP
- Endpoint: URL específica que acepta solicitudes y devuelve datos
- Suite de pruebas: conjunto de tests agrupados bajo un mismo `describe()`

**Comandos utilizados**
- `git remote -v` — verificar a qué repositorio remoto está conectado el proyecto
- `git branch -a` — ver todas las ramas locales y remotas
- `git log --oneline -5` — historial de commits en formato compacto

**Resultado obtenido**
Inventario completo del proyecto: 25 páginas, 19 endpoints, tecnologías
identificadas, modo mock disponible, 2 archivos Cypress (1 no aplicable al
proyecto actual).

**Errores encontrados**
`api-usuarios.cy.js` referencia un endpoint que no existe en el proyecto.
Registrado como hallazgo QA-001.

**¿Cómo se interpretó?**
No es un error de Cypress sino un problema de coherencia: existe un test
para un endpoint que no fue implementado, o el endpoint existió y fue eliminado
sin actualizar el test correspondiente.

**¿Cómo lo explicaría una persona principiante?**
Es como tener una llave que no abre ninguna puerta del edificio. La llave
existe en el llavero, pero la puerta para la que fue diseñada no está ahí.

**Vocabulario técnico (inglés)**
- *endpoint* = punto de conexión de una API
- *mock* = simulación o imitación de datos reales
- *untracked* = archivo que Git aún no registra en el historial

**Evidencia**
- Lectura directa de más de 20 archivos del proyecto
- Salida confirmada de comandos Git

**Pendientes**
- Verificar que el proyecto compila y corre (`npm run dev`, `npm run build`)

---

## Sesión 2 — Estabilización del proyecto

**Fecha:** 2026-07-05

**¿Qué aprendimos?**
Que verificar el entorno antes de escribir pruebas evita perder tiempo
depurando problemas de infraestructura durante los tests.
También aprendimos que un build puede completar sin errores aunque el código
tenga problemas de tipos o de calidad, si las validaciones están desactivadas
en la configuración.

**Conceptos nuevos**
- Build (compilación): proceso de transformar el código fuente en una versión
  optimizada para producción
- Exit code 0: código de salida que indica que un proceso terminó sin errores
- Staging area: zona intermedia donde Git guarda los cambios antes de un commit
- Hot reload: capacidad del servidor de desarrollo de actualizar la página
  automáticamente cuando se modifica un archivo
- JIT (Just-In-Time): compilación bajo demanda — Next.js compila cada ruta
  la primera vez que se visita

**Comandos utilizados**
- `node -v` — verificar versión de Node.js
- `npm -v` — verificar versión de npm
- `npm run dev` — iniciar servidor de desarrollo
- `npm run build` — compilar el proyecto para producción
- `git status` — verificar el estado del repositorio

**Resultado obtenido**
- `npm run dev`: ✅ listo en 3.8 s, puerto 3000, sin errores
- HTTP 200 OK confirmado en `http://localhost:3000`
- `npm run build`: ✅ exit code 0, 47 páginas generadas, duración ~59 s

**Errores encontrados**
Ningún error que bloquee la ejecución ni el build.
Se detectaron 4 hallazgos de riesgo (QA-001 a QA-004), ninguno crítico.

**¿Cómo se interpretaron los hallazgos?**
QA-002 y QA-003 detectaron que TypeScript y ESLint están desactivados durante
el build. Son configuraciones que reducen las validaciones automáticas del
proceso de compilación. Aún no se sabe si fueron configuradas de forma
deliberada, si son temporales, o si representan deuda técnica acumulada.
Se documentan para decidir cómo abordarlos en la fase de CI/CD (módulo 10).

**¿Cómo lo explicaría una persona principiante?**
Antes de empezar a probar si un auto funciona bien, primero hay que verificar
que enciende, que las ruedas están puestas y que tiene combustible.
Si el auto arranca pero el tablero tiene las luces de advertencia apagadas
aunque haya problemas, eso también es algo que hay que documentar, aunque
el auto "funcione".

**Vocabulario técnico (inglés)**
- *build* = compilación o construcción del proyecto
- *exit code* = código de salida de un proceso (0 = sin errores)
- *middleware* = código intermediario entre la solicitud y la respuesta
- *hot reload* = recarga automática al modificar archivos

**Evidencia**
- Output de `npm run dev`: "Ready in 3.8s", puerto 3000
- HTTP Status 200 en `http://localhost:3000`
- Output de `npm run build`: exit code 0, "Generating static pages (47/47)"

**Pendientes**
- Crear la rama `qa-automation-course`
- Versionar `docs/` con el primer commit documental
- Abordar los hallazgos QA-001 a QA-004 en sus módulos correspondientes

---

## Sesión 3 — Módulo 4: análisis de home.cy.js y diagnóstico de Cypress

**Fecha:** 2026-07-05

**¿Qué aprendimos?**
Que entender un archivo de tests línea por línea antes de ejecutarlo es una
práctica de QA real, no solo pedagógica. También aprendimos que el entorno
de ejecución puede tener problemas propios, independientes del código de los tests.
Un test bien escrito puede no ejecutarse si la herramienta que lo corre
tiene un problema de instalación.

**Conceptos nuevos**
- Suite: grupo de tests agrupados bajo `describe()`
- Spec: el archivo completo de pruebas (`.cy.js`)
- Test: un bloque `it()` individual
- Assertion: el `.should()` que verifica un resultado
- Command: cada `cy.algo()` que realiza una acción
- Caché de Cypress: carpeta del sistema donde se almacena el binario Electron descargado
- Binario de Cypress: ejecutable nativo que controla el navegador (separado del paquete npm)
- `cypress verify`: comando que verifica que el binario puede iniciarse

**Comandos utilizados**
- `npx cypress version` — muestra versiones del paquete npm y del binario
- `npx cypress cache path` — ruta de la caché del binario
- `npx cypress cache list --size` — versiones instaladas en caché con su tamaño
- `npx cypress verify` — verifica que el binario puede iniciar

**Resultado obtenido**
- Análisis completo de `cypress/e2e/home.cy.js`: 4 tests, estructura `describe` + `it`,
  comandos `cy.visit`, `cy.url`, `cy.title`, `cy.get`, `cy.screenshot`
- `npx cypress version`: paquete 15.17.0, binario 15.17.0, Electron 37.6.0 — versiones coinciden
- `npx cypress verify`: FALLA — binario no acepta `--smoke-test` ni `--ping=N`

**Errores encontrados**
`npx cypress verify` falla con `bad option: --smoke-test` y `bad option: --ping=N`.
Registrado como hallazgo QA-005 (en diagnóstico).

**¿Cómo se interpretó?**
Las versiones del paquete npm y del binario son idénticas, por lo que se
descarta un mismatch de versiones. El error podría indicar un binario corrupto
o una dependencia del sistema operativo faltante. El diagnóstico está en curso.

**¿Cómo lo explicaría una persona principiante?**
Cypress tiene dos partes: el código JavaScript (que dice qué probar) y el
ejecutable que abre el navegador (el que realmente lo hace). Ese ejecutable
está en una carpeta del sistema operativo, separada del proyecto. Si ese
ejecutable tiene un problema, da igual que los tests estén perfectos —
el auto no arranca aunque el GPS esté funcionando.

**Vocabulario técnico (inglés)**
- *binary* = binario, ejecutable nativo compilado para el sistema operativo
- *cache* = caché, almacenamiento temporal en el sistema
- *smoke test* = prueba de humo, verificación mínima de que algo puede arrancar
- *verify* = verificar, confirmar que una instalación está operativa

**Evidencia**
- Salida exacta de `npx cypress version`, `npx cypress cache list --size`,
  `npx cypress verify` documentada en `docs/qa/hallazgos/QA-005-cypress-verify-falla.md`

**Resolución de QA-005**
La causa raíz fue la variable de entorno `ELECTRON_RUN_AS_NODE=1`, heredada
de VSCode (que también es una aplicación Electron). Cuando esta variable está
activa, `Cypress.exe` arranca como proceso Node.js ordinario en lugar de como
aplicación Electron, y rechaza los flags de verificación `--smoke-test` y
`--ping=N` con "bad option".

La variable NO es persistente en el sistema — reaparece en cada sesión
porque la propaga el proceso padre (VSCode/Claude Code). El workaround es
eliminarla en el mismo bloque de comandos que ejecuta Cypress:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
npx cypress verify   # → √ Verified Cypress!
```

**Ejecución de home.cy.js — resultado real**
Se ejecutaron los 4 tests con el workaround de QA-005 aplicado.

| Test | Resultado |
|---|---|
| Debe cargar correctamente | ❌ FAILED — ESOCKETTIMEDOUT |
| Debe validar la URL | ✅ Passed |
| Debe verificar que la página tenga un título | ✅ Passed |
| Debe tomar una captura de la página principal | ✅ Passed |

El test 1 falló por timing: Next.js compiló la primera ruta justo cuando
Cypress intentaba conectarse, y el socket agotó su tiempo de espera antes
de recibir respuesta. Los tests 2, 3 y 4 corrieron cuando el servidor ya
estaba completamente listo.

Se generaron 2 screenshots: `pagina-principal.png` (test exitoso) y una
captura automática del fallo del test 1.

**¿Cómo lo explicaría una persona principiante?**
Es como llamar a alguien por teléfono justo cuando está conectando la línea.
La llamada no entra aunque el teléfono ya esté encendido. Si llamas 30
segundos después, responde sin problemas. El test 1 llamó demasiado pronto;
los tests 2, 3 y 4 llamaron cuando el servidor ya estaba listo.

**Pendientes**
- Resolver el timing del test 1 (beforeEach con visita de calentamiento — Módulo 5)
- Reemplazar `api-usuarios.cy.js` por prueba de endpoint real (Módulo 4 continuación)
- Hacer commit de la documentación de esta sesión

---

## Sesión 4 — Diagnóstico del test 1: ESOCKETTIMEDOUT y compilación JIT

**Fecha:** 2026-07-05

**¿Qué aprendimos?**
Que antes de modificar un test que falla, hay que reproducir y confirmar la
causa exacta del fallo. El test 1 de `home.cy.js` fallaba con `ESOCKETTIMEDOUT`,
no por un error en el código del test, sino porque el entorno no estaba en el
estado esperado cuando Cypress inició la ejecución.

**Hipótesis planteada**
La ejecución anterior mostró un patrón incoherente: el test 1 fallaba (~35 s)
y los tests 2, 3 y 4 pasaban, aunque los cuatro hacen exactamente lo mismo
(`cy.visit('http://localhost:3000')`). Si el servidor estuviera caído, todos
fallarían. Si estuviera funcionando, todos pasarían.

La explicación: Next.js en modo desarrollo compila cada ruta la primera vez
que se accede a ella. El test 1 llegó mientras el servidor compilaba la ruta `/`.
El test 1 agotó su tiempo de espera (~35 s); para cuando los tests 2, 3 y 4
llegaron, la compilación ya había terminado y el servidor respondía normalmente.

**Prueba controlada**
En lugar de modificar el test, se repitió la ejecución con una sola diferencia:
una solicitud HTTP previa al servidor antes de iniciar Cypress.

1. Servidor iniciado con `npm run dev`, se esperó respuesta HTTP 200
2. Esa solicitud forzó que Next.js compilara la ruta `/` (161 967 bytes recibidos)
3. Cypress se ejecutó cuando la ruta ya estaba compilada

**Resultado:** 4/4 tests aprobados en 31 segundos, sin ningún cambio en `home.cy.js`.

| # | Resultado | Duración |
|---|---|---|
| 1 — Debe cargar correctamente | ✅ | 5 686 ms |
| 2 — Debe validar la URL | ✅ | 7 037 ms |
| 3 — Debe verificar que la página tenga un título | ✅ | 3 810 ms |
| 4 — Debe tomar una captura de la página principal | ✅ | 14 449 ms |

**Conceptos nuevos**

- **JIT aplicado a Next.js dev:** el servidor de desarrollo compila cada ruta
  la primera vez que recibe una solicitud para esa ruta. No precompila todas
  las rutas al arrancar, sino bajo demanda. Primera visita = compilación +
  respuesta; visitas siguientes = solo respuesta.
- **Fallo de infraestructura vs. fallo del test:**
  - *Fallo de test:* el código del test es incorrecto, o la aplicación no
    cumple el comportamiento esperado.
  - *Fallo de infraestructura:* el test es correcto, pero el servidor o algún
    recurso del entorno no estaba disponible o listo cuando el test se ejecutó.
  El test 1 no tenía ningún defecto. El problema era que el entorno no estaba
  en el estado esperado.
- **ESOCKETTIMEDOUT:** error de socket TCP. El cliente (Cypress) estableció
  la conexión con el servidor, pero no recibió ningún byte de respuesta antes
  de que se agotara el tiempo de espera. Diferente a:
  - `ECONNREFUSED`: el servidor no acepta la conexión (puerto cerrado)
  - `pageLoadTimeout` de Cypress: el servidor respondió pero la página tardó
    en terminar de cargar

**Principio aplicado**
No se modificó el test antes de reproducir y confirmar la causa. Modificar
un test cuya causa raíz no está confirmada puede enmascarar el problema real
y crear una falsa sensación de que algo se "arregló".

**Comandos utilizados**
```powershell
# Solicitud de calentamiento antes de iniciar Cypress
Invoke-WebRequest -Uri "http://localhost:3000/" -TimeoutSec 60 -UseBasicParsing

# Workaround QA-005 + ejecución en el mismo proceso
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/home.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
Es como llegar a una tienda justo cuando el empleado está encendiendo las luces
y acomodando los productos. La tienda existe, pero todavía no está lista para
atender. Si llegás 30 segundos después, todo funciona normalmente. El problema
no era que la tienda fuera defectuosa — era que llegaste antes de que estuviera
lista para abrir.

**Vocabulario técnico (inglés)**
- *JIT* = Just-In-Time — compilación bajo demanda
- *socket timeout* = tiempo de espera de conexión de red agotado sin respuesta
- *infrastructure failure* = fallo de entorno, no del código en prueba
- *warm-up request* = solicitud previa que fuerza la inicialización del servidor

**Pendientes**
- Formalizar secuencia de inicio reproducible en la documentación
- Evaluar patrón `beforeEach` como alternativa dentro del spec (Módulo 5)

---

## Sesión 5 — Módulo 4: reemplazo de api-usuarios.cy.js por prueba real

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que `cy.intercept()` y `cy.request()` no son intercambiables: tienen propósitos
distintos. Un test que usa `cy.intercept()` para un endpoint que la app nunca
llama no es solo un test que falla — es un test que nunca puede pasar, porque
la condición que espera no existe.

**Análisis de api-usuarios.cy.js**
El archivo original registraba un interceptor para `GET /api/usuarios` y luego
visitaba la página principal esperando que la página realizara esa solicitud:

```javascript
cy.intercept('GET', '/api/usuarios').as('getUsuarios')
cy.visit('http://localhost:3000')
cy.wait('@getUsuarios')  // esperaba una solicitud que nunca ocurría
```

Dos problemas independientes hacían este test imposible de pasar:
1. El endpoint `/api/usuarios` no existe en el proyecto (no hay `src/app/api/usuarios/route.ts`)
2. La página principal nunca hace `fetch('/api/usuarios')` — el interceptor nunca se activaría

**Descarte de GET /api/products como alternativa**
Se analizó si `/marketplace` llama a `GET /api/products` al cargar, con el
objetivo de usar ese endpoint como reemplazo. Resultado:

- `marketplace/page.tsx` es un Server Component que consulta Supabase directamente
  desde el servidor, no vía HTTP. No emite ninguna solicitud `GET /api/products`.
- `src/app/api/products/route.ts` solo tiene un handler `POST` — no existe `GET`.
- Confirmado con ejecución real: `GET /api/products` responde **HTTP 405 Method Not Allowed**.

**Evidencia de GET /api/products → 405:**
```
GET http://localhost:3000/api/products
HTTP 405 Method Not Allowed
```

**Descubrimiento de GET /api/consultants**
Al inspeccionar los handlers `GET` disponibles en el proyecto, se identificó
`GET /api/consultants` como un endpoint real, público y estable:

- Existe en `src/app/api/consultants/route.ts`
- No requiere autenticación
- Responde siempre JSON con la clave `consultants` (array)
- Confirmado con ejecución real: `GET /api/consultants` responde **HTTP 200**

**Evidencia de GET /api/consultants → 200:**
```json
{ "consultants": [] }
```

**Decisión: cy.request() en lugar de cy.intercept()**
`cy.request()` realiza una solicitud HTTP directamente desde Cypress — el test
mismo emite la solicitud y verifica la respuesta. No depende de que ninguna
página llame al endpoint.

`cy.intercept()` solo observa solicitudes que la app ya hace. Si la app nunca
llama al endpoint, el interceptor nunca se activa y el test cuelga hasta agotar
el timeout. Usar `cy.intercept()` sin confirmar primero que la solicitud ocurre
es un antipatrón.

**Resultado de la ejecución: 1/1 passing**

```javascript
// cypress/e2e/api-consultants.cy.js
describe('API de consultores', () => {
  it('GET /api/consultants responde con una estructura válida', () => {
    cy.request('GET', '/api/consultants').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('consultants')
      expect(response.body.consultants).to.be.an('array')
    })
  })
})
```

| # | Resultado | Duración |
|---|---|---|
| 1 — GET /api/consultants responde con una estructura válida | ✅ | 4 364 ms |

Duración total: 4 segundos. Exit code 0.

**Conceptos nuevos**

- **`cy.request()`:** emite una solicitud HTTP desde Cypress directamente,
  sin el navegador. Ideal para probar contratos de API de forma aislada.
- **`cy.intercept()`:** observa o simula solicitudes que la app hace por sí
  misma. No genera ninguna solicitud — solo escucha. Requiere que la solicitud
  ocurra primero desde la aplicación.
- **Contrato de API:** la especificación mínima que un endpoint debe cumplir:
  método, ruta, código de respuesta, Content-Type y estructura del body.
  Verificar el contrato es independiente de verificar el contenido de los datos.
- **Handler HTTP:** función en el servidor que responde a un método específico
  (GET, POST, PUT, DELETE). Un endpoint puede tener POST sin tener GET —
  son handlers separados.
- **HTTP 405 Method Not Allowed:** el servidor reconoce la ruta pero no soporta
  el método solicitado. En este caso, `POST /api/products` existe pero
  `GET /api/products` no.

**Principio aplicado**
Antes de escribir un test con `cy.intercept()`, confirmar por código Y por
ejecución que la app efectivamente realiza esa solicitud. Si no se puede
confirmar, usar `cy.request()` para probar el endpoint directamente.

**Comandos utilizados**
```powershell
# Validación de GET /api/products (descarte)
Invoke-WebRequest -Uri "http://localhost:3000/api/products" -TimeoutSec 10 -UseBasicParsing
# → HTTP 405

# Validación de GET /api/consultants (confirmación)
Invoke-WebRequest -Uri "http://localhost:3000/api/consultants" -TimeoutSec 15 -UseBasicParsing
# → HTTP 200, {"consultants":[]}

# Ejecución de la nueva prueba
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/api-consultants.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
`cy.intercept()` es como poner una grabadora en el teléfono esperando que alguien
llame. Si nadie llama, la grabadora no registra nada. `cy.request()` es como ser
vos quien llama directamente — no necesitás esperar a que nadie más marque el número.

**Vocabulario técnico (inglés)**
- *API contract* = contrato de API — qué promete responder un endpoint
- *method handler* = función que procesa un método HTTP específico (GET, POST…)
- *direct request* = solicitud directa desde el test, sin pasar por la UI
- *intercept* = interceptar, observar o modificar solicitudes existentes

**Pendientes**
- Formalizar script de inicio con calentamiento para ejecución reproducible
- Ampliar `api-consultants.cy.js` con más assertions en módulos futuros

---

## Sesión 6 — Módulo 5: refactorización con `beforeEach()`

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que mejorar la estructura de un test y resolver un problema de infraestructura
son dos cosas distintas. `beforeEach()` elimina la duplicación de código y
garantiza un estado inicial común para cada test — pero no cambia nada sobre
cómo el servidor de desarrollo compila sus rutas. Son responsabilidades diferentes.

**Cambio aplicado**
`home.cy.js` tenía `cy.visit('http://localhost:3000')` repetido en los 4 tests.
Esa línea fue extraída a un `beforeEach()` con `cy.visit('/')`, aprovechando el
`baseUrl` ya configurado en `cypress.config.ts`.

**Antes:**
```js
it('Debe cargar correctamente', () => {
  cy.visit('http://localhost:3000')   // URL hardcodeada, repetida 4 veces
  cy.get('body').should('be.visible')
})
```

**Después:**
```js
beforeEach(() => {
  cy.visit('/')  // URL relativa resuelta contra baseUrl
})

it('Debe cargar correctamente', () => {
  cy.get('body').should('be.visible')
})
```

**Conceptos nuevos**
- **Hook:** función que Cypress ejecuta automáticamente en un momento del
  ciclo de vida de los tests — no es un test, es preparación o limpieza.
- **`beforeEach()`:** se ejecuta antes de cada `it()`. Garantiza que todos
  los tests parten del mismo estado inicial, independientemente del orden
  de ejecución.
- **`before()`:** se ejecuta una sola vez antes del primer test del bloque.
- **`after()`:** se ejecuta una sola vez después del último test del bloque.
- **`afterEach()`:** se ejecuta después de cada test. Útil para limpiar estado.
- **`baseUrl`:** URL base configurada en `cypress.config.ts`. `cy.visit('/')`
  la usa automáticamente. Centraliza la URL del entorno en un único lugar.

**Resultado obtenido**

| # | Test | Resultado | Duración |
|---|------|-----------|----------|
| 1 | Debe cargar correctamente | ✅ | 15 005 ms |
| 2 | Debe validar la URL | ✅ | 6 790 ms |
| 3 | Debe verificar que la página tenga un título | ✅ | 5 380 ms |
| 4 | Debe tomar una captura de la página principal | ✅ | 20 724 ms |

4/4 passing — 48 segundos — exit code 0

**Aprendizaje clave**
No toda mejora de test corrige un problema de infraestructura. `beforeEach()`
organiza el estado inicial de cada test (quién visita la página y cuándo).
El calentamiento HTTP resuelve un problema diferente: asegurar que el servidor
de desarrollo haya compilado la ruta antes de que Cypress la visite.

Si se ejecuta Cypress sin calentamiento, el test 1 puede seguir fallando con
`ESOCKETTIMEDOUT` aunque el spec use `beforeEach()`. Son dos capas distintas:
el código del test y el estado del entorno.

**Comandos utilizados**
```powershell
# Misma secuencia de siempre — beforeEach no la reemplaza
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/home.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
`beforeEach()` es como asegurarte de que cada vez que un cliente entra a una
tienda, el mostrador está despejado y el local está ordenado — es preparación
estándar. Pero no tiene nada que ver con si la tienda ya abrió sus puertas.
Abrir las puertas (calentar el servidor) es un paso previo y distinto.

**Vocabulario técnico (inglés)**
- *hook* = gancho — función que se engancha al ciclo de vida de los tests
- *beforeEach* = antes de cada — se ejecuta antes de cada test individual
- *baseUrl* = URL base — dirección raíz del servidor bajo prueba
- *refactoring* = refactorización — mejorar la estructura sin cambiar el comportamiento

**Evidencia**
- `git diff` confirmó: 4 inserciones, 5 eliminaciones, solo `home.cy.js` modificado
- Commit: `ca51af5 test(cypress): extraer cy.visit a beforeEach y usar baseUrl`

**Pendientes**
- Mejorar selectores en `home.cy.js`
- Agregar comando personalizado `cy.visitHome()`
- Crear fixture para `api-consultants.cy.js`
- Implementar Page Object Model

---

## Sesión 7 — Módulo 5: organización de specs en carpetas `ui/` y `api/`

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que organizar archivos de prueba en carpetas por tipo no cambia el
comportamiento de los tests, pero mejora la legibilidad del proyecto y
prepara la suite para crecer sin mezclar responsabilidades.

**Cambio aplicado**

| Antes | Después |
|---|---|
| `cypress/e2e/home.cy.js` | `cypress/e2e/ui/home.cy.js` |
| `cypress/e2e/api-consultants.cy.js` | `cypress/e2e/api/consultants.cy.js` |

Los archivos fueron movidos con `git mv`. El contenido de los tests no fue
modificado. Git los registró como `R100` — renombrados con 100% de similitud.

No fue necesario modificar `cypress.config.ts` porque el `specPattern`
usa `**`, que cubre cualquier nivel de subcarpeta dentro de `cypress/e2e/`.

**Conceptos nuevos**
- **Spec:** archivo de prueba que contiene uno o más tests (`.cy.js`).
- **Suite:** grupo de tests relacionados definido por un bloque `describe()`.
- **Prueba UI:** valida la interfaz visible — interacción con el DOM,
  navegación, elementos visibles en el navegador.
- **Prueba API:** valida endpoints HTTP directamente — status code,
  Content-Type, estructura del body. No usa el navegador.
- **Organización por tipo de prueba:** separar specs en carpetas según
  su naturaleza (UI, API, etc.) mejora la mantenibilidad y permite ejecutar
  subconjuntos en CI con `--spec "cypress/e2e/ui/**"`.

**Resultado obtenido**

| Spec | Tests | Passing | Duración |
|---|---|---|---|
| `api/consultants.cy.js` | 1 | 1 | 7 s |
| `ui/home.cy.js` | 4 | 4 | 59 s |
| **Total** | **5** | **5** | **1:06** |

2 specs detectados — 5/5 passing — exit code 0

**Comandos utilizados**
```powershell
# Movimiento de archivos sin cambiar contenido
git mv cypress/e2e/home.cy.js cypress/e2e/ui/home.cy.js
git mv cypress/e2e/api-consultants.cy.js cypress/e2e/api/consultants.cy.js

# Validación completa de todos los specs
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

**Aprendizaje clave**
Organizar specs no cambia el comportamiento de los tests. Un test que pasaba
en `cypress/e2e/home.cy.js` sigue pasando en `cypress/e2e/ui/home.cy.js` —
el archivo contiene exactamente lo mismo. Lo que cambia es la mantenibilidad:
cuando el proyecto tenga 20 specs, será fácil distinguir qué prueba la UI
y qué prueba las APIs sin leer el contenido de cada archivo.

**¿Cómo lo explicaría una persona principiante?**
Es como ordenar los documentos de una oficina en carpetas: "Facturas",
"Contratos", "Correspondencia". Los documentos no cambian — siguen diciendo
lo mismo. Pero ahora encontrar lo que necesitás es mucho más rápido,
y la persona que llegue nueva sabe exactamente dónde buscar.

**Vocabulario técnico (inglés)**
- *spec* = specification, especificación — archivo de prueba
- *suite* = conjunto — grupo de tests dentro de un `describe()`
- *glob pattern* = patrón de búsqueda de archivos (`**` = recursivo)
- *rename* = renombrar — en Git, `R100` indica renombrado sin cambio de contenido

**Evidencia**
- `git diff --cached --name-status` confirmó `R100` en ambos archivos
- Commit: `47d9931 refactor(cypress): organizar specs en carpetas ui y api`

**Pendientes**
- Mejorar selectores en `ui/home.cy.js`
- Agregar comando personalizado `cy.visitHome()`
- Crear fixture para `api/consultants.cy.js`
- Implementar Page Object Model

---

## Sesión 8 — Módulo 5: creación de custom command `cy.visitHome()`

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que los comandos personalizados de Cypress no sirven solo para ahorrar
código — sirven para nombrar acciones con intención. `cy.visitHome()` dice
qué se hace; `cy.visit('/')` dice cómo. Esa diferencia importa cuando el
proyecto crece y más personas leen los tests.

**Cambio aplicado**

Se creó el comando `cy.visitHome()` en `cypress/support/commands.ts`:

```ts
Cypress.Commands.add('visitHome', () => {
  cy.visit('/')
})
```

Se agregó su declaración de tipo para que TypeScript lo reconozca:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      visitHome(): Chainable<void>
    }
  }
}
```

Se reemplazó `cy.visit('/')` por `cy.visitHome()` en el `beforeEach` de
`cypress/e2e/ui/home.cy.js`:

```js
// Antes
beforeEach(() => { cy.visit('/') })

// Después
beforeEach(() => { cy.visitHome() })
```

**Conceptos nuevos**
- **Custom command:** función registrada en `cy` que puede usarse como
  comando nativo en cualquier spec. Se define con `Cypress.Commands.add()`.
- **`Cypress.Commands.add()`:** registra el nuevo comando en el objeto `cy`.
  Disponible globalmente porque `e2e.ts` importa `commands.ts` antes de los specs.
- **Reutilización:** si la ruta de la página de inicio cambia, se actualiza
  solo en `commands.ts`, no en todos los specs que la usan.
- **Legibilidad:** `cy.visitHome()` expresa intención de negocio.
  `cy.visit('/')` es una instrucción técnica.
- **Declaración de tipos:** en TypeScript, extender la interfaz `Chainable`
  permite que el compilador reconozca el nuevo comando y no marque error de tipo.

**Resultado obtenido**

| # | Test | Resultado | Duración |
|---|------|-----------|----------|
| 1 | Debe cargar correctamente | ✅ | 15 494 ms |
| 2 | Debe validar la URL | ✅ | 6 444 ms |
| 3 | Debe verificar que la página tenga un título | ✅ | 5 473 ms |
| 4 | Debe tomar una captura de la página principal | ✅ | 20 218 ms |

4/4 passing — 48 segundos — exit code 0

**Aprendizaje clave**
Un comando personalizado no debe ocultar lógica compleja innecesariamente.
Debe nombrar una acción repetible y mejorar la claridad del test. Si el
nombre del comando no comunica más que la instrucción que reemplaza,
probablemente no justifica su existencia. `cy.visitHome()` sí lo justifica:
dice adónde vas, no cómo llegas.

**Comandos utilizados**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/ui/home.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
Es como tener un botón en el tablero del auto que dice "ir a casa" en lugar
de tener que escribir la dirección completa cada vez. Por dentro hace lo
mismo — navega a esa dirección — pero vos solo necesitás saber que ese botón
existe y a dónde lleva.

**Vocabulario técnico (inglés)**
- *custom command* = comando personalizado registrado en `cy`
- *Chainable* = encadenable — tipo que permite seguir usando `.then()`, `.should()`, etc.
- *namespace* = espacio de nombres — forma de agrupar tipos en TypeScript
- *interface extension* = extensión de interfaz — agregar propiedades a un tipo existente

**Evidencia**
- `git diff --cached` confirmó cambios solo en `commands.ts` y `home.cy.js`
- Commit: `06d551d test(cypress): agregar comando personalizado visitHome`

**Pendientes**
- Mejorar selectores en `ui/home.cy.js`
- Crear fixture para `api/consultants.cy.js`
- Implementar Page Object Model

---

## Sesión 9 — Módulo 5: mejora de selector en `home.cy.js`

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que un test no debe validar solo que el navegador abrió HTML. Debe validar que un componente
relevante de la aplicación realmente renderizó. `cy.get('body').should('be.visible')` pasa
incluso cuando la app falló completamente. `cy.get('header').should('be.visible')` valida que
el hero de la Home — el componente `Slider.tsx` — estuvo presente en el DOM.

**Cambio aplicado**

```js
// Antes
it('Debe cargar correctamente', () => {
  cy.get('body').should('be.visible')
})

// Después
it('Debe cargar correctamente', () => {
  cy.get('header').should('be.visible')
})
```

**Conceptos nuevos**
- **Selector:** expresión CSS que identifica un nodo del DOM. En Cypress se pasa a `cy.get()`.
- **Locator:** término equivalente usado en Playwright. En Cypress se usan como sinónimos.
- **Selector robusto:** único, estable, independiente del texto visible, no requiere modificar la app.
- **HTML semántico:** elementos como `<header>`, `<nav>`, `<footer>`, `<section>` tienen
  significado estructural — son más estables que clases CSS.
- **`data-cy`:** atributo agregado al código fuente para que los tests puedan encontrar el
  elemento. Útil cuando no existe selector semántico estable. No se agregó aquí porque
  `<header>` ya era suficiente.
- **Diferencia clave:** `body` valida que hay HTML; `header` valida que el componente principal
  de la Home renderizó.

**Resultado obtenido**

| # | Test | Resultado | Duración |
|---|------|-----------|----------|
| 1 | Debe cargar correctamente | ✅ | 15 975 ms |
| 2 | Debe validar la URL | ✅ | 7 248 ms |
| 3 | Debe verificar que la página tenga un título | ✅ | 8 386 ms |
| 4 | Debe tomar una captura de la página principal | ✅ | 21 987 ms |

4/4 passing — 54 segundos — exit code 0

**Aprendizaje clave**
Un buen test no debe validar solo que el navegador abrió HTML; debe validar que un componente
relevante de la aplicación realmente renderizó. La diferencia entre `cy.get('body')` y
`cy.get('header')` es la diferencia entre comprobar que hay una página y comprobar que la
aplicación funcionó.

**Comandos utilizados**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/ui/home.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
Antes, el test era como verificar que llegó un sobre al buzón. Ahora es como verificar que
había una carta dentro. El sobre siempre existe; lo importante es lo que contiene.

**Vocabulario técnico (inglés)**
- *selector* = expresión que identifica un elemento del DOM
- *locator* = término equivalente en otros frameworks (Playwright)
- *semantic HTML* = HTML con etiquetas que describen el significado del contenido
- *data attribute* = atributo HTML personalizado, como `data-cy`, que los tests pueden buscar

**Evidencia**
- `git diff --cached` confirmó cambios solo en `cypress/e2e/ui/home.cy.js`
- Commit: `0c610c2 test(cypress): reemplazar selector body por header en home`

**Pendientes**
- Crear fixture para `api/consultants.cy.js`
- Implementar Page Object Model

---

## Sesión 10 — Módulo 5: fixture como contrato de datos en prueba API

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que un fixture no siempre reemplaza una API. También puede servir como referencia controlada
para validar la forma mínima esperada de una respuesta. El test sigue llamando al servidor
real con `cy.request()`; el fixture actúa como contrato documentado de estructura.

**Cambio aplicado**

Se creó `cypress/fixtures/api/consultants-response.json`:

```json
{
  "consultants": []
}
```

Se actualizó `cypress/e2e/api/consultants.cy.js` para cargar el fixture y usar sus claves
como contrato mínimo:

```js
cy.fixture('api/consultants-response.json').then((expectedShape) => {
  cy.request('GET', '/api/consultants').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.headers['content-type']).to.include('application/json')

    Object.keys(expectedShape).forEach((key) => {
      expect(response.body).to.have.property(key)
    })

    expect(response.body.consultants).to.be.an('array')
  })
})
```

**Conceptos nuevos**
- **Fixture:** archivo de datos estáticos en `cypress/fixtures/`. No intercepta nada por
  sí solo.
- **`cy.fixture()`:** carga un archivo de fixtures y entrega su contenido como objeto.
- **Contrato de datos:** el fixture define qué claves debe tener la respuesta, sin importar
  los valores. Valida la *forma*, no el *contenido exacto*.
- **`cy.request()`:** Cypress llama directamente al servidor, sin pasar por el browser.
  Ideal para validar la API real.
- **Diferencia fixture vs mock:** el fixture es dato; el mock es comportamiento (sustituye
  la respuesta real). Aquí usamos fixture sin mock — el servidor respondió de verdad.
- **Diferencia `cy.request()` vs `cy.intercept()`:** `cy.request()` lo hace Cypress
  directamente; `cy.intercept()` intercepta lo que el browser hace durante el test.

**Por qué no se usó `deep.equal`**
Si la API devuelve consultores reales en el futuro, el array no estará vacío. Un
`deep.equal` contra `{ "consultants": [] }` fallaría aunque todo funcione correctamente.
Se validaron solo las claves, no los valores.

**Resultado obtenido**

| # | Test | Resultado | Duración |
|---|------|-----------|----------|
| 1 | GET /api/consultants responde con una estructura válida | ✅ | 11 975 ms |

1/1 passing — 12 segundos — exit code 0

**Aprendizaje clave**
Un fixture no siempre reemplaza una API; también puede servir como referencia controlada
para validar la forma mínima esperada de una respuesta. La diferencia entre un fixture como
contrato y un fixture como mock está en si `cy.intercept()` está involucrado o no.

**Comandos utilizados**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/api/consultants.cy.js"
```

**¿Cómo lo explicaría una persona principiante?**
El fixture es como un formulario en blanco que dice qué campos debe tener una respuesta.
No rellena el formulario — eso lo hace el servidor real. Solo sirve para verificar que el
servidor devolvió un formulario con los campos correctos.

**Vocabulario técnico (inglés)**
- *fixture* = archivo de datos estáticos para tests
- *contract testing* = validar que una respuesta tiene la forma esperada sin comparar valores exactos
- *mock* = respuesta simulada que reemplaza al servidor real
- *stub* = sinónimo de mock en el contexto de Cypress/Sinon

**Evidencia**
- `git diff --cached` confirmó cambios en `consultants.cy.js` y nuevo archivo `consultants-response.json`
- Commit: `8d55bb1 test(cypress): agregar fixture de contrato para api consultants`

**Pendientes**
- Implementar Page Object Model

---

## Sesión 11 — Módulo 5: cierre — Page Object Model e investigación de cy.intercept()

**Fecha:** 2026-07-06

**¿Qué aprendimos?**
Que no todo lo que se puede automatizar conviene automatizarlo de inmediato. Si una prueba
depende de servicios externos inestables, es mejor usar stubbing controlado o dejar el caso
documentado como pendiente técnico. Un test flaky — que pasa a veces y falla otras — es
peor que no tener el test: genera ruido y erosiona la confianza en la suite.

**Cambios aplicados**

Se creó `cypress/support/pages/HomePage.js`:

```js
const HomePage = {
  visit() { cy.visitHome() },
  getHero() { return cy.get('header') },
  getCurrentUrl() { return cy.url() },
  getPageTitle() { return cy.title() },
  takeScreenshot() { cy.screenshot('pagina-principal') },
}
export default HomePage
```

Se refactorizó `cypress/e2e/ui/home.cy.js` para usar `HomePage` en lugar de comandos y
selectores directos. No cambiaron aserciones ni nombres de tests.

Se investigaron componentes `'use client'` con fetch real desde el browser:
`BiodiversityLiveSection`, `ClimateSection`, `SeismicSection` — todos llaman a APIs
externas (GBIF, EONET, USGS). El spy falló por timeout. Decisión: deferir a una fase
posterior con stubbing.

**Conceptos nuevos**
- **Page Object Model:** patrón que encapsula selectores e interacciones por página.
  Los tests importan el Page Object en lugar de hablar con el DOM directamente.
- **Custom commands vs Page Objects:** los custom commands son globales y transversales;
  los Page Objects son específicos de una página e importados explícitamente.
- **`cy.intercept()` como spy:** observa tráfico real sin modificarlo. Requiere que el
  servidor sea rápido y estable para no producir timeouts.
- **Stub:** reemplaza la respuesta real con datos controlados. Hace el test predecible.
- **Mock:** término general para cualquier sustitución de comportamiento real.
- **Alias y `cy.wait()`:** `.as('nombre')` + `cy.wait('@nombre')` espera que el request
  interceptado ocurra y reciba respuesta.
- **Estabilidad de pruebas:** un test que depende de APIs externas es flaky por definición.
  La solución es stubs, no timeouts más largos.

**Resultado obtenido — validación final del módulo**

| Spec | Tests | Passing | Failing | Duración |
|---|---|---|---|---|
| `api/consultants.cy.js` | 1 | 1 | 0 | 10 s |
| `ui/home.cy.js` | 4 | 4 | 0 | 43 s |
| **Total** | **5** | **5** | **0** | **53 s** |

5/5 passing — exit code 0

**Aprendizaje clave**
No todo lo que se puede automatizar conviene automatizarlo de inmediato. Si una prueba
depende de servicios externos inestables, es mejor usar stubbing controlado o dejar el
caso documentado como pendiente técnico. La velocidad de avance no vale si los tests
generan falsos negativos.

**Comandos utilizados**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

**¿Cómo lo explicaría una persona principiante?**
Antes, el spec sabía exactamente cómo llegar a cada elemento de la página. Ahora le pregunta
a `HomePage`: "dame el hero", "dame la URL actual". `HomePage` sabe los detalles; el spec
solo sabe qué quiere verificar.

**Vocabulario técnico (inglés)**
- *Page Object Model* = patrón donde cada página tiene su propio objeto con métodos
- *spy* = interceptor que observa el tráfico sin modificarlo
- *stub* = interceptor que reemplaza la respuesta real con datos controlados
- *flaky test* = prueba que falla intermitentemente por causas externas al código
- *alias* = nombre asignado con `.as()` para referirse a un intercept en `cy.wait()`

**Evidencia**
- Commit: `94f2f29 test(cypress): implementar Page Object Model para Home`
- Suite completa: 5/5 passing — exit code 0

---

## Sesión 12 — Módulo 6: API Testing con `cy.request()`

**Fecha:** 2026-07-08 *(verificada: `bc26e65` `6f9c336`)*

**¿Qué aprendimos?**
Que probar una API no significa comparar toda la respuesta exacta. Muchas veces es mejor
validar el contrato mínimo: que el status sea correcto, que el body tenga las claves
esperadas y que los tipos sean los adecuados. Un test que compara el body completo falla
cada vez que los datos cambian, aunque el endpoint funcione perfectamente.

**Conceptos aprendidos**

- **Endpoint:** URL específica de una API que acepta solicitudes y devuelve respuestas.
- **Método HTTP:** `GET`, `POST`, `PUT`, `DELETE` — cada uno con semántica distinta.
- **Status code:** código numérico que indica el resultado: 200, 401, 404, 500, etc.
- **Headers:** metadatos de la respuesta — no el contenido, sino información sobre el contenido.
- **Content-Type:** header que indica el formato del body (`application/json`).
- **Body:** contenido real de la respuesta — accesible con `response.body` en Cypress.
- **Contrato de API:** forma mínima prometida por un endpoint — método, status, Content-Type y estructura del body.
- **`cy.request()`:** Cypress emite la solicitud HTTP directamente, sin navegador. El test mismo es el cliente.
- **Caso positivo:** el endpoint responde correctamente ante una solicitud válida.
- **Caso negativo:** el endpoint rechaza correctamente ante una solicitud inválida o sin autenticación.
- **`failOnStatusCode: false`:** permite que Cypress llegue a la assertion aunque el servidor responda 4xx o 5xx.
- **Fixture de contrato:** archivo JSON que define las claves esperadas. No reemplaza al servidor — solo sirve de referencia de forma.
- **Flakiness por APIs externas:** un test que depende de un servicio externo puede fallar sin cambios en el código. La solución es stubbing, no timeouts más largos.

**Cambios aplicados**

- Se crearon 3 nuevos specs de API:
  - `cypress/e2e/api/climate.cy.js` — valida `/api/climate` y `/api/weather` con coordenadas fijas
  - `cypress/e2e/api/earthquakes.cy.js` — valida `/api/earthquakes`, estructura `chile/world` y campos requeridos
  - `cypress/e2e/api/negative-cases.cy.js` — valida 404 para ruta inexistente y 401 para endpoints protegidos sin auth

- Se crearon 2 fixtures de contrato:
  - `cypress/fixtures/api/climate-response.json`
  - `cypress/fixtures/api/weather-response.json`

- Se mantuvo `cypress/e2e/api/consultants.cy.js` sin cambios como prueba base de contrato.

**Resultado obtenido**

| Spec | Tests | Passing | Failing |
|---|---|---|---|
| `api/climate.cy.js` | 2 | 2 | 0 |
| `api/consultants.cy.js` | 1 | 1 | 0 |
| `api/earthquakes.cy.js` | 2 | 2 | 0 |
| `api/negative-cases.cy.js` | 3 | 3 | 0 |
| `ui/home.cy.js` | 4 | 4 | 0 |
| **Total** | **12** | **12** | **0** |

5 specs — 12/12 passing — exit code 0

**Aprendizaje clave**
Probar una API no significa comparar toda la respuesta exacta; muchas veces es mejor validar
contrato mínimo, tipos, status codes y comportamiento esperado sin hacer el test frágil.
Un test que falla cada vez que los datos cambian no protege nada — solo genera ruido.

**Comandos utilizados**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

**¿Cómo lo explicaría una persona principiante?**
Probar una API es como auditar un formulario de entrega: no revisás si el nombre del destinatario
es "Juan" o "María" — revisás que el formulario tenga campo de nombre, campo de dirección y campo
de teléfono. Si tiene esos campos, el formulario cumple su contrato. El contenido lo pone el
servidor; el contrato lo define el test.

**Vocabulario técnico (inglés)**
- *contract testing* = validar que una respuesta tiene la forma esperada, no el contenido exacto
- *negative test* = test que verifica que el sistema rechaza correctamente lo que no debe aceptar
- *status code* = código de respuesta HTTP
- *failOnStatusCode* = opción de cy.request() para permitir respuestas 4xx/5xx sin fallar automáticamente
- *flaky test* = test que pasa y falla intermitentemente sin cambios en el código

**Evidencia**
- Commit: `bc26e65 test(api): ampliar cobertura de pruebas API con cy.request`
- Suite completa: 12/12 passing — exit code 0

---

## Sesión 13 — Módulo 7: Playwright

**Fecha:** 2026-07-08 *(verificada: `b44f3e9` `74c6275` `7b23c23`)*

**¿Qué aprendimos?**
Que Playwright no reemplaza automáticamente a Cypress — puede coexistir como segundo runner E2E
y aporta sintaxis `async/await`, soporte multi-browser real y traces integrados.
Los mismos casos de prueba pueden expresarse en ambos frameworks con sintaxis diferente,
y conocer los dos es una ventaja concreta en el mercado laboral.

**Conceptos nuevos**

- **Playwright:** framework de browser automation y testing E2E desarrollado por Microsoft.
  Soporta Chromium, Firefox y WebKit desde una misma API.
- **Browser automation:** control programático de un navegador real — navegación, clicks,
  formularios, capturas — sin intervención humana.
- **Test runner:** herramienta que descubre, ejecuta y reporta los resultados de un conjunto
  de tests. Playwright y Cypress son ejemplos de test runners E2E.
- **`page.goto()`:** navega a una URL. Equivalente a `cy.visit('/')`.
- **`page.locator()`:** referencia a un elemento del DOM. Equivalente a `cy.get()`.
  Es lazy — no interactúa con el DOM hasta que se ejecuta una acción o assertion.
- **`expect()`:** función de assertion de Playwright. Equivalente a `.should()` de Cypress.
- **`async/await`:** modelo de JavaScript para manejar operaciones asincrónicas. En Playwright,
  cada interacción con el browser requiere `await` explícito.
- **Chromium:** motor de browser open source en el que se basan Chrome y Edge. En este módulo
  es el único browser instalado para Playwright.
- **Trace:** archivo ZIP que Playwright genera cuando un test falla. Registra cada acción,
  llamada de red y screenshot del test. Se visualiza con `npx playwright show-trace`.
- **Comparación Cypress vs Playwright:** mismos casos de prueba, sintaxis distinta. Cypress
  encola las operaciones internamente; Playwright expone `async/await` directamente.

**Cambios aplicados**

- Se instaló `@playwright/test` con `npm install -D @playwright/test`
- Se instaló Chromium con `npx playwright install chromium`
- Se creó `playwright.config.ts` — testDir `./tests/playwright`, baseURL `http://localhost:3000`, Chromium headless
- Se creó `tests/playwright/home.spec.js` — 3 tests sobre la página principal
- Se ignoraron artefactos `test-results/` y `playwright-report/` en `.gitignore`

**Resultado obtenido**

| Runner | Specs | Tests | Passing | Failing | Exit code |
|---|---|---|---|---|---|
| Playwright | 1 | 3 | 3 | 0 | 0 |
| Cypress | 5 | 12 | 12 | 0 | 0 |

**Aprendizaje clave**
Playwright no reemplaza automáticamente a Cypress; puede coexistir como segundo runner E2E
y aporta sintaxis `async/await`, soporte multi-browser real (incluyendo WebKit/Safari)
y traces integrados. Conocer ambas herramientas amplía el perfil profesional en QA.

**Comandos utilizados**
```powershell
# Instalación
npm install -D @playwright/test
npx playwright install chromium

# Ejecución de Playwright
npx playwright test

# Confirmación de Cypress sin regresiones
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

**¿Cómo lo explicaría una persona principiante?**
Cypress y Playwright son como dos cocineros que preparan el mismo plato con técnicas distintas.
Cypress te guía paso a paso y gestiona los tiempos internamente — vos le decís qué hacer y él
se encarga del cuándo. Playwright es más explícito: cada paso requiere que vos confirmes
que terminó (`await`) antes de pasar al siguiente. El resultado en el plato es idéntico;
la experiencia de cocinar es diferente.

**Vocabulario técnico (inglés)**
- *browser automation* = control programático de un navegador real
- *test runner* = herramienta que ejecuta y reporta resultados de tests
- *locator* = referencia a un elemento del DOM en Playwright
- *async/await* = modelo para operaciones asincrónicas en JavaScript
- *headless* = sin interfaz gráfica visible — el browser corre en segundo plano
- *trace* = registro completo de una ejecución de test para debugging

**Evidencia**
- Commit técnico: `b44f3e9 test(playwright): instalar Playwright y agregar spec inicial de homepage`
- Commit artefactos: `74c6275 chore(playwright): ignorar artefactos de ejecucion`
- Playwright: 3/3 passing — exit code 0
- Cypress post-instalación: 12/12 passing — exit code 0

**Pendientes**
- Agregar `page.route()` con stubbing para APIs externas
- Spec de navegación para páginas internas (`/marketplace`, `/consultores`)
- Cobertura multi-navegador con Firefox y WebKit

---

## Sesión 14 — Módulo 8: Cucumber BDD

**Fecha:** 2026-07-11 *(verificada: `5ee000d` `1aabeae`)*

**¿Qué aprendimos?**
Que BDD no reemplaza Cypress ni Playwright — agrega una capa de lenguaje de negocio que
permite expresar requisitos como escenarios ejecutables. Los mismos steps que alguien de
negocio puede leer (`Given el usuario abre la página principal`) se convierten en
automatización real gracias a las step definitions.

**Conceptos aprendidos**

- **BDD:** Behavior-Driven Development — enfoque que describe el comportamiento esperado del
  sistema con lenguaje entendible por negocio y tecnología.
- **Gherkin:** sintaxis estructurada con `Feature`, `Scenario`, `Given`, `When`, `Then` y `And`.
- **Feature:** funcionalidad o grupo de comportamientos descritos en un archivo `.feature`.
- **Scenario:** caso concreto dentro de una Feature — un comportamiento específico a probar.
- **Given:** contexto inicial del escenario.
- **When:** acción del usuario o del sistema.
- **Then:** resultado esperado después de la acción.
- **And:** continuación lógica de `Given`, `When` o `Then`.
- **Step Definition:** código que conecta una frase Gherkin con una acción automatizada.
- **Documentación viva:** los archivos `.feature` son documentación legible Y pruebas ejecutables al mismo tiempo.
- **`browser.newContext()`:** crea un contexto de navegación aislado en Playwright, con viewport
  definido. Necesario fuera del test runner de Playwright para garantizar renderizado correcto.

**Cambios aplicados**

- Se instaló `@cucumber/cucumber 13.0.0` como devDependency
- Se creó `cucumber.json` con paths a `features/` y `require` a step-definitions
- Se creó `features/home.feature` con 1 escenario BDD: cargar la página principal
- Se creó `features/step-definitions/home.steps.js` con `Before`/`After`, `setDefaultTimeout(60s)` y steps usando Playwright
- Se agregó el script `"cucumber": "cucumber-js"` en `package.json`

**Resultado obtenido**

| Runner | Resultado | Detalle |
|---|---|---|
| Cucumber | ✅ | 1 scenario passing, 5 steps (incluyendo hooks), exit code 0 |
| Playwright | ✅ | 3/3 passing, exit code 0 |
| Cypress | ✅ | 12/12 passing, 5 specs, exit code 0 |

**Aprendizaje clave**
BDD no reemplaza Cypress ni Playwright; agrega una capa de lenguaje de negocio que permite
expresar requisitos como escenarios ejecutables. Un archivo `.feature` puede ser leído por
alguien sin conocimiento técnico y ejecutado sin modificaciones por Cucumber. Esa doble
utilidad — documentación y prueba — es el valor central de BDD.

**Comandos utilizados**
```bash
npm install -D @cucumber/cucumber
npx cucumber-js
```

**¿Cómo lo explicaría una persona principiante?**
Antes, los tests estaban escritos en lenguaje de programación — solo alguien con
conocimiento técnico podía entender qué se estaba probando. Con BDD y Gherkin, el
escenario dice en palabras normales qué hace el usuario y qué debe pasar. Detrás de cada
frase hay código que lo ejecuta, pero la frase misma es documentación.

**Vocabulario técnico (inglés)**
- *BDD* = Behavior-Driven Development — desarrollo guiado por comportamiento
- *Gherkin* = lenguaje de escenarios BDD legible por humanos
- *feature file* = archivo `.feature` que contiene escenarios en Gherkin
- *step definition* = función que conecta una frase Gherkin con código de automatización
- *living documentation* = documentación viva — especificación que también es ejecutable

**Evidencia**
- Commit técnico: `5ee000d test(bdd): instalar Cucumber y agregar primer escenario BDD con Playwright`
- Cucumber: 1 scenario passing — exit code 0
- Playwright: 3/3 passing — exit code 0
- Cypress: 12/12 passing — exit code 0

---

## Sesión 15 — Módulo 9: Mobile Testing

**Fecha:** 2026-07-11 *(verificada: `e6a05f9` `65236cd`)*

**¿Qué aprendimos?**
Que mobile testing no significa instalar Appium siempre. Primero se debe identificar si
existe una app móvil real. Si el proyecto es web, una estrategia correcta es mobile web
testing con emulación de dispositivos — más rápida de implementar y sin dependencias de
entorno pesadas como JDK o Android SDK.

**Conceptos aprendidos**

- **Appium:** herramienta open source para automatizar apps nativas, híbridas y web mobile
  en Android/iOS. Requiere JDK, Android SDK, emulador/dispositivo real y APK o IPA.
- **Detox:** framework E2E para React Native con sincronización automática con el ciclo
  de vida de la app. Solo aplica a proyectos React Native.
- **Mobile web testing:** pruebas sobre una app web vista desde viewport y user agent móvil.
  No requiere app de tienda — es la web en un browser móvil.
- **App nativa:** compilada para Android o iOS. Accede a APIs del SO.
- **App híbrida:** WebView dentro de un contenedor nativo (Ionic, Capacitor, Cordova).
- **Web móvil:** sitio web responsive abierto desde browser móvil.
- **Emulador:** entorno virtual Android. Requiere Android Studio y Android SDK.
- **Dispositivo real:** hardware físico. Más fiel, más difícil de integrar en CI/CD.
- **accessibilityId / testID:** atributos estables para localizar elementos en pruebas
  móviles. Equivalente al `data-cy` de Cypress en el ecosistema mobile.
- **Responsive testing:** validación de que la interfaz se adapta a distintas resoluciones
  sin overflow ni superposición de elementos.
- **Playwright devices:** descriptores de dispositivos incluidos en `@playwright/test` que
  configuran viewport, user agent, deviceScaleFactor e `isMobile` para emulación mobile.

**Cambio aplicado**

- Se auditó el proyecto y se confirmó que es web Next.js — sin `android/`, `ios/`,
  React Native, Expo, Ionic, APK ni IPA.
- Se auditó el entorno Android — sin JDK, Android SDK, adb ni emulador disponibles.
- Se decidió no instalar Appium — no hay target real de ejecución.
- Se creó `tests/playwright/mobile-home.spec.js` con emulación iPhone 12 en Chromium.
- Se excluyó `defaultBrowserType: 'webkit'` del descriptor de iPhone 12 para compatibilidad
  con Chromium (único browser instalado).
- Se extendió el timeout a 60s para absorber compilación JIT de Next.js en mobile.
- Se validó: carga de Home, header visible, título no vacío, sin scroll horizontal, URL.

**Resultado obtenido**

| Runner | Resultado | Detalle |
|---|---|---|
| Playwright mobile | ✅ | 4/4 passing, exit code 0 |
| Playwright completo | ✅ | 7/7 passing (3 desktop + 4 mobile), exit code 0 |
| Cypress | ✅ | 12/12 passing, 5 specs, exit code 0 |
| Cucumber | ✅ | 1 scenario / 5 steps passing, exit code 0 |

**Aprendizaje clave**
Mobile testing no significa instalar Appium siempre. Primero se debe identificar si existe
app móvil real. Si el proyecto es web, la estrategia correcta es mobile web testing con
emulación de dispositivos: más rápida de implementar, sin dependencias de entorno pesadas,
y con evidencia de prueba inmediata.

**Comandos utilizados**
```bash
npx playwright test tests/playwright/mobile-home.spec.js
npx playwright test
npx cypress run
npx cucumber-js
```

**¿Cómo lo explicaría una persona principiante?**
Antes de comprar una cámara de seguridad para el jardín, primero hay que verificar si la casa
tiene jardín. Si el proyecto no tiene app móvil, instalar Appium es como comprar la cámara
sin jardín. Lo que sí se puede hacer es verificar que la ventana de la casa (la web) se vea
bien desde distintos tamaños de pantalla — eso es mobile web testing.

**Vocabulario técnico (inglés)**
- *Appium* = herramienta WebDriver para apps móviles nativas e híbridas
- *Detox* = framework E2E para React Native con sincronización automática
- *device emulation* = emulación de dispositivo — viewport, UA y touch simulados
- *responsive testing* = validación de adaptación a distintas resoluciones
- *native app* = app compilada para iOS/Android
- *hybrid app* = app con WebView dentro de contenedor nativo

**Evidencia**
- Commit técnico: `e6a05f9 test(mobile): agregar spec Playwright con emulación móvil iPhone 12`
- Playwright mobile: 4/4 passing — exit code 0
- Playwright completo: 7/7 passing — exit code 0
- Cypress: 12/12 passing — exit code 0
- Cucumber: 1 scenario passing — exit code 0

---

*Se agregarán nuevas sesiones a medida que avance el curso.*
