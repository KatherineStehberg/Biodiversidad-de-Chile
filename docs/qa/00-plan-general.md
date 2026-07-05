# Plan General QA — Biodiversidad de Chile

## Objetivo
Documentar el proceso completo de incorporación de pruebas automatizadas al proyecto
Biodiversidad de Chile, como evidencia del curso Test Automation Engineer.

## Estado inicial
Proyecto Next.js 15 funcional con backend Supabase, sin cobertura de pruebas
automatizadas, sin pipeline CI/CD y sin contenedorización.

## Problema detectado
No existe ninguna estrategia de QA definida. Cypress está instalado pero con
configuración incompleta y solo 2 archivos de prueba (1 roto). No existe
Playwright, Postman, Supertest, Cucumber, Appium, Docker ni CI/CD.

## Decisión tomada
Construir la cobertura QA de forma incremental, módulo a módulo, documentando
cada decisión antes de implementarla y esperando aprobación explícita antes de
modificar cualquier archivo.

## Cambios realizados
— (se completará módulo a módulo)

## Archivos modificados
— (se completará módulo a módulo)

## Comandos ejecutados
— (se completará módulo a módulo)

## Resultado obtenido
— (se completará módulo a módulo)

## Evidencias
— (se completará módulo a módulo)

## Errores encontrados
— (se completará módulo a módulo)

## Cómo se resolvieron
— (se completará módulo a módulo)

## Aprendizajes
— (se completará módulo a módulo)

## Pendientes
Completar todos los módulos del plan.

## Relación con el módulo del curso
Documento transversal que articula todos los módulos del curso.

---

## Módulos oficiales del curso

Estos corresponden a los módulos formales del curso Test Automation Engineer.
Los números de módulo son los asignados por el curso, no por este repositorio.

| Módulo del curso | Contenido | Documento QA del proyecto |
|---|---|---|
| Módulo 1 | Fundamentos del testing | `00a-modulo-1-fundamentos.md` |
| Módulo 2 | Git y entornos | `00b-modulo-2-git-entorno.md` |
| Módulo 3 | JavaScript aplicado al testing | `00c-modulo-3-javascript-testing.md` |
| Módulo 4 | Cypress básico | `03-cypress-basico.md` |
| Módulo 5 | Cypress avanzado | `04-cypress-avanzado.md` |
| Módulo 6 | Pruebas de API | `05-pruebas-api.md` |
| Módulo 7 | Playwright | `06-playwright.md` |
| Módulo 8 | BDD con Cucumber | `07-bdd-cucumber.md` |
| Módulo 9 | Appium | `08-appium.md` |
| Módulo 10 | CI/CD | `09-ci-cd.md` |
| Módulo 11 | Docker | `10-docker.md` |
| Módulo 12 | Flujo completo | `11-flujo-completo.md` |

---

## Fases internas del proyecto QA

Estas fases no corresponden directamente a módulos del curso, pero son necesarias
para que el proyecto sea testeable. Se documentan como contexto y prerequisito.

| Fase interna | Documento | Propósito |
|---|---|---|
| Auditoría inicial | `01-auditoria-inicial.md` | Conocer el estado real del proyecto antes de tocar nada |
| Estabilización | `02-estabilizacion-del-proyecto.md` | Garantizar que el proyecto compila y corre localmente |
| Evidencias | `12-evidencias.md` | Centralizar screenshots, reportes y artefactos de prueba |
| Guion video final | `13-guion-video-final.md` | Preparar la presentación final del trabajo |

---

## Stack tecnológico objetivo al finalizar el curso

| Herramienta | Rol |
|---|---|
| Cypress 15 | E2E: páginas, formularios, flujos de usuario |
| Playwright | E2E cross-browser, pruebas visuales |
| Supertest | Pruebas de integración de API routes Node.js |
| Postman / Newman | Colecciones de pruebas de API exportables |
| Cucumber + Gherkin | BDD: escenarios legibles por negocio |
| Appium | Práctica independiente — pruebas móviles (Módulo 9) |
| GitHub Actions | CI/CD: ejecutar pruebas en cada push / PR |
| Docker | Entorno reproducible para pruebas y despliegue |

---

## Reglas del proyecto documental

1. No se modifica código funcional sin aprobación explícita.
2. No se instalan dependencias sin aprobación explícita.
3. No se inventan resultados, comandos ni errores.
4. Cada módulo se propone antes de ejecutarse.
5. Los documentos se completan con hechos reales, no con intenciones.
6. Las credenciales de modo mock nunca se tratan como credenciales de producción.
