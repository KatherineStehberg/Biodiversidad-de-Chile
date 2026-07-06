# Bitácora de Aprendizaje — Test Automation Engineer
## Proyecto: Biodiversidad de Chile

---

## Sesión 1 — Auditoría inicial del proyecto

**Fecha:** 2026-07-04

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

*Se agregarán nuevas sesiones a medida que avance el curso.*
