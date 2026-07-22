# Línea base QA — Biodiversidad de Chile

Fecha: 2026-07-22
Rama: `qa/cypress-consultants-api`
Issue: #1

## Objetivo

Reanudar la fase de QA exactamente en el punto pendiente: crear una prueba Cypress con `cy.request()` para `GET /api/consultants`, antes de implementar mejoras funcionales o crear/cambiar la base de datos de Supabase.

## Cambios de esta fase

- Se creó `cypress/e2e/api-consultants.cy.js`.
- Se agregaron scripts reproducibles en `package.json`:
  - `npm run cy:open`
  - `npm run cy:run`
  - `npm run test:e2e`
- Se agregaron artefactos de Cypress a `.gitignore`.

## Contrato que valida la prueba

1. `GET /api/consultants` responde HTTP 200.
2. La respuesta es JSON.
3. El cuerpo contiene la propiedad `consultants`.
4. `consultants` es un arreglo.
5. La consulta pública por defecto solo devuelve registros con `isApproved: true`.

## Hallazgos de revisión estática

### P1 — acceso a perfiles pendientes mediante query string

El endpoint permite `includePending=true` y, actualmente, no exige autenticación ni autorización para esa variante. Antes de producción estable debe restringirse a una función administrativa autenticada o eliminarse del endpoint público.

### P1 — selección pública de todas las columnas

La consulta pública usa `select('*')`. Debe reemplazarse por una lista explícita de campos públicos para evitar exponer identificadores internos, datos de moderación o información privada presente en la tabla.

### P1 — asignación masiva en POST

El POST inserta o actualiza usando `...body`. Debe implementarse una lista permitida de campos y validación de esquema antes de escribir.

### P2 — falta de ejecución automatizada

Cypress está instalado, pero el repositorio no tenía scripts reproducibles ni una ejecución CI documentada. Los scripts quedan agregados en esta rama; la automatización CI se decidirá después de validar el entorno y las variables necesarias.

## Evidencia todavía pendiente

El código fue preparado en GitHub, pero la aplicación y Cypress aún deben ejecutarse en un entorno con dependencias y configuración válidas. No se declara la prueba como aprobada hasta registrar la salida real de:

```bash
npm install
npm run dev
npm run test:e2e -- --spec cypress/e2e/api-consultants.cy.js
```

## Orden posterior aprobado

1. Ejecutar y cerrar QA.
2. Corregir hallazgos en PR separados, comenzando por seguridad de endpoints.
3. Implementar mejoras de errores, accesibilidad, responsive, SEO y observabilidad.
4. Diseñar y crear la base de datos de Supabase al final, cuando el contrato de la aplicación esté estabilizado.

## Restricciones

- No incluir credenciales ni `.env`.
- No escribir en Supabase durante esta fase.
- No modificar `main` directamente.
- No mezclar correcciones de producto con esta PR de línea base QA.
