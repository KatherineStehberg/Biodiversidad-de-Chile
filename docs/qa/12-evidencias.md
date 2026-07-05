# 12 — Evidencias

## Objetivo
Centralizar todas las evidencias visuales y reportes generados durante
el proceso de QA: screenshots, videos, reportes HTML y logs de CI.

## Estado inicial
La carpeta `cypress/screenshots/` existe en el repositorio pero está vacía
en el commit inicial. Un screenshot (`pagina-principal.png`) fue generado
localmente durante las pruebas del módulo 03, pero aún no está versionado.

## Problema detectado
No hay sistema de reporte configurado. Cypress genera screenshots localmente
pero no produce reportes HTML exportables en la configuración actual.

## Decisión tomada
Pendiente. Se definirá la estrategia de reporte al avanzar en los módulos.

## Cambios realizados
Ninguno aún.

## Archivos modificados
Ninguno aún.

## Comandos ejecutados
Ninguno aún.

## Resultado obtenido
Pendiente.

## Evidencias recopiladas hasta ahora

| Artefacto | Origen | Estado |
|---|---|---|
| `pagina-principal.png` | Cypress — test 4 de home.cy.js | Generado local, sin versionar |
| `cypress/screenshots/` | Cypress | Carpeta vacía en repositorio |
| `cypress.config.ts.bak` | Configuración anterior | Versionado en repositorio |

## Errores encontrados
Pendiente.

## Cómo se resolvieron
Pendiente.

## Aprendizajes
Pendiente.

## Pendientes
- Definir estrategia de versionado de screenshots:
  commit directo, `.gitignore`, o artefactos de CI.
- Configurar un reporter HTML (Mochawesome u otro).
- Registrar aquí cada evidencia generada en los módulos 03 al 11.

## Relación con el módulo del curso
Fase interna transversal. Las evidencias acompañan cada módulo y constituyen
la trazabilidad del trabajo realizado para la presentación final.
