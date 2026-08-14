# QA-001 — Archivo api-usuarios.cy.js referencia endpoint inexistente

| Campo | Valor |
|---|---|
| ID | QA-001 |
| Fecha | 2026-07-04 |
| Entorno | Desarrollo local — modo mock activado |
| Fase interna del proyecto | Estabilización |
| Módulo oficial relacionado | Módulo 4 — Cypress básico |
| Severidad | Media |
| Prioridad | Alta |
| Estado | Prueba no ejecutada — no aplicable al estado actual del proyecto |

## Descripción
El archivo `cypress/e2e/api-usuarios.cy.js` contiene un test que intercepta
`GET /api/usuarios` y espera una respuesta con código HTTP 200. Sin embargo,
ese endpoint no existe en el proyecto. El test nunca llegó a ejecutarse:
Cypress informaba "no spec files were found" durante la fase de configuración.
La detección del problema con el endpoint fue posterior y por inspección de código.

## Método de detección
1. Revisar el contenido de `cypress/e2e/api-usuarios.cy.js`.
2. Confirmar que el test intercepta `GET /api/usuarios`.
3. Revisar el directorio `src/app/api/`.
4. Confirmar que `src/app/api/usuarios/route.ts` no existe.

## Resultado esperado
Existe un endpoint `GET /api/usuarios` en el proyecto que responde con
código 200 y un array de usuarios.

## Resultado real
El endpoint `/api/usuarios` no existe en `src/app/api/`. El test no es
aplicable al estado actual del proyecto.

## Evidencia
- Inspección directa de `cypress/e2e/api-usuarios.cy.js`
- Ausencia confirmada de `src/app/api/usuarios/route.ts`
- Mensaje de Cypress durante configuración: "no spec files were found"
- Documentado en: `docs/qa/03-cypress-basico.md`

## Impacto
El repositorio incluye un archivo de prueba que no puede ejecutarse ni
verificar ningún comportamiento real del sistema. Contamina el directorio
`cypress/e2e/` y puede confundir el estado del suite de pruebas.

## Decisión
Pendiente de aprobación.

## Acción propuesta
Reemplazar `api-usuarios.cy.js` por una prueba que use `cy.request()` sobre
un endpoint real. Candidato propuesto: `GET /api/products`.

> **Antes de implementarlo:** confirmar que la página `/marketplace` realiza
> efectivamente una solicitud a `GET /api/products` al cargar, para que el
> test tenga sentido funcional y no sea solo una llamada aislada.
> No reemplazar el archivo hasta contar con esa confirmación y aprobación.

## Rama de corrección
`qa/04-cypress-basico` (a crear al iniciar el módulo 4)

## Resultado de la corrección
Pendiente.
