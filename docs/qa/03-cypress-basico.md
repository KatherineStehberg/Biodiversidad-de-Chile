# 03 — Cypress Básico

## Objetivo
Configurar Cypress correctamente y documentar las primeras pruebas E2E del
proyecto: validación de carga de página, URL, título y screenshot.

## Estado inicial
Cypress 15.17.0 ya instalado como devDependency.
Dos archivos de prueba existentes: `cypress/e2e/home.cy.js` y
`cypress/e2e/api-usuarios.cy.js`.
La existencia de `cypress.config.ts.bak` indica que la configuración fue
modificada antes de esta documentación.

## Problema detectado

### Problema 1 — Cypress reportaba "no spec files were found"
Inicialmente Cypress informaba que no encontraba archivos de prueba
("no spec files were found"). Se agregó `defineConfig` al archivo de
configuración y se definió explícitamente el `specPattern` para incluir
las extensiones `.cy.{js,jsx,ts,tsx}`. Tras este cambio se continuó
diagnosticando el comportamiento de `api-usuarios.cy.js` de forma
independiente.

> Nota: `cypress.config.ts.bak` es la evidencia del estado anterior de la
> configuración, pero su contenido exacto no fue auditado en detalle.

### Problema 2 — `api-usuarios.cy.js`: test no ejecutado y no aplicable
De forma independiente al problema de configuración, se identificó por
inspección del código que el archivo `api-usuarios.cy.js` intercepta
`GET /api/usuarios`, pero ese endpoint no existe en el proyecto
(no hay `src/app/api/usuarios/route.ts`). El test nunca llegó a ejecutarse
en la evidencia disponible y no era aplicable al estado actual del proyecto.
Resuelto en Módulo 4: reemplazado por `api-consultants.cy.js`.

### Problema 3 — Sin scripts npm para Cypress
`package.json` no tiene scripts `cypress:open` ni `cypress:run`.

## Decisión tomada
- Documentar los 4 tests de `home.cy.js` como aprobados (resultado real,
  ejecutados localmente por la desarrolladora).
- Reemplazar `api-usuarios.cy.js` por `api-consultants.cy.js`, prueba real
  del endpoint `GET /api/consultants` mediante `cy.request()`.
- No modificar ni eliminar archivos sin aprobación.

## Cambios realizados
- Corrección de `cypress.config.ts`: se agregó `defineConfig` y se definió
  `specPattern` explícito.

## Archivos modificados
- `cypress.config.ts`

## Comandos ejecutados
Los siguientes comandos fueron ejecutados localmente por la desarrolladora
para correr las pruebas. No fueron ejecutados durante la auditoría de este
documento:

```bash
npx cypress open
npx cypress run
```

## Resultado obtenido

### Ejecución anterior — resultado local previo a esta documentación
Los 4 tests de `home.cy.js` habían sido ejecutados localmente por la
desarrolladora con resultado aprobado. Esa ejecución no fue reproducida
durante la fase de documentación inicial.

### Ejecución documentada — 2026-07-05

**Entorno:** rama `qa-automation-course`, servidor iniciado con `npm run dev`,
Cypress 15.17.0, Electron 138 (headless), Node v22.21.1.

**Workaround aplicado (QA-005):** `Remove-Item Env:ELECTRON_RUN_AS_NODE`
ejecutado en el mismo proceso antes de correr Cypress. Ver
`docs/qa/hallazgos/QA-005-cypress-verify-falla.md`.

**Comando:**
```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
npx cypress run --spec "cypress/e2e/home.cy.js"
```

**Resultados:**

| # | Descripción | Resultado | Duración |
|---|---|---|---|
| 1 | Debe cargar correctamente | ❌ FAILED | ~35 s |
| 2 | Debe validar la URL | ✅ Passed | 8 692 ms |
| 3 | Debe verificar que la página tenga un título | ✅ Passed | 5 350 ms |
| 4 | Debe tomar una captura de la página principal | ✅ Passed | 17 942 ms |

**Resumen:** 3 passing, 1 failing — duración total 1 minuto 3 segundos.

**Error del test 1:**
```
CypressError: cy.visit() failed trying to load: http://localhost:3000/
Error: ESOCKETTIMEDOUT
```

`ESOCKETTIMEDOUT` es un timeout a nivel de socket: la conexión TCP se
estableció pero no llegó respuesta HTTP dentro del tiempo esperado. El
servidor de desarrollo estaba en proceso de compilar la primera ruta (JIT)
cuando el test 1 inició. Los tests 2, 3 y 4 corrieron después de que test 1
agotó su timeout (~35 s), momento en que la compilación ya había completado.

Este comportamiento es un fallo de infraestructura, no un defecto del test.
La ruta `/` no estaba precompilada cuando Cypress inició. El Módulo 5 evaluará
estrategias para gestionar la compilación JIT en entornos de desarrollo.

### `api-usuarios.cy.js` — eliminado y reemplazado ✅

El archivo fue identificado como no aplicable: usaba
`cy.intercept('GET', '/api/usuarios')` sobre la página principal, pero ese
endpoint no existe en el proyecto y la página nunca realiza esa solicitud —
el interceptor nunca se habría activado. Fue eliminado y reemplazado por
`api-consultants.cy.js`. Ver sección siguiente.

### Ejecución controlada con calentamiento previo — 2026-07-05

**Hipótesis:** el test 1 fallaba porque `cy.visit()` llegó durante la
compilación JIT de la ruta `/`. Una solicitud HTTP previa al servidor antes
de iniciar Cypress obligaría a Next.js a compilar la ruta, y el test 1
debería pasar sin modificar el código.

**Condiciones de la prueba controlada:**
- Servidor iniciado con `npm run dev`, se esperó respuesta HTTP 200
- Solicitud de calentamiento: `Invoke-WebRequest http://localhost:3000/`
  confirmó HTTP 200 y 161 967 bytes recibidos — ruta `/` compilada
