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
en la evidencia disponible y no es aplicable al estado actual del proyecto.

### Problema 3 — Sin scripts npm para Cypress
`package.json` no tiene scripts `cypress:open` ni `cypress:run`.

## Decisión tomada
- Documentar los 4 tests de `home.cy.js` como aprobados (resultado real,
  ejecutados localmente por la desarrolladora).
- Documentar `api-usuarios.cy.js` como no ejecutado y no aplicable al
  proyecto actual, pendiente de reemplazo por una prueba de un endpoint real.
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

### `home.cy.js` — 4 tests aprobados ✅

| # | Descripción | Resultado |
|---|---|---|
| 1 | Debe cargar correctamente | ✅ Aprobado |
| 2 | Debe validar la URL | ✅ Aprobado |
| 3 | Debe verificar que la página tenga un título | ✅ Aprobado |
| 4 | Debe tomar una captura de la página principal | ✅ Aprobado |

### `api-usuarios.cy.js` — test no ejecutado ⚠️

El archivo existe en el repositorio pero no llegó a ejecutarse.
Cypress reportaba inicialmente "no spec files were found".
La inspección posterior del código confirmó que el endpoint
`/api/usuarios` no existe en el proyecto, por lo que el archivo
no es aplicable al estado actual y está pendiente de reemplazo.

## Evidencias

### Screenshot generado
El test 4 de `home.cy.js` generó el archivo `pagina-principal.png`
correctamente en la ejecución local.

### Estado de versionado
La carpeta `cypress/screenshots/` existe en el repositorio pero aparece **vacía**
en la auditoría del commit inicial. La imagen `pagina-principal.png` fue generada
localmente pero aún no está versionada en el repositorio de GitHub.

> Pendiente: decidir si los screenshots de prueba deben commitearse, agregarse
> a `.gitignore`, o gestionarse como artefactos de CI.

## Errores encontrados
- Cypress reportaba "no spec files were found" antes de corregir la
  configuración.
- `api-usuarios.cy.js` no es aplicable: el endpoint `/api/usuarios`
  no existe en `src/app/api/`. El test nunca llegó a ejecutarse.

## Cómo se resolvieron
- El problema de configuración se abordó agregando `defineConfig` y
  `specPattern` explícito en `cypress.config.ts`.
- La situación de `api-usuarios.cy.js` no se resolvió en esta fase.
  Se traslada como pendiente de reemplazo (ver Pendientes).

## Aprendizajes
- Cypress requiere que la aplicación esté corriendo (`npm run dev`) antes de
  ejecutar las pruebas.
- Un archivo `.cy.js` puede existir en el repositorio y no ser aplicable
  si el endpoint o componente que referencia no existe en el proyecto.
- Los screenshots generados localmente no se versionan automáticamente si
  `cypress/screenshots/` está vacía en el commit o no se ha hecho push.

## Pendientes
- Reemplazar `api-usuarios.cy.js` por una prueba de un endpoint real
  (p. ej. `cy.request('GET', '/api/consultants')`).
- Agregar scripts `cypress:open` y `cypress:run` a `package.json`.
- Decidir la estrategia de versionado de screenshots.
- Ampliar `home.cy.js` con pruebas de navbar, footer y links de navegación.

## Relación con el módulo del curso
**Módulo 4 del curso.** Primeras pruebas E2E con Cypress. Introducción a
`cy.visit`, `cy.get`, `cy.url`, `cy.title`, `cy.screenshot` y
`cy.intercept`. Configuración de `baseUrl` y `specPattern`.
