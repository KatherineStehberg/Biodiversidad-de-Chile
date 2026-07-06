# 04 — Cierre Módulo 4: Cypress Básico

**Fecha de cierre:** 2026-07-06
**Rama:** `qa-automation-course`
**Autor:** Katherine Stehberg

---

## Resumen ejecutivo

El Módulo 4 cubrió la configuración inicial de Cypress, la ejecución de las primeras
pruebas E2E del proyecto y el reemplazo de una prueba no aplicable por una prueba real
de contrato de API. Los 5 tests activos pasan en el entorno local cuando se aplica la
secuencia de inicio correcta.

---

## Estado del repositorio

| Campo        | Valor                                          |
|--------------|------------------------------------------------|
| Rama         | `qa-automation-course`                         |
| Remoto       | Sincronizado con `origin/qa-automation-course` |
| Working tree | Limpio — sin cambios pendientes                |
| `main`       | Sin modificaciones — `c977093`                 |

---

## Commits publicados en este módulo

| Hash      | Tipo    | Descripción                                                        |
|-----------|---------|--------------------------------------------------------------------|
| `68931ca` | `docs`  | estructura documental inicial del curso QA                         |
| `fd1a24c` | `docs`  | registrar ejecución Cypress y hallazgo QA-005                      |
| `a4e26e1` | `chore` | ignorar artefactos generados por Cypress                           |
| `132b84f` | `docs`  | registrar diagnóstico del test 1 y resultado 4/4 con calentamiento |
| `902a11b` | `test`  | reemplazar prueba de usuarios por API real de consultores          |

---

## Pruebas Cypress — estado final

| Archivo                             | Tests | Estado      | Nota                       |
|-------------------------------------|-------|-------------|----------------------------|
| `cypress/e2e/home.cy.js`            | 4     | ✅ Activo    | Sin modificar              |
| `cypress/e2e/api-consultants.cy.js` | 1     | ✅ Activo    | Nuevo en este módulo       |
| `cypress/e2e/api-usuarios.cy.js`    | —     | 🗑️ Eliminado | Reemplazado en este módulo |

---

## Resultados de ejecución

### `home.cy.js` — primera ejecución (sin calentamiento previo)

| # | Descripción                                    | Resultado | Duración  |
|---|------------------------------------------------|-----------|-----------|
| 1 | Debe cargar correctamente                      | ❌ FAILED  | ~35 s     |
| 2 | Debe validar la URL                            | ✅ Passed  | 8 692 ms  |
| 3 | Debe verificar que la página tenga un título   | ✅ Passed  | 5 350 ms  |
| 4 | Debe tomar una captura de la página principal  | ✅ Passed  | 17 942 ms |

**Resumen:** 3 passing, 1 failing — duración total 1 minuto 3 segundos.

**Error del test 1:**

```
CypressError: cy.visit() failed trying to load: http://localhost:3000/
Error: ESOCKETTIMEDOUT
```

En esta ejecución, Cypress agotó el tiempo de espera mientras la primera ruta aún
estaba siendo preparada por el servidor de desarrollo. Los tests 2, 3 y 4 pasaron
porque llegaron cuando esa preparación ya había concluido.

---

### `home.cy.js` — ejecución controlada con calentamiento previo

**Condiciones:**
- Servidor iniciado con `npm run dev`, se esperó respuesta HTTP 200.
- Solicitud de calentamiento: `Invoke-WebRequest http://localhost:3000/` confirmó
  HTTP 200 y 161 967 bytes recibidos — la ruta `/` estaba lista.
- Workaround QA-005 aplicado:

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
```

- Sin cambios en `home.cy.js`, `cypress.config.ts` ni timeouts.

| # | Descripción                                    | Resultado | Duración  |
|---|------------------------------------------------|-----------|-----------|
| 1 | Debe cargar correctamente                      | ✅ Passed  | 5 686 ms  |
| 2 | Debe validar la URL                            | ✅ Passed  | 7 037 ms  |
| 3 | Debe verificar que la página tenga un título   | ✅ Passed  | 3 810 ms  |
| 4 | Debe tomar una captura de la página principal  | ✅ Passed  | 14 449 ms |

**Resumen:** 4 passing, 0 failing — duración total 31 segundos. Exit code 0.

---

### `api-consultants.cy.js` — prueba de contrato de API

**Comando:**

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/api-consultants.cy.js"
```

| # | Descripción                                            | Resultado | Duración |
|---|--------------------------------------------------------|-----------|----------|
| 1 | GET /api/consultants responde con una estructura válida | ✅ Passed  | 4 364 ms |

**Resumen:** 1 passing, 0 failing — duración total 4 segundos. Exit code 0.

**Respuesta recibida:**

```json
{ "consultants": [] }
```

HTTP 200, Content-Type: application/json. El array vacío es una respuesta válida:
el test verifica el contrato (estructura), no el contenido de los datos.

---

## Hallazgos cerrados en este módulo

| ID     | Descripción                                          | Resolución                                                                       |
|--------|------------------------------------------------------|----------------------------------------------------------------------------------|
| QA-001 | `api-usuarios.cy.js` referencia endpoint inexistente | Reemplazado por `api-consultants.cy.js` — prueba real de `GET /api/consultants`  |
| QA-005 | Verificación del binario de Cypress falla al ejecutar | Workaround temporal: API .NET `SetEnvironmentVariable` en el mismo proceso       |