- Workaround QA-005 aplicado mediante API .NET:
  ```powershell
  [System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
  ```
- Sin cambios en `home.cy.js`, `cypress.config.ts` ni timeouts

**Resultados:**

| # | Descripción | Resultado | Duración |
|---|---|---|---|
| 1 | Debe cargar correctamente | ✅ Passed | 5 686 ms |
| 2 | Debe validar la URL | ✅ Passed | 7 037 ms |
| 3 | Debe verificar que la página tenga un título | ✅ Passed | 3 810 ms |
| 4 | Debe tomar una captura de la página principal | ✅ Passed | 14 449 ms |

**Resumen:** 4 passing, 0 failing — duración total 31 segundos.

**Conclusión confirmada:**
Next.js en modo desarrollo compila cada ruta bajo demanda (JIT). El primer
`cy.visit('http://localhost:3000')` del test 1 llegó mientras el servidor
aún compilaba la ruta `/`. El socket no recibió respuesta dentro del tiempo
de espera y se agotó. Los tests 2, 3 y 4 pasaron porque llegaron cuando la
compilación ya había finalizado.

La causa raíz era un problema de secuencia de inicio del entorno, no un
defecto del test. Resolverlo no requirió modificar `home.cy.js` ni aumentar
timeouts. El Módulo 5 evaluará cómo incorporar esta garantía dentro de la
secuencia de ejecución.

### `api-consultants.cy.js` — prueba real de API — 2026-07-06

**Contexto:** `api-usuarios.cy.js` fue reemplazado por `api-consultants.cy.js`.
El archivo original usaba `cy.intercept('GET', '/api/usuarios')` sobre la
página principal, pero ese endpoint no existe en el proyecto y la página
nunca realiza esa solicitud — el interceptor nunca se habría activado.

**`cy.request()` vs `cy.intercept()`:**

`cy.request()` realiza una solicitud HTTP directamente desde Cypress, sin
pasar por el navegador. No depende del comportamiento de ninguna página:
el test mismo emite la solicitud y verifica la respuesta. Es la herramienta
correcta para probar un endpoint de API de forma aislada.

`cy.intercept()` registra un observador sobre solicitudes que la aplicación
ya hace. No genera ninguna solicitud: solo escucha. Si la página nunca llama
al endpoint interceptado, el observador queda inactivo y `cy.wait()` agota
su tiempo de espera sin resultado. Para que `cy.intercept()` sea útil debe
haber confirmación previa de que la app efectivamente realiza esa solicitud.

En este caso ninguna página llama a `GET /api/consultants` al cargar, por lo
que `cy.request()` fue la opción correcta: el test es directo, determinista
y no depende del comportamiento de ninguna interfaz.

**Comando:**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/api-consultants.cy.js"
```

**Resultado:**

| # | Descripción | Resultado | Duración |
|---|---|---|---|
| 1 | GET /api/consultants responde con una estructura válida | ✅ Passed | 4 364 ms |

**Resumen:** 1 passing, 0 failing — duración total 4 segundos. Exit code 0.

**Respuesta recibida:**
```json
{ "consultants": [] }
```
HTTP 200, Content-Type: application/json. Array vacío — respuesta válida:
el test verifica el contrato de la API (estructura), no el contenido de
los datos.

## Evidencias

### Screenshots generadas — 2026-07-05

| Archivo | Tipo | Tamaño | Resolución |
|---|---|---|---|
| `pagina-principal.png` | Captura solicitada (test 4) | 3.6 MB | 1000×8871 px |
| `Página principal del proyecto -- Debe cargar correctamente (failed).png` | Captura automática de fallo | 39 KB | 1280×720 px |

Ruta: `cypress/screenshots/home.cy.js/`

### Estado de versionado
`cypress/screenshots/` **está en `.gitignore`** desde el commit `a4e26e1`
(`chore(git): ignorar artefactos generados por Cypress`). Las capturas
generadas localmente no se incluyen en commits. Los screenshots se
gestionarán como artefactos de CI en el módulo 10.

## Errores encontrados
- Cypress reportaba "no spec files were found" antes de corregir la
  configuración.
- `api-usuarios.cy.js` no era aplicable: el endpoint `/api/usuarios` no
  existe en `src/app/api/`. El archivo fue reemplazado por
  `api-consultants.cy.js`.

## Cómo se resolvieron
- El problema de configuración se abordó agregando `defineConfig` y
  `specPattern` explícito en `cypress.config.ts`.
- `api-usuarios.cy.js` fue reemplazado por `api-consultants.cy.js`, que
  prueba el endpoint real `GET /api/consultants` con `cy.request()`.
  Resultado: 1/1 passing.

## Aprendizajes
- Cypress requiere que la aplicación esté corriendo (`npm run dev`) antes de
  ejecutar las pruebas.
- Un archivo `.cy.js` puede existir en el repositorio y no ser aplicable
  si el endpoint o componente que referencia no existe en el proyecto.
- Los screenshots generados localmente no se versionan automáticamente si
  `cypress/screenshots/` está vacía en el commit o no se ha hecho push.

## Pendientes
- Agregar scripts `cypress:open` y `cypress:run` a `package.json`.
- Decidir la estrategia de versionado de screenshots en el módulo 10.
- Ampliar `home.cy.js` con pruebas de navbar, footer y links de navegación.

## Relación con el módulo del curso
**Módulo 4 del curso.** Primeras pruebas E2E con Cypress. Introducción a
`cy.visit`, `cy.get`, `cy.url`, `cy.title`, `cy.screenshot`, `cy.intercept`
y `cy.request`. Configuración de `baseUrl` y `specPattern`.
