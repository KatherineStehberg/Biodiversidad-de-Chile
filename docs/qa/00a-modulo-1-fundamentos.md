# Módulo 1 — Fundamentos del Testing

## Objetivo
Aplicar los conceptos fundamentales del testing de software al análisis del
proyecto Biodiversidad de Chile: tipos de pruebas, pirámide de testing,
criterios de calidad y planificación de una estrategia QA desde cero.

## Estado inicial
El proyecto no tiene ninguna prueba automatizada ni estrategia de QA definida
al momento de iniciar el curso. La única excepción son 2 archivos Cypress
existentes, uno de los cuales está roto.

## Problema detectado
Sin una comprensión de los fundamentos, es imposible decidir qué probar, en qué
orden, con qué herramienta y con qué criterio de aceptación. El proyecto tiene
código funcional real pero cero cobertura de pruebas documentada.

## Decisión tomada
Antes de instalar herramientas o escribir pruebas, mapear el proyecto a la
pirámide de testing e identificar qué capas existen, cuáles faltan y cuáles
son prioritarias.

## Cambios realizados
Ninguno en código. Este módulo es teórico-analítico aplicado al proyecto real.

## Archivos modificados
Ninguno.

## Comandos ejecutados
Ninguno.

## Resultado obtenido

### Pirámide de testing aplicada a Biodiversidad de Chile

```
        /\
       /E2E\          ← Cypress, Playwright
      /------\
     / Integr.\       ← Supertest, Postman (API Routes)
    /----------\
   /  Unitarias \     ← Pendiente — no existe ninguna
  /--------------\
```

| Capa | Herramienta prevista | Estado actual |
|---|---|---|
| Unitarias | Jest / Vitest | No existe |
| Integración (API) | Supertest, Postman | No existe |
| E2E | Cypress, Playwright | Cypress instalado, cobertura mínima |

### Tipos de prueba identificados para el proyecto

| Tipo | Aplica en este proyecto | Ejemplo concreto |
|---|---|---|
| Funcionales | Sí | Login, publicar oferta, ver consultores |
| No funcionales | Sí | Headers de seguridad en middleware |
| De regresión | Sí | Verificar que login sigue funcionando tras cambios |
| De integración | Sí | API `/api/consultants` → Supabase |
| E2E | Sí | Flujo completo: registro → login → publicar → ver |
| De API | Sí | Validar contratos de los 19 endpoints |
| De rendimiento | Fuera de alcance del curso | — |
| Manuales | Ya realizadas (informales) | Verificación visual durante desarrollo |

### Criterios de calidad identificados

- **Correctitud:** las páginas cargan y los datos se muestran correctamente.
- **Seguridad:** el middleware aplica headers de seguridad en todas las rutas.
- **Autenticación:** las rutas protegidas requieren sesión activa.
- **Consistencia de datos:** los endpoints devuelven la estructura esperada.
- **Resiliencia:** el modo mock permite pruebas sin Supabase real.

### Conceptos del módulo aplicados al proyecto

| Concepto | Aplicación en Biodiversidad de Chile |
|---|---|
| Caso de prueba | Cada `it()` en los archivos `.cy.js` |
| Suite de prueba | Cada `describe()` en Cypress |
| Fixture | `cypress/fixtures/example.json` (sin uso real aún) |
| Asserción | `cy.get('body').should('be.visible')` |
| Smoke test | `home.cy.js` — verifica que la página carga |
| Test roto | `api-usuarios.cy.js` — endpoint inexistente |
| Entorno de prueba | `localhost:3000` con modo mock activado |

## Evidencias
- Análisis basado en la auditoría del repositorio (`01-auditoria-inicial.md`).
- Código fuente de `cypress/e2e/home.cy.js` y `cypress/e2e/api-usuarios.cy.js`.

## Errores encontrados
No aplica en este módulo (no se ejecutó código).

## Cómo se resolvieron
No aplica.

## Aprendizajes
- La pirámide de testing muestra que este proyecto está invertido: tiene E2E
  básico pero carece completamente de pruebas unitarias y de integración.
- Un proyecto real y funcional puede tener cero cobertura de pruebas.
  "Funciona" y "está probado" no son sinónimos.
- El modo mock de este proyecto es un activo de testing: permite diseñar
  pruebas sin depender de infraestructura externa (Supabase, n8n, Flow).

## Pendientes
- Definir casos de prueba formales para cada módulo del curso.
- Evaluar en qué módulo agregar pruebas unitarias (fuera del alcance actual).

## Relación con el módulo del curso
**Módulo 1 del curso.** Fundamentos del testing — tipos de pruebas, pirámide
de testing, criterios de calidad y vocabulario base para el resto del curso.