---

## Hallazgos pendientes (módulos futuros)

| ID     | Descripción                             | Módulo destino                                |
|--------|-----------------------------------------|-----------------------------------------------|
| QA-002 | TypeScript desactivado durante el build | Módulo 10 — CI/CD                             |
| QA-003 | ESLint desactivado durante el build     | Módulo 10 — CI/CD                             |
| QA-004 | Archivo `.env.example` ausente          | Módulo 10 — CI/CD / configuración de entornos |

---

## Aprendizajes técnicos

### Entorno y herramientas

- Se observó que `ELECTRON_RUN_AS_NODE` estaba activa en el entorno de ejecución
  usado para lanzar Cypress. Cypress.exe, al ser una aplicación Electron, se comporta
  como un proceso Node.js cuando `ELECTRON_RUN_AS_NODE` está activa — lo que hace que
  rechace sus propios flags de verificación (`--smoke-test`, `--ping`).
- El mecanismo `Remove-Item Env:VAR` y `$env:VAR = $null` pueden quedar bloqueados por
  hooks de seguridad del entorno. La API .NET
  `[System.Environment]::SetEnvironmentVariable` opera directamente sobre el bloque de
  entorno del proceso sin activar esos hooks. Este workaround es temporal y por proceso:
  no persiste entre sesiones ni modifica el sistema.

### Comportamiento del servidor de desarrollo

- En esta ejecución, Cypress agotó el tiempo de espera mientras la primera ruta aún
  estaba siendo preparada por el servidor de desarrollo. Una solicitud HTTP previa al
  servidor antes de iniciar Cypress garantizó que la ruta estuviera lista para los tests.
- `marketplace/page.tsx` es un Server Component: consulta Supabase directamente en el
  servidor y no emite solicitudes HTTP desde el navegador. No hay `GET /api/products`
  interceptable en esa página.
- `GET /api/products` devuelve HTTP 405 porque solo existe un handler `POST` para esa
  ruta.

### Conceptos Cypress

- `cy.request()` emite una solicitud HTTP directamente desde Cypress, sin pasar por el
  navegador. Es la herramienta correcta para verificar contratos de API de forma aislada
  y determinista.
- `cy.intercept()` observa solicitudes que la aplicación ya hace — no genera ninguna
  solicitud. Si la página nunca llama al endpoint interceptado, `cy.wait()` agota su
  timeout sin resultado. Su uso requiere confirmación previa de que la app efectivamente
  realiza esa llamada.
- El contrato de una API (método, ruta, código HTTP, Content-Type, estructura del body)
  es independiente del contenido de los datos. Un array vacío `[]` satisface el contrato
  si el contrato dice que el valor debe ser un array.
- Fallo de infraestructura vs. fallo de test: el fallo del test 1 de `home.cy.js` no era
  un defecto del código del test. La causa raíz era un problema de secuencia de inicio
  del entorno. Resolverlo no requirió modificar ningún archivo de prueba.

---

## Evidencias generadas

| Artefacto                                           | Tipo                        | Ubicación                         | Versionado              |
|-----------------------------------------------------|-----------------------------|-----------------------------------|-------------------------|
| `pagina-principal.png`                              | Captura solicitada (test 4) | `cypress/screenshots/home.cy.js/` | Excluido por `.gitignore` |
| `Página principal... (failed).png`                  | Captura automática de fallo | `cypress/screenshots/home.cy.js/` | Excluido por `.gitignore` |
| `docs/qa/03-cypress-basico.md`                      | Documentación del módulo    | `docs/qa/`                        | ✅ Versionado           |
| `docs/qa/hallazgos/QA-005-cypress-verify-falla.md`  | Hallazgo documentado        | `docs/qa/hallazgos/`              | ✅ Versionado           |
| `docs/curso-qa/01-bitacora-de-aprendizaje.md`       | Sesiones 3, 4 y 5           | `docs/curso-qa/`                  | ✅ Versionado           |

Los screenshots se gestionarán como artefactos de CI en el Módulo 10.

---

## Qué NO se modificó

- `cypress/e2e/home.cy.js` — sin cambios
- `cypress.config.ts` — sin cambios en este módulo
- `package.json` — sin cambios
- `src/` — ningún archivo de la aplicación
- Variables de entorno a nivel de usuario o sistema (Machine/User scope)
- Rama `main`

---

## Próximos pasos — Módulo 5

| Tema                                  | Descripción                                                                                                                                           |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Secuencia de inicio reproducible      | Formalizar el patrón servidor + calentamiento + workaround QA-005 como mecanismo documentado y repetible, sin depender de pasos manuales en cada ejecución |
| `beforeEach` como hook de preparación | Estudiar `beforeEach` como hook de preparación de tests, diferenciando cuándo sirve para setup real y cuándo puede ocultar problemas de infraestructura |
| Ampliar `home.cy.js`                  | Agregar pruebas de navbar, footer y navegación básica                                                                                                 |
| Ampliar `api-consultants.cy.js`       | Explorar assertions adicionales sobre el body de la respuesta                                                                                         |
| Scripts npm para Cypress              | Evaluar `cypress:run` y `cypress:open` en `package.json` con el workaround de QA-005 incorporado                                                     |
| Solución permanente de QA-005         | Elegir e implementar una de las tres opciones documentadas en `QA-005-cypress-verify-falla.md`                                                        |
